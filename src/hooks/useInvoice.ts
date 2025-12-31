import { useState, useEffect, useCallback } from 'react';
import { Invoice, InvoiceItem, getDefaultInvoice, getDefaultFieldVisibility } from '@/types/invoice';

const STORAGE_KEY = 'factura_actual';
const HISTORY_KEY = 'facturas_historial';

// Migration function to ensure all visibility fields exist
const migrateInvoiceVisibility = (invoice: any): Invoice => {
  const defaultVisibility = getDefaultFieldVisibility();
  return {
    ...invoice,
    camposVisibles: {
      ...defaultVisibility,
      ...invoice.camposVisibles,
    },
    // Ensure tasaImpuestosCustom exists if tasaImpuestos is -1
    ...(invoice.tasaImpuestos === -1 && !invoice.tasaImpuestosCustom ? { tasaImpuestosCustom: 10 } : {}),
  };
};

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<Invoice>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return migrateInvoiceVisibility(JSON.parse(saved));
      } catch {
        return getDefaultInvoice();
      }
    }
    return getDefaultInvoice();
  });

  const [history, setHistory] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((inv: any) => migrateInvoiceVisibility(inv));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  }, [invoice]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const calculateTotals = useCallback((articulos: InvoiceItem[], tasaImpuestos: number, descuentoTipo: 'porcentaje' | 'fijo', descuentoValor: number, tasaImpuestosCustom?: number) => {
    const subtotal = articulos.reduce((sum, item) => sum + item.total, 0);
    const descuentoMonto = descuentoTipo === 'porcentaje'
      ? (subtotal * descuentoValor) / 100
      : descuentoValor;
    const baseImponible = subtotal - descuentoMonto;
    const actualTasaImpuestos = tasaImpuestos === -1 ? (tasaImpuestosCustom || 0) : tasaImpuestos;
    const impuestosMonto = (baseImponible * actualTasaImpuestos) / 100;
    const total = baseImponible + impuestosMonto;

    return { subtotal, descuentoMonto, impuestosMonto, total };
  }, []);

  const updateInvoice = useCallback((updates: Partial<Invoice>) => {
    setInvoice(prev => {
      const newInvoice = { ...prev, ...updates };

      // Recalculate totals if relevant fields changed
      if ('articulos' in updates || 'tasaImpuestos' in updates || 'tasaImpuestosCustom' in updates || 'descuentoTipo' in updates || 'descuentoValor' in updates) {
        const totals = calculateTotals(
          newInvoice.articulos,
          newInvoice.tasaImpuestos,
          newInvoice.descuentoTipo,
          newInvoice.descuentoValor,
          newInvoice.tasaImpuestosCustom
        );
        return { ...newInvoice, ...totals };
      }

      return newInvoice;
    });
  }, [calculateTotals]);

  const addItem = useCallback(() => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      total: 0,
    };
    updateInvoice({ articulos: [...invoice.articulos, newItem] });
  }, [invoice.articulos, updateInvoice]);

  const updateItem = useCallback((id: string, updates: Partial<InvoiceItem>) => {
    const newArticulos = invoice.articulos.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.cantidad * updated.precioUnitario;
        return updated;
      }
      return item;
    });
    updateInvoice({ articulos: newArticulos });
  }, [invoice.articulos, updateInvoice]);

  const removeItem = useCallback((id: string) => {
    if (invoice.articulos.length <= 1) return;
    updateInvoice({ articulos: invoice.articulos.filter(item => item.id !== id) });
  }, [invoice.articulos, updateInvoice]);

  const clearInvoice = useCallback(() => {
    const newInvoice = getDefaultInvoice();
    // Generate new invoice number based on history
    const lastNumber = history.length > 0 
      ? parseInt(history[history.length - 1].numero.split('-').pop() || '0') 
      : 0;
    newInvoice.numero = `FAC-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(3, '0')}`;
    setInvoice(newInvoice);
  }, [history]);

  const saveToHistory = useCallback(() => {
    const invoiceToSave = { ...invoice, creadoEn: new Date().toISOString() };
    setHistory(prev => {
      const existingIndex = prev.findIndex(i => i.id === invoice.id);
      if (existingIndex >= 0) {
        const newHistory = [...prev];
        newHistory[existingIndex] = invoiceToSave;
        return newHistory;
      }
      return [...prev, invoiceToSave];
    });
  }, [invoice]);

  const loadFromHistory = useCallback((id: string) => {
    const found = history.find(i => i.id === id);
    if (found) {
      setInvoice(found);
    }
  }, [history]);

  const duplicateFromHistory = useCallback((id: string) => {
    const found = history.find(i => i.id === id);
    if (found) {
      const duplicated = {
        ...found,
        id: crypto.randomUUID(),
        numero: `FAC-${new Date().getFullYear()}-${String(history.length + 1).padStart(3, '0')}`,
        fechaFactura: new Date().toISOString().split('T')[0],
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        creadoEn: new Date().toISOString(),
      };
      setInvoice(duplicated);
    }
  }, [history]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
  }, []);

  return {
    invoice,
    history,
    updateInvoice,
    addItem,
    updateItem,
    removeItem,
    clearInvoice,
    saveToHistory,
    loadFromHistory,
    duplicateFromHistory,
    deleteFromHistory,
  };
};
