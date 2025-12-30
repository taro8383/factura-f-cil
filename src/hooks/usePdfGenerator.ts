import { useCallback } from 'react';
import { Invoice, MONEDAS } from '@/types/invoice';

export const usePdfGenerator = () => {
  const formatCurrency = useCallback((amount: number, monedaCodigo: string) => {
    const moneda = MONEDAS.find(m => m.codigo === monedaCodigo);
    return `${moneda?.simbolo || '$'}${amount.toFixed(2)} ${monedaCodigo}`;
  }, []);

  const generatePdf = useCallback(async (invoice: Invoice, elementId: string) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const element = document.getElementById(elementId);
    if (!element) return;

    // Create a clone for PDF generation
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '800px';
    clone.style.padding = '40px';
    clone.style.background = 'white';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    // Remove no-print elements
    clone.querySelectorAll('.no-print').forEach(el => el.remove());

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `Factura_${invoice.numero}_${invoice.fechaFactura}.pdf`;
      pdf.save(fileName);
    } finally {
      document.body.removeChild(clone);
    }
  }, []);

  const printInvoice = useCallback(() => {
    window.print();
  }, []);

  return { generatePdf, printInvoice, formatCurrency };
};
