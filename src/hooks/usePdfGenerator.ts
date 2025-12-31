import { useCallback } from 'react';
import { Invoice, MONEDAS, TERMINOS_PAGO, TASAS_IMPUESTOS } from '@/types/invoice';
import { Language } from '@/contexts/LanguageContext';

const getPdfLabels = (language: Language) => ({
  invoice: language === 'en' ? 'INVOICE' : 'FACTURA',
  from: language === 'en' ? 'FROM:' : 'DE:',
  to: language === 'en' ? 'TO:' : 'PARA:',
  date: language === 'en' ? 'Date' : 'Fecha',
  dueDate: language === 'en' ? 'Due Date' : 'Vencimiento',
  payment: language === 'en' ? 'Payment' : 'Pago',
  currency: language === 'en' ? 'Currency' : 'Moneda',
  notes: language === 'en' ? 'Notes' : 'Notas',
  paymentInstructions: language === 'en' ? 'Payment Instructions' : 'Instrucciones de Pago',
});

export const usePdfGenerator = () => {
  const formatCurrency = useCallback((amount: number, monedaCodigo: string) => {
    const moneda = MONEDAS.find(m => m.codigo === monedaCodigo);
    return `${moneda?.simbolo || '$'}${amount.toFixed(2)}`;
  }, []);

  const generatePdf = useCallback(async (invoice: Invoice, language: Language = 'es') => {
    const { default: jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Parse accent color from hex to RGB
    const hexToRgb = (hex: string): [number, number, number] => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [79, 70, 229]; // Default indigo
    };

    const primaryColor = hexToRgb(invoice.colorAccento || '#4f46e5');
    const textColor: [number, number, number] = [31, 41, 55];
    const mutedColor: [number, number, number] = [107, 114, 128];
    const vis = invoice.camposVisibles;
    const labels = getPdfLabels(language);

    // Helper functions
    const setFont = (style: 'normal' | 'bold' = 'normal', size = 10) => {
      pdf.setFontSize(size);
      pdf.setFont('helvetica', style);
    };

    const drawText = (text: string, x: number, yPos: number, options?: { color?: [number, number, number]; align?: 'left' | 'right' | 'center'; maxWidth?: number }) => {
      pdf.setTextColor(...(options?.color || textColor));
      if (options?.maxWidth) {
        pdf.text(text, x, yPos, { maxWidth: options.maxWidth, align: options?.align });
      } else {
        pdf.text(text, x, yPos, { align: options?.align });
      }
    };

    // === HEADER with Logo ===
    if (invoice.empresa.logo) {
      try {
        const img = new Image();
        img.src = invoice.empresa.logo;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        
        if (img.complete && img.naturalWidth > 0) {
          const maxLogoHeight = 20;
          const maxLogoWidth = 50;
          const ratio = Math.min(maxLogoWidth / img.naturalWidth, maxLogoHeight / img.naturalHeight);
          const logoWidth = img.naturalWidth * ratio;
          const logoHeight = img.naturalHeight * ratio;
          pdf.addImage(invoice.empresa.logo, 'PNG', margin, y, logoWidth, logoHeight);
        }
      } catch {
        // Logo failed to load
      }
    }

    // Invoice title on the right
    setFont('bold', 24);
    drawText(labels.invoice, pageWidth - margin, y + 8, { color: primaryColor, align: 'right' });

    if (vis.numero) {
      setFont('normal', 11);
      drawText(invoice.numero, pageWidth - margin, y + 15, { align: 'right' });
    }

    y += 30;

    // === COMPANY & CLIENT INFO SIDE BY SIDE ===
    const colWidth = (contentWidth - 10) / 2;

    // Company info
    setFont('bold', 10);
    drawText(labels.from, margin, y, { color: mutedColor });
    y += 5;
    
    if (vis.empresaNombre) {
      setFont('bold', 11);
      drawText(invoice.empresa.nombre, margin, y);
      y += 5;
    }
    
    setFont('normal', 9);
    const empresaLines: string[] = [];
    if (vis.empresaCuit && invoice.empresa.cuit) empresaLines.push(`CUIT: ${invoice.empresa.cuit}`);
    if (vis.empresaDireccion && invoice.empresa.direccion) empresaLines.push(invoice.empresa.direccion);
    if (vis.empresaTelefono && invoice.empresa.telefono) empresaLines.push(invoice.empresa.telefono);
    if (vis.empresaEmail && invoice.empresa.email) empresaLines.push(invoice.empresa.email);
    
    empresaLines.forEach((line) => {
      drawText(line, margin, y, { color: mutedColor, maxWidth: colWidth });
      y += 4;
    });

    // Reset Y for client info (right column)
    const empresaBlockHeight = (vis.empresaNombre ? 5 : 0) + empresaLines.length * 4;
    let clientY = y - empresaBlockHeight;
    const rightColX = margin + colWidth + 10;

    setFont('bold', 10);
    drawText(labels.to, rightColX, clientY, { color: mutedColor });
    clientY += 5;
    
    if (vis.clienteNombre) {
      setFont('bold', 11);
      drawText(invoice.cliente.nombre, rightColX, clientY);
      clientY += 5;
    }
    
    setFont('normal', 9);
    const clienteLines: string[] = [];
    if (vis.clienteCuit && invoice.cliente.cuit) clienteLines.push(`CUIT: ${invoice.cliente.cuit}`);
    if (vis.clienteDireccion && invoice.cliente.direccion) clienteLines.push(invoice.cliente.direccion);
    if (vis.clienteTelefono && invoice.cliente.telefono) clienteLines.push(invoice.cliente.telefono);
    if (vis.clienteEmail && invoice.cliente.email) clienteLines.push(invoice.cliente.email);
    
    clienteLines.forEach((line) => {
      drawText(line, rightColX, clientY, { color: mutedColor, maxWidth: colWidth });
      clientY += 4;
    });

    y = Math.max(y, clientY) + 8;

    // === INVOICE DETAILS ===
    const termino = TERMINOS_PAGO.find(t => t.valor === invoice.terminosPago);
    const terminoEtiqueta = language === 'en' && termino?.etiquetaEn ? termino.etiquetaEn : termino?.etiqueta || invoice.terminosPago;

    // Count visible fields
    const visibleFieldsCount = [
      vis.fechaFactura,
      vis.fechaVencimiento,
      vis.terminosPago,
      vis.moneda
    ].filter(Boolean).length;

    if (visibleFieldsCount > 0) {
      pdf.setFillColor(245, 247, 250);
      pdf.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');

      y += 8;
      setFont('normal', 9);

      let xOffset = 5;
      const fieldSpacing = contentWidth / visibleFieldsCount;

      if (vis.fechaFactura) {
        drawText(`${labels.date}: ${invoice.fechaFactura}`, margin + xOffset, y, { color: textColor });
        xOffset += fieldSpacing;
      }
      if (vis.fechaVencimiento) {
        drawText(`${labels.dueDate}: ${invoice.fechaVencimiento}`, margin + xOffset, y, { color: textColor });
        xOffset += fieldSpacing;
      }
      if (vis.terminosPago) {
        drawText(`${labels.payment}: ${terminoEtiqueta}`, margin + xOffset, y, { color: textColor });
        xOffset += fieldSpacing;
      }
      if (vis.moneda) {
        drawText(`${labels.currency}: ${invoice.moneda}`, margin + xOffset, y, { color: textColor });
      }

      y += 12;
    }

    // === ITEMS TABLE ===
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, y, contentWidth, 8, 'F');

    setFont('bold', 9);
    pdf.setTextColor(255, 255, 255);

    const descWidth = contentWidth * 0.45;
    const qtyWidth = contentWidth * 0.15;
    const priceWidth = contentWidth * 0.2;

    const tableHeaders = language === 'en'
      ? ['Description', 'Quantity', 'Unit Price', 'Total']
      : ['Descripción', 'Cantidad', 'Precio Unit.', 'Total'];

    pdf.text(tableHeaders[0], margin + 3, y + 5.5);
    pdf.text(tableHeaders[1], margin + descWidth + qtyWidth / 2, y + 5.5, { align: 'center' });
    pdf.text(tableHeaders[2], margin + descWidth + qtyWidth + priceWidth / 2, y + 5.5, { align: 'center' });
    pdf.text(tableHeaders[3], margin + contentWidth - 3, y + 5.5, { align: 'right' });

    y += 8;

    const simbolo = MONEDAS.find(m => m.codigo === invoice.moneda)?.simbolo || '$';
    
    invoice.articulos.forEach((item, index) => {
      const rowHeight = 7;
      
      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 252);
        pdf.rect(margin, y, contentWidth, rowHeight, 'F');
      }
      
      setFont('normal', 9);
      pdf.setTextColor(...textColor);
      
      const maxDescLength = 45;
      const desc = item.descripcion.length > maxDescLength 
        ? item.descripcion.substring(0, maxDescLength) + '...' 
        : item.descripcion;
      
      pdf.text(desc, margin + 3, y + 5);
      pdf.text(item.cantidad.toString(), margin + descWidth + qtyWidth / 2, y + 5, { align: 'center' });
      pdf.text(`${simbolo}${item.precioUnitario.toFixed(2)}`, margin + descWidth + qtyWidth + priceWidth / 2, y + 5, { align: 'center' });
      pdf.text(`${simbolo}${item.total.toFixed(2)}`, margin + contentWidth - 3, y + 5, { align: 'right' });
      
      y += rowHeight;
    });

    pdf.setDrawColor(229, 231, 235);
    pdf.rect(margin, y - invoice.articulos.length * 7, contentWidth, invoice.articulos.length * 7);

    y += 8;

    // === TOTALS ===
    const totalsX = margin + contentWidth - 70;

    setFont('normal', 9);
    drawText(language === 'en' ? 'Subtotal:' : 'Subtotal:', totalsX, y, { color: mutedColor });
    drawText(`${simbolo}${invoice.subtotal.toFixed(2)}`, margin + contentWidth, y, { align: 'right' });
    y += 5;

    if (invoice.descuentoMonto > 0) {
      const descuentoLabel = invoice.descuentoTipo === 'porcentaje'
        ? (language === 'en' ? `Discount (${invoice.descuentoValor}%):` : `Descuento (${invoice.descuentoValor}%):`)
        : (language === 'en' ? 'Discount:' : 'Descuento:');
      drawText(descuentoLabel, totalsX, y, { color: mutedColor });
      drawText(`-${simbolo}${invoice.descuentoMonto.toFixed(2)}`, margin + contentWidth, y, { color: [220, 38, 38], align: 'right' });
      y += 5;
    }

    const tasa = TASAS_IMPUESTOS.find(t => t.valor === invoice.tasaImpuestos);
    let tasaLabel: string;
    if (invoice.tasaImpuestos === -1) {
      // Custom tax rate
      const customRate = invoice.tasaImpuestosCustom || 0;
      tasaLabel = language === 'en' ? `VAT (${customRate}%)` : `IVA (${customRate}%)`;
    } else if (tasa) {
      tasaLabel = language === 'en' && tasa.etiquetaEn ? tasa.etiquetaEn : tasa.etiqueta;
    } else {
      // Shouldn't happen, but fallback
      tasaLabel = language === 'en' ? `VAT (${invoice.tasaImpuestos}%)` : `IVA (${invoice.tasaImpuestos}%)`;
    }
    drawText(tasaLabel + ':', totalsX, y, { color: mutedColor });
    drawText(`${simbolo}${invoice.impuestosMonto.toFixed(2)}`, margin + contentWidth, y, { align: 'right' });
    y += 6;

    pdf.setFillColor(...primaryColor);
    pdf.roundedRect(totalsX - 5, y - 1, 75, 10, 2, 2, 'F');

    setFont('bold', 11);
    pdf.setTextColor(255, 255, 255);
    pdf.text(language === 'en' ? 'TOTAL:' : 'TOTAL:', totalsX, y + 6);
    pdf.text(`${simbolo}${invoice.total.toFixed(2)} ${invoice.moneda}`, margin + contentWidth - 2, y + 6, { align: 'right' });

    y += 18;

    // === FOOTER: Notes & Payment Instructions ===
    const showNotas = vis.notas && invoice.notas;
    const showInstr = vis.instruccionesPago && invoice.instruccionesPago;

    if (showNotas || showInstr) {
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, y, margin + contentWidth, y);
      y += 8;

      if (showNotas) {
        setFont('bold', 9);
        drawText(labels.notes + ':', margin, y, { color: mutedColor });
        y += 5;
        setFont('normal', 8);
        const notasLines = pdf.splitTextToSize(invoice.notas, contentWidth / 2 - 5);
        notasLines.slice(0, 3).forEach((line: string) => {
          drawText(line, margin, y, { color: textColor });
          y += 4;
        });
      }

      if (showInstr) {
        let instrY = y - (showNotas ? 9 + Math.min(3, pdf.splitTextToSize(invoice.notas, contentWidth / 2 - 5).length) * 4 : 0);
        const instrX = margin + contentWidth / 2 + 5;

        if (!showNotas) instrY = y - 8;

        setFont('bold', 9);
        drawText(labels.paymentInstructions + ':', instrX, instrY, { color: mutedColor });
        instrY += 5;
        setFont('normal', 8);
        const instrLines = pdf.splitTextToSize(invoice.instruccionesPago, contentWidth / 2 - 10);
        instrLines.slice(0, 4).forEach((line: string) => {
          drawText(line, instrX, instrY, { color: textColor });
          instrY += 4;
        });
      }
    }

    const fileName = language === 'en'
      ? `Invoice_${invoice.numero}_${invoice.fechaFactura}.pdf`
      : `Factura_${invoice.numero}_${invoice.fechaFactura}.pdf`;
    pdf.save(fileName);
  }, []);

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  return { generatePdf, printInvoice, formatCurrency };
};
