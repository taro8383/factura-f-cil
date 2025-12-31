import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    // App header
    appTitle: 'Generador de Facturas',
    appDescription: 'Crea facturas profesionales fácilmente',

    // Sections
    companyInfo: 'Información de la Empresa',
    clientInfo: 'Información del Cliente',
    invoiceDetails: 'Detalles de la Factura',
    itemsTable: 'Artículos',
    totals: 'Totales',
    footer: 'Notas y Pagos',

    // Form fields
    companyName: 'Nombre de la Empresa',
    companyCuit: 'CUIT/CUIL',
    address: 'Dirección',
    phone: 'Teléfono',
    email: 'Email',
    logo: 'Logo',
    clientName: 'Nombre del Cliente',
    clientCuit: 'CUIT/CUIL',

    // Invoice details
    invoiceNumber: 'Número de Factura',
    invoiceDate: 'Fecha de Factura',
    dueDate: 'Fecha de Vencimiento',
    paymentTerms: 'Términos de Pago',
    currency: 'Moneda',
    accentColor: 'Color de Acento',

    // Items table
    description: 'Descripción',
    quantity: 'Cantidad',
    unitPrice: 'Precio Unit.',
    total: 'Total',
    addItem: 'Agregar Artículo',
    removeItem: 'Eliminar',
    noItems: 'No hay artículos',

    // Totals
    subtotal: 'Subtotal',
    discount: 'Descuento',
    taxRate: 'Impuesto',
    totalAmount: 'TOTAL',

    // Footer
    notes: 'Notas',
    paymentInstructions: 'Instrucciones de Pago',

    // Buttons
    save: 'Guardar',
    generatePdf: 'Generar PDF',
    print: 'Imprimir',
    clear: 'Nueva Factura',
    history: 'Historial',
    duplicate: 'Duplicar',
    delete: 'Eliminar',
    noHistory: 'No hay facturas guardadas',
    load: 'Cargar',

    // Payment terms
    paymentCash: 'Contado',
    payment15days: '15 días',
    payment30days: '30 días',
    payment45days: '45 días',
    payment60days: '60 días',
    payment90days: '90 días',

    // Taxes
    taxNoVat: 'Sin IVA (0%)',
    taxSuperReduced: 'IVA Superreducido (4%)',
    taxReduced: 'IVA Reducido (10%)',
    taxStandard16: 'IVA (16%)',
    taxStandard19: 'IVA (19%)',
    taxGeneral: 'IVA General (21%)',

    // Currencies
    currencyEUR: 'Euro',
    currencyUSD: 'Dólar Estadounidense',
    currencyMXN: 'Peso Mexicano',
    currencyARS: 'Peso Argentino',
    currencyCOP: 'Peso Colombiano',
    currencyCLP: 'Peso Chileno',
    currencyPEN: 'Sol Peruano',
    currencyGBP: 'Libra Esterlina',

    // PDF labels
    pdfInvoice: 'FACTURA',
    pdfFrom: 'DE:',
    pdfTo: 'PARA:',
    pdfDate: 'Fecha',
    pdfDueDate: 'Vencimiento',
    pdfPayment: 'Pago',
    pdfCurrency: 'Moneda',
    pdfNotes: 'Notas',
    pdfPaymentInstructions: 'Instrucciones de Pago',

    // Placeholders
    placeholderCompanyName: 'Mi Empresa S.A.',
    placeholderCompanyAddress: 'Calle Principal 123, 28001 Madrid, España',
    placeholderCompanyPhone: '+34 912 345 678',
    placeholderCompanyEmail: 'contacto@miempresa.com',
    placeholderCompanyCuit: '20-12345678-9',
    placeholderClientName: 'Cliente Ejemplo S.L.',
    placeholderClientAddress: 'Avenida Secundaria 456, 08001 Barcelona, España',
    placeholderClientPhone: '+34 934 567 890',
    placeholderClientEmail: 'cliente@ejemplo.com',
    placeholderClientCuit: '30-87654321-0',
    placeholderInvoiceNumber: 'FAC-2024-001',
    placeholderPaymentTerms: 'Seleccionar términos',
    placeholderCurrency: 'Seleccionar moneda',
    placeholderDescription: 'Descripción del artículo o servicio',

    // Toasts
    toastSaved: 'Factura guardada',
    toastSavedDesc: '{numero} guardada en el historial.',
    toastPdfGenerated: 'PDF generado',
    toastPdfDesc: 'El archivo se ha descargado.',
    toastNewInvoice: 'Nueva factura',
    toastNewInvoiceDesc: 'Formulario reiniciado.',

    // Visibility
    showInPdf: 'Mostrar en PDF',
    hideInPdf: 'Ocultar en PDF',
  },
  en: {
    // App header
    appTitle: 'Invoice Generator',
    appDescription: 'Create professional invoices easily',

    // Sections
    companyInfo: 'Company Information',
    clientInfo: 'Client Information',
    invoiceDetails: 'Invoice Details',
    itemsTable: 'Items',
    totals: 'Totals',
    footer: 'Notes & Payments',

    // Form fields
    companyName: 'Company Name',
    companyCuit: 'Tax ID',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    logo: 'Logo',
    clientName: 'Client Name',
    clientCuit: 'Tax ID',

    // Invoice details
    invoiceNumber: 'Invoice Number',
    invoiceDate: 'Invoice Date',
    dueDate: 'Due Date',
    paymentTerms: 'Payment Terms',
    currency: 'Currency',
    accentColor: 'Accent Color',

    // Items table
    description: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    total: 'Total',
    addItem: 'Add Item',
    removeItem: 'Remove',
    noItems: 'No items',

    // Totals
    subtotal: 'Subtotal',
    discount: 'Discount',
    taxRate: 'Tax',
    totalAmount: 'TOTAL',

    // Footer
    notes: 'Notes',
    paymentInstructions: 'Payment Instructions',

    // Buttons
    save: 'Save',
    generatePdf: 'Generate PDF',
    print: 'Print',
    clear: 'New Invoice',
    history: 'History',
    duplicate: 'Duplicate',
    delete: 'Delete',
    noHistory: 'No saved invoices',
    load: 'Load',

    // Payment terms
    paymentCash: 'Cash',
    payment15days: '15 days',
    payment30days: '30 days',
    payment45days: '45 days',
    payment60days: '60 days',
    payment90days: '90 days',

    // Taxes
    taxNoVat: 'No VAT (0%)',
    taxSuperReduced: 'Super-reduced VAT (4%)',
    taxReduced: 'Reduced VAT (10%)',
    taxStandard16: 'VAT (16%)',
    taxStandard19: 'VAT (19%)',
    taxGeneral: 'Standard VAT (21%)',

    // Currencies
    currencyEUR: 'Euro',
    currencyUSD: 'US Dollar',
    currencyMXN: 'Mexican Peso',
    currencyARS: 'Argentine Peso',
    currencyCOP: 'Colombian Peso',
    currencyCLP: 'Chilean Peso',
    currencyPEN: 'Peruvian Sol',
    currencyGBP: 'Pound Sterling',

    // PDF labels
    pdfInvoice: 'INVOICE',
    pdfFrom: 'FROM:',
    pdfTo: 'TO:',
    pdfDate: 'Date',
    pdfDueDate: 'Due Date',
    pdfPayment: 'Payment',
    pdfCurrency: 'Currency',
    pdfNotes: 'Notes',
    pdfPaymentInstructions: 'Payment Instructions',

    // Placeholders
    placeholderCompanyName: 'My Company Inc.',
    placeholderCompanyAddress: '123 Main St, 10001 New York, USA',
    placeholderCompanyPhone: '+1 234 567 8900',
    placeholderCompanyEmail: 'contact@mycompany.com',
    placeholderCompanyCuit: '12-3456789-0',
    placeholderClientName: 'Example Client LLC',
    placeholderClientAddress: '456 Second Ave, 90001 Los Angeles, USA',
    placeholderClientPhone: '+1 345 678 9012',
    placeholderClientEmail: 'client@example.com',
    placeholderClientCuit: '98-7654321-1',
    placeholderInvoiceNumber: 'INV-2024-001',
    placeholderPaymentTerms: 'Select terms',
    placeholderCurrency: 'Select currency',
    placeholderDescription: 'Item or service description',

    // Toasts
    toastSaved: 'Invoice saved',
    toastSavedDesc: '{numero} saved to history.',
    toastPdfGenerated: 'PDF generated',
    toastPdfDesc: 'The file has been downloaded.',
    toastNewInvoice: 'New invoice',
    toastNewInvoiceDesc: 'Form reset.',

    // Visibility
    showInPdf: 'Show in PDF',
    hideInPdf: 'Hide in PDF',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved === 'en' || saved === 'es') ? saved : 'es';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
