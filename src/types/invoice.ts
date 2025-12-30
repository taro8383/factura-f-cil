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
  nif: string;
  logo?: string;
}

export interface ClientInfo {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  nif: string;
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
  descuentoTipo: 'porcentaje' | 'fijo';
  descuentoValor: number;
  descuentoMonto: number;
  total: number;
  notas: string;
  instruccionesPago: string;
  creadoEn: string;
}

export const MONEDAS = [
  { codigo: 'EUR', simbolo: '€', nombre: 'Euro' },
  { codigo: 'USD', simbolo: '$', nombre: 'Dólar Estadounidense' },
  { codigo: 'MXN', simbolo: '$', nombre: 'Peso Mexicano' },
  { codigo: 'ARS', simbolo: '$', nombre: 'Peso Argentino' },
  { codigo: 'COP', simbolo: '$', nombre: 'Peso Colombiano' },
  { codigo: 'CLP', simbolo: '$', nombre: 'Peso Chileno' },
  { codigo: 'PEN', simbolo: 'S/', nombre: 'Sol Peruano' },
  { codigo: 'GBP', simbolo: '£', nombre: 'Libra Esterlina' },
];

export const TASAS_IMPUESTOS = [
  { valor: 0, etiqueta: 'Sin IVA (0%)' },
  { valor: 4, etiqueta: 'IVA Superreducido (4%)' },
  { valor: 10, etiqueta: 'IVA Reducido (10%)' },
  { valor: 16, etiqueta: 'IVA (16%)' },
  { valor: 19, etiqueta: 'IVA (19%)' },
  { valor: 21, etiqueta: 'IVA General (21%)' },
];

export const TERMINOS_PAGO = [
  { valor: 'contado', etiqueta: 'Contado' },
  { valor: '15dias', etiqueta: '15 días' },
  { valor: '30dias', etiqueta: '30 días' },
  { valor: '45dias', etiqueta: '45 días' },
  { valor: '60dias', etiqueta: '60 días' },
  { valor: '90dias', etiqueta: '90 días' },
];

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
      nif: 'B12345678',
      logo: undefined,
    },
    cliente: {
      nombre: 'Cliente Ejemplo S.L.',
      direccion: 'Avenida Secundaria 456, 08001 Barcelona, España',
      telefono: '+34 934 567 890',
      email: 'cliente@ejemplo.com',
      nif: 'B87654321',
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
  };
};
