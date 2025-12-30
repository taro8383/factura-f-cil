import { useCallback } from 'react';
import { Invoice, MONEDAS, TERMINOS_PAGO, TASAS_IMPUESTOS } from '@/types/invoice';

export const usePdfGenerator = () => {
  const formatCurrency = useCallback((amount: number, monedaCodigo: string) => {
    const moneda = MONEDAS.find(m => m.codigo === monedaCodigo);
    return `${moneda?.simbolo || '$'}${amount.toFixed(2)}`;
  }, []);

  const generatePdf = useCallback(async (invoice: Invoice) => {
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

    // Colors
    const primaryColor: [number, number, number] = [79, 70, 229]; // #4f46e5
    const textColor: [number, number, number] = [31, 41, 55];
    const mutedColor: [number, number, number] = [107, 114, 128];

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
    // Add logo if exists
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
        // Logo failed to load, continue without it
      }
    }

    // Invoice title on the right
    setFont('bold', 24);
    drawText('FACTURA', pageWidth - margin, y + 8, { color: primaryColor, align: 'right' });
    
    setFont('normal', 11);
    drawText(invoice.numero, pageWidth - margin, y + 15, { align: 'right' });

    y += 30;

    // === COMPANY & CLIENT INFO SIDE BY SIDE ===
    const colWidth = (contentWidth - 10) / 2;

    // Company info
    setFont('bold', 10);
    drawText('DE:', margin, y, { color: mutedColor });
    y += 5;
    
    setFont('bold', 11);
    drawText(invoice.empresa.nombre, margin, y);
    y += 5;
    
    setFont('normal', 9);
    const empresaLines = [
      invoice.empresa.nif ? `NIF: ${invoice.empresa.nif}` : '',
      invoice.empresa.direccion,
      invoice.empresa.telefono,
      invoice.empresa.email,
    ].filter(Boolean);
    
    empresaLines.forEach((line) => {
      drawText(line, margin, y, { color: mutedColor, maxWidth: colWidth });
      y += 4;
    });

    // Reset Y for client info (right column)
    let clientY = y - empresaLines.length * 4 - 10;
    const rightColX = margin + colWidth + 10;

    setFont('bold', 10);
    drawText('PARA:', rightColX, clientY, { color: mutedColor });
    clientY += 5;
    
    setFont('bold', 11);
    drawText(invoice.cliente.nombre, rightColX, clientY);
    clientY += 5;
    
    setFont('normal', 9);
    const clienteLines = [
      invoice.cliente.nif ? `NIF: ${invoice.cliente.nif}` : '',
      invoice.cliente.direccion,
      invoice.cliente.telefono,
      invoice.cliente.email,
    ].filter(Boolean);
    
    clienteLines.forEach((line) => {
      drawText(line, rightColX, clientY, { color: mutedColor, maxWidth: colWidth });
      clientY += 4;
    });

    y = Math.max(y, clientY) + 8;

    // === INVOICE DETAILS ===
    const termino = TERMINOS_PAGO.find(t => t.valor === invoice.terminosPago)?.etiqueta || invoice.terminosPago;
    
    pdf.setFillColor(245, 247, 250);
    pdf.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F');
    
    y += 8;
    setFont('normal', 9);
    const detailsSpacing = contentWidth / 4;
    
    drawText(`Fecha: ${invoice.fechaFactura}`, margin + 5, y, { color: textColor });
    drawText(`Vencimiento: ${invoice.fechaVencimiento}`, margin + detailsSpacing, y, { color: textColor });
    drawText(`Pago: ${termino}`, margin + detailsSpacing * 2, y, { color: textColor });
    drawText(`Moneda: ${invoice.moneda}`, margin + detailsSpacing * 3, y, { color: textColor });

    y += 12;

    // === ITEMS TABLE ===
    // Table header
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, y, contentWidth, 8, 'F');
    
    setFont('bold', 9);
    pdf.setTextColor(255, 255, 255);
    
    const descWidth = contentWidth * 0.45;
    const qtyWidth = contentWidth * 0.15;
    const priceWidth = contentWidth * 0.2;
    const totalWidth = contentWidth * 0.2;
    
    pdf.text('Descripción', margin + 3, y + 5.5);
    pdf.text('Cantidad', margin + descWidth + qtyWidth / 2, y + 5.5, { align: 'center' });
    pdf.text('Precio Unit.', margin + descWidth + qtyWidth + priceWidth / 2, y + 5.5, { align: 'center' });
    pdf.text('Total', margin + contentWidth - 3, y + 5.5, { align: 'right' });

    y += 8;

    // Table rows
    const simbolo = MONEDAS.find(m => m.codigo === invoice.moneda)?.simbolo || '$';
    
    invoice.articulos.forEach((item, index) => {
      const rowHeight = 7;
      
      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 252);
        pdf.rect(margin, y, contentWidth, rowHeight, 'F');
      }
      
      setFont('normal', 9);
      pdf.setTextColor(...textColor);
      
      // Truncate description if too long
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

    // Table border
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(margin, y - invoice.articulos.length * 7, contentWidth, invoice.articulos.length * 7);

    y += 8;

    // === TOTALS ===
    const totalsX = margin + contentWidth - 70;
    const totalsWidth = 70;

    // Subtotal
    setFont('normal', 9);
    drawText('Subtotal:', totalsX, y, { color: mutedColor });
    drawText(`${simbolo}${invoice.subtotal.toFixed(2)}`, margin + contentWidth, y, { align: 'right' });
    y += 5;

    // Descuento
    if (invoice.descuentoMonto > 0) {
      const descuentoLabel = invoice.descuentoTipo === 'porcentaje' 
        ? `Descuento (${invoice.descuentoValor}%):` 
        : 'Descuento:';
      drawText(descuentoLabel, totalsX, y, { color: mutedColor });
      drawText(`-${simbolo}${invoice.descuentoMonto.toFixed(2)}`, margin + contentWidth, y, { color: [220, 38, 38], align: 'right' });
      y += 5;
    }

    // Impuestos
    const tasaLabel = TASAS_IMPUESTOS.find(t => t.valor === invoice.tasaImpuestos)?.etiqueta || `IVA (${invoice.tasaImpuestos}%)`;
    drawText(tasaLabel + ':', totalsX, y, { color: mutedColor });
    drawText(`${simbolo}${invoice.impuestosMonto.toFixed(2)}`, margin + contentWidth, y, { align: 'right' });
    y += 6;

    // Total
    pdf.setFillColor(...primaryColor);
    pdf.roundedRect(totalsX - 5, y - 1, totalsWidth + 5, 10, 2, 2, 'F');
    
    setFont('bold', 11);
    pdf.setTextColor(255, 255, 255);
    pdf.text('TOTAL:', totalsX, y + 6);
    pdf.text(`${simbolo}${invoice.total.toFixed(2)} ${invoice.moneda}`, margin + contentWidth - 2, y + 6, { align: 'right' });

    y += 18;

    // === FOOTER: Notes & Payment Instructions ===
    if (invoice.notas || invoice.instruccionesPago) {
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, y, margin + contentWidth, y);
      y += 8;

      if (invoice.notas) {
        setFont('bold', 9);
        drawText('Notas:', margin, y, { color: mutedColor });
        y += 5;
        setFont('normal', 8);
        const notasLines = pdf.splitTextToSize(invoice.notas, contentWidth / 2 - 5);
        notasLines.slice(0, 3).forEach((line: string) => {
          drawText(line, margin, y, { color: textColor });
          y += 4;
        });
      }

      if (invoice.instruccionesPago) {
        let instrY = y - (invoice.notas ? 9 + Math.min(3, pdf.splitTextToSize(invoice.notas, contentWidth / 2 - 5).length) * 4 : 0);
        const instrX = margin + contentWidth / 2 + 5;
        
        if (!invoice.notas) instrY = y - 8;
        
        setFont('bold', 9);
        drawText('Instrucciones de Pago:', instrX, instrY, { color: mutedColor });
        instrY += 5;
        setFont('normal', 8);
        const instrLines = pdf.splitTextToSize(invoice.instruccionesPago, contentWidth / 2 - 10);
        instrLines.slice(0, 4).forEach((line: string) => {
          drawText(line, instrX, instrY, { color: textColor });
          instrY += 4;
        });
      }
    }

    // Save PDF
    const fileName = `Factura_${invoice.numero}_${invoice.fechaFactura}.pdf`;
    pdf.save(fileName);
  }, []);

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  return { generatePdf, printInvoice, formatCurrency };
};
