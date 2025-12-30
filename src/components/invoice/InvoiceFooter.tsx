import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface InvoiceFooterProps {
  notas: string;
  instruccionesPago: string;
  onChange: (updates: { notas?: string; instruccionesPago?: string }) => void;
}

export const InvoiceFooter = ({ notas, instruccionesPago, onChange }: InvoiceFooterProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="notas">Notas / Términos y Condiciones</Label>
          <Textarea
            id="notas"
            value={notas}
            onChange={(e) => onChange({ notas: e.target.value })}
            placeholder="Gracias por su confianza. Esta factura es válida como comprobante fiscal."
            rows={4}
            className="resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instrucciones-pago">Instrucciones de Pago</Label>
          <Textarea
            id="instrucciones-pago"
            value={instruccionesPago}
            onChange={(e) => onChange({ instruccionesPago: e.target.value })}
            placeholder="Transferencia bancaria a la cuenta: ESXX XXXX XXXX..."
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
};
