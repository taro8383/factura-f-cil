export interface InvoiceItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface CompanyInfo {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  cuit: string;
  logo?: string;
}

export interface ClientInfo {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  cuit: string;
}

export interface FieldVisibility {
  empresaNombre: boolean;
  empresaDireccion: boolean;
  empresaTelefono: boolean;
  empresaEmail: boolean;
  empresaCuit: boolean;
  clienteNombre: boolean;
  clienteDireccion: boolean;
  clienteTelefono: boolean;
  clienteEmail: boolean;
  clienteCuit: boolean;
  numero: boolean;
  fechaFactura: boolean;
  fechaVencimiento: boolean;
  terminosPago: boolean;
  moneda: boolean;
  notas: boolean;
  instruccionesPago: boolean;
}

export interface Invoice {
  id: string;
  numero: string;
  fechaFactura: string;
  fechaVencimiento: string;
  terminosPago: string;
  moneda: string;
  empresa: CompanyInfo;
  cliente: ClientInfo;
  articulos: InvoiceItem[];
  subtotal: number;
  tasaImpuestos: number;
  impuestosMonto: number;
  tasaImpuestosCustom?: number; // For custom tax rates when tasaImpuestos is -1
  descuentoTipo: 'porcentaje' | 'fijo';
  descuentoValor: number;
  descuentoMonto: number;
  total: number;
  notas: string;
  instruccionesPago: string;
  creadoEn: string;
  camposVisibles: FieldVisibility;
  colorAccento: string;
}

export const MONEDAS = [
  { codigo: 'EUR', simbolo: '€', nombre: 'Euro', nombreEn: 'Euro' },
  { codigo: 'USD', simbolo: '$', nombre: 'Dólar Estadounidense', nombreEn: 'US Dollar' },
  { codigo: 'MXN', simbolo: '$', nombre: 'Peso Mexicano', nombreEn: 'Mexican Peso' },
  { codigo: 'ARS', simbolo: '$', nombre: 'Peso Argentino', nombreEn: 'Argentine Peso' },
  { codigo: 'COP', simbolo: '$', nombre: 'Peso Colombiano', nombreEn: 'Colombian Peso' },
  { codigo: 'CLP', simbolo: '$', nombre: 'Peso Chileno', nombreEn: 'Chilean Peso' },
  { codigo: 'PEN', simbolo: 'S/', nombre: 'Sol Peruano', nombreEn: 'Peruvian Sol' },
  { codigo: 'GBP', simbolo: '£', nombre: 'Libra Esterlina', nombreEn: 'Pound Sterling' },
];

export const TASAS_IMPUESTOS = [
  { valor: 0, etiqueta: 'Sin IVA (0%)', etiquetaEn: 'No VAT (0%)' },
  { valor: 4, etiqueta: 'IVA Superreducido (4%)', etiquetaEn: 'Super-reduced VAT (4%)' },
  { valor: 10, etiqueta: 'IVA Reducido (10%)', etiquetaEn: 'Reduced VAT (10%)' },
  { valor: 16, etiqueta: 'IVA (16%)', etiquetaEn: 'VAT (16%)' },
  { valor: 19, etiqueta: 'IVA (19%)', etiquetaEn: 'VAT (19%)' },
  { valor: 21, etiqueta: 'IVA General (21%)', etiquetaEn: 'Standard VAT (21%)' },
  { valor: -1, etiqueta: 'Personalizado', etiquetaEn: 'Custom' },
];

export const TERMINOS_PAGO = [
  { valor: 'contado', etiqueta: 'Contado', etiquetaEn: 'Cash' },
  { valor: '15dias', etiqueta: '15 días', etiquetaEn: '15 days' },
  { valor: '30dias', etiqueta: '30 días', etiquetaEn: '30 days' },
  { valor: '45dias', etiqueta: '45 días', etiquetaEn: '45 days' },
  { valor: '60dias', etiqueta: '60 días', etiquetaEn: '60 days' },
  { valor: '90dias', etiqueta: '90 días', etiquetaEn: '90 days' },
];

export const getDefaultFieldVisibility = (): FieldVisibility => ({
  empresaNombre: true,
  empresaDireccion: true,
  empresaTelefono: true,
  empresaEmail: true,
  empresaCuit: true,
  clienteNombre: true,
  clienteDireccion: true,
  clienteTelefono: true,
  clienteEmail: true,
  clienteCuit: true,
  numero: true,
  fechaFactura: true,
  fechaVencimiento: true,
  terminosPago: true,
  moneda: true,
  notas: true,
  instruccionesPago: true,
});

export const getDefaultInvoice = (): Invoice => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    id: crypto.randomUUID(),
    numero: `FAC-${today.getFullYear()}-001`,
    fechaFactura: today.toISOString().split('T')[0],
    fechaVencimiento: dueDate.toISOString().split('T')[0],
    terminosPago: '30dias',
    moneda: 'EUR',
    empresa: {
      nombre: 'Mi Empresa S.A.',
      direccion: 'Calle Principal 123, 28001 Madrid, España',
      telefono: '+34 912 345 678',
      email: 'contacto@miempresa.com',
      cuit: '20-12345678-9',
      logo: undefined,
    },
    cliente: {
      nombre: 'Cliente Ejemplo S.L.',
      direccion: 'Avenida Secundaria 456, 08001 Barcelona, España',
      telefono: '+34 934 567 890',
      email: 'cliente@ejemplo.com',
      cuit: '30-87654321-0',
    },
    articulos: [
      {
        id: crypto.randomUUID(),
        descripcion: 'Servicio de Consultoría',
        cantidad: 5,
        precioUnitario: 100,
        total: 500,
      },
      {
        id: crypto.randomUUID(),
        descripcion: 'Desarrollo de Software',
        cantidad: 10,
        precioUnitario: 75,
        total: 750,
      },
    ],
    subtotal: 1250,
    tasaImpuestos: 21,
    impuestosMonto: 262.5,
    descuentoTipo: 'porcentaje',
    descuentoValor: 0,
    descuentoMonto: 0,
    total: 1512.5,
    notas: 'Gracias por su confianza. Esta factura es válida como comprobante fiscal.',
    instruccionesPago: 'Transferencia bancaria a la cuenta: ES12 3456 7890 1234 5678 9012\nBanco: Banco Ejemplo\nConcepto: Factura FAC-2024-001',
    creadoEn: today.toISOString(),
    camposVisibles: getDefaultFieldVisibility(),
    colorAccento: '#4f46e5',
  };
};
