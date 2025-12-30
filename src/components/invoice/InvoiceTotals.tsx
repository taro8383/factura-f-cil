import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, TASAS_IMPUESTOS, MONEDAS } from '@/types/invoice';

interface InvoiceTotalsProps {
  invoice: Invoice;
  onChange: (updates: Partial<Invoice>) => void;
}

export const InvoiceTotals = ({ invoice, onChange }: InvoiceTotalsProps) => {
  const simboloMoneda = MONEDAS.find(m => m.codigo === invoice.moneda)?.simbolo || '$';

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Totales</h3>
      
      <div className="max-w-md ml-auto space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2 border-b border-border">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium">{simboloMoneda}{invoice.subtotal.toFixed(2)}</span>
        </div>
        
        {/* Descuento */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-muted-foreground whitespace-nowrap">Descuento:</Label>
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
          <div className="flex items-center gap-2">
            <Label className="text-muted-foreground whitespace-nowrap">Impuestos:</Label>
            <Select
              value={invoice.tasaImpuestos.toString()}
              onValueChange={(value) => onChange({ tasaImpuestos: parseFloat(value) })}
            >
              <SelectTrigger className="w-48 no-print">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASAS_IMPUESTOS.map((tasa) => (
                  <SelectItem key={tasa.valor} value={tasa.valor.toString()}>
                    {tasa.etiqueta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="font-medium ml-auto">
              +{simboloMoneda}{invoice.impuestosMonto.toFixed(2)}
            </span>
          </div>
        </div>
        
        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t-2 border-primary bg-invoice-accent rounded-lg px-4 mt-4">
          <span className="text-lg font-bold text-foreground">Total a Pagar:</span>
          <span className="text-2xl font-bold text-primary">
            {simboloMoneda}{invoice.total.toFixed(2)} {invoice.moneda}
          </span>
        </div>
      </div>
    </div>
  );
};
