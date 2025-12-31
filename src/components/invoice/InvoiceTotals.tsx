import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, TASAS_IMPUESTOS, MONEDAS } from '@/types/invoice';
import { useLanguage } from '@/contexts/LanguageContext';

interface InvoiceTotalsProps {
  invoice: Invoice;
  onChange: (updates: Partial<Invoice>) => void;
}

export const InvoiceTotals = ({ invoice, onChange }: InvoiceTotalsProps) => {
  const { t, language } = useLanguage();
  const simboloMoneda = MONEDAS.find(m => m.codigo === invoice.moneda)?.simbolo || '$';

  const isCustomTax = invoice.tasaImpuestos === -1;
  const actualTaxRate = isCustomTax ? (invoice.tasaImpuestosCustom || 10) : invoice.tasaImpuestos;

  const handleTaxSelectChange = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue === -1) {
      // Switching to custom mode
      onChange({
        tasaImpuestos: -1,
        tasaImpuestosCustom: invoice.tasaImpuestosCustom || 10
      });
    } else {
      // Selecting a predefined rate
      onChange({
        tasaImpuestos: numValue,
        tasaImpuestosCustom: undefined
      });
    }
  };

  const handleCustomTaxChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({
      tasaImpuestosCustom: numValue
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{t('totals')}</h3>

      <div className="max-w-md ml-auto space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">{t('subtotal')}:</span>
          <span className="font-medium">{simboloMoneda}{invoice.subtotal.toFixed(2)}</span>
        </div>

        {/* Descuento */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-muted-foreground whitespace-nowrap">{t('discount')}:</Label>
            <Select
              value={invoice.descuentoTipo}
              onValueChange={(value: 'porcentaje' | 'fijo') => onChange({ descuentoTipo: value })}
            >
              <SelectTrigger className="w-28 no-print">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="porcentaje">%</SelectItem>
                <SelectItem value="fijo">{simboloMoneda}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={invoice.descuentoValor}
              onChange={(e) => onChange({ descuentoValor: parseFloat(e.target.value) || 0 })}
              className="w-24 text-right no-print"
            />
            <span className="font-medium text-destructive ml-auto">
              -{simboloMoneda}{invoice.descuentoMonto.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Impuestos */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Label className="text-muted-foreground whitespace-nowrap mt-2">{t('taxRate')}:</Label>
            <div className="flex-1 space-y-2">
              <Select
                value={invoice.tasaImpuestos.toString()}
                onValueChange={handleTaxSelectChange}
              >
                <SelectTrigger className="w-48 no-print">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASAS_IMPUESTOS.map((tasa) => (
                    <SelectItem key={tasa.valor} value={tasa.valor.toString()}>
                      {language === 'en' && tasa.etiquetaEn ? tasa.etiquetaEn : tasa.etiqueta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isCustomTax && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={actualTaxRate}
                    onChange={(e) => handleCustomTaxChange(e.target.value)}
                    className="w-24 text-right no-print"
                    placeholder="10"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              )}
            </div>
            <span className="font-medium ml-auto mt-2">
              +{simboloMoneda}{invoice.impuestosMonto.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t-2 border-primary bg-invoice-accent rounded-lg px-4 mt-4">
          <span className="text-lg font-bold text-foreground">{t('totalAmount')}:</span>
          <span className="text-2xl font-bold text-primary">
            {simboloMoneda}{invoice.total.toFixed(2)} {invoice.moneda}
          </span>
        </div>
      </div>
    </div>
  );
};
