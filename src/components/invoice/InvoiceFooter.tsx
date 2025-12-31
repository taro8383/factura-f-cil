import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FieldVisibility } from '@/types/invoice';
import { Eye, EyeOff } from 'lucide-react';

interface InvoiceFooterProps {
  notas: string;
  instruccionesPago: string;
  camposVisibles: FieldVisibility;
  onChange: (updates: { notas?: string; instruccionesPago?: string }) => void;
  onVisibilityChange: (updates: Partial<FieldVisibility>) => void;
}

export const InvoiceFooter = ({ 
  notas, 
  instruccionesPago, 
  camposVisibles,
  onChange, 
  onVisibilityChange 
}: InvoiceFooterProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="notas">Notas / Términos y Condiciones</Label>
            <button
              type="button"
              onClick={() => onVisibilityChange({ notas: !camposVisibles.notas })}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={camposVisibles.notas ? 'Ocultar en PDF' : 'Mostrar en PDF'}
            >
              {camposVisibles.notas ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground/50" />
              )}
            </button>
          </div>
          <Textarea
            id="notas"
            value={notas}
            onChange={(e) => onChange({ notas: e.target.value })}
            placeholder="Gracias por su confianza. Esta factura es válida como comprobante fiscal."
            rows={4}
            className={`resize-none ${!camposVisibles.notas ? 'opacity-50' : ''}`}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="instrucciones-pago">Instrucciones de Pago</Label>
            <button
              type="button"
              onClick={() => onVisibilityChange({ instruccionesPago: !camposVisibles.instruccionesPago })}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={camposVisibles.instruccionesPago ? 'Ocultar en PDF' : 'Mostrar en PDF'}
            >
              {camposVisibles.instruccionesPago ? (
                <Eye className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted-foreground/50" />
              )}
            </button>
          </div>
          <Textarea
            id="instrucciones-pago"
            value={instruccionesPago}
            onChange={(e) => onChange({ instruccionesPago: e.target.value })}
            placeholder="Transferencia bancaria a la cuenta: ESXX XXXX XXXX..."
            rows={4}
            className={`resize-none ${!camposVisibles.instruccionesPago ? 'opacity-50' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};
