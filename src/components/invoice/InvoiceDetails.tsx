import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, MONEDAS, TERMINOS_PAGO } from '@/types/invoice';
import { ColorPicker } from './ColorPicker';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onChange: (updates: Partial<Invoice>) => void;
}

export const InvoiceDetails = ({ invoice, onChange }: InvoiceDetailsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Detalles de la Factura</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="numero-factura">Número de Factura</Label>
          <Input
            id="numero-factura"
            value={invoice.numero}
            onChange={(e) => onChange({ numero: e.target.value })}
            placeholder="FAC-2024-001"
          />
        </div>
        
        <div>
          <Label htmlFor="fecha-factura">Fecha de Factura</Label>
          <Input
            id="fecha-factura"
            type="date"
            value={invoice.fechaFactura}
            onChange={(e) => onChange({ fechaFactura: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="fecha-vencimiento">Fecha de Vencimiento</Label>
          <Input
            id="fecha-vencimiento"
            type="date"
            value={invoice.fechaVencimiento}
            onChange={(e) => onChange({ fechaVencimiento: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="terminos-pago">Términos de Pago</Label>
          <Select 
            value={invoice.terminosPago} 
            onValueChange={(value) => onChange({ terminosPago: value })}
          >
            <SelectTrigger id="terminos-pago">
              <SelectValue placeholder="Seleccionar términos" />
            </SelectTrigger>
            <SelectContent>
              {TERMINOS_PAGO.map((termino) => (
                <SelectItem key={termino.valor} value={termino.valor}>
                  {termino.etiqueta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="moneda">Moneda</Label>
          <Select 
            value={invoice.moneda} 
            onValueChange={(value) => onChange({ moneda: value })}
          >
            <SelectTrigger id="moneda">
              <SelectValue placeholder="Seleccionar moneda" />
            </SelectTrigger>
            <SelectContent>
              {MONEDAS.map((moneda) => (
                <SelectItem key={moneda.codigo} value={moneda.codigo}>
                  {moneda.simbolo} {moneda.nombre} ({moneda.codigo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ColorPicker
        color={invoice.colorAccento || '#4f46e5'}
        onChange={(color) => onChange({ colorAccento: color })}
      />
    </div>
  );
};
