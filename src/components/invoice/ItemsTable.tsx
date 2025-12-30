import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvoiceItem, MONEDAS } from '@/types/invoice';

interface ItemsTableProps {
  articulos: InvoiceItem[];
  moneda: string;
  onAddItem: () => void;
  onUpdateItem: (id: string, updates: Partial<InvoiceItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const ItemsTable = ({ articulos, moneda, onAddItem, onUpdateItem, onRemoveItem }: ItemsTableProps) => {
  const simboloMoneda = MONEDAS.find(m => m.codigo === moneda)?.simbolo || '$';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-foreground">Artículos / Servicios</h3>
        <Button onClick={onAddItem} size="sm" className="no-print">
          <Plus className="w-4 h-4 mr-1" />
          Agregar Artículo
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40%]">Descripción</TableHead>
              <TableHead className="text-center w-[15%]">Cantidad</TableHead>
              <TableHead className="text-right w-[18%]">Precio Unitario</TableHead>
              <TableHead className="text-right w-[18%]">Total</TableHead>
              <TableHead className="w-[9%] no-print"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articulos.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.descripcion}
                    onChange={(e) => onUpdateItem(item.id, { descripcion: e.target.value })}
                    placeholder="Descripción del artículo o servicio"
                    className="border-0 bg-transparent focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={item.cantidad}
                    onChange={(e) => onUpdateItem(item.id, { cantidad: parseFloat(e.target.value) || 0 })}
                    className="text-center border-0 bg-transparent focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.precioUnitario}
                    onChange={(e) => onUpdateItem(item.id, { precioUnitario: parseFloat(e.target.value) || 0 })}
                    className="text-right border-0 bg-transparent focus-visible:ring-1"
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {simboloMoneda}{item.total.toFixed(2)}
                </TableCell>
                <TableCell className="no-print">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    disabled={articulos.length <= 1}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {articulos.map((item, index) => (
          <div key={item.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-muted-foreground">Artículo {index + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveItem(item.id)}
                disabled={articulos.length <= 1}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 no-print h-8 w-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <Input
              value={item.descripcion}
              onChange={(e) => onUpdateItem(item.id, { descripcion: e.target.value })}
              placeholder="Descripción"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Cantidad</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={item.cantidad}
                  onChange={(e) => onUpdateItem(item.id, { cantidad: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Precio Unitario</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.precioUnitario}
                  onChange={(e) => onUpdateItem(item.id, { precioUnitario: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm font-medium">Total:</span>
              <span className="font-bold text-primary">{simboloMoneda}{item.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
