import { FileDown, Printer, RotateCcw, Save, History, Trash2, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Invoice, MONEDAS } from '@/types/invoice';

interface InvoiceControlsProps {
  onGeneratePdf: () => void;
  onPrint: () => void;
  onClear: () => void;
  onSave: () => void;
}

export const InvoiceControls = ({ onGeneratePdf, onPrint, onClear, onSave }: InvoiceControlsProps) => {
  return (
    <div className="flex flex-wrap gap-2 no-print">
      <Button onClick={onSave} variant="default">
        <Save className="w-4 h-4 mr-2" />
        Guardar Factura
      </Button>
      <Button onClick={onGeneratePdf} variant="secondary">
        <FileDown className="w-4 h-4 mr-2" />
        Generar PDF
      </Button>
      <Button onClick={onPrint} variant="outline">
        <Printer className="w-4 h-4 mr-2" />
        Imprimir
      </Button>
      <Button onClick={onClear} variant="outline" className="text-destructive hover:text-destructive">
        <RotateCcw className="w-4 h-4 mr-2" />
        Nueva Factura
      </Button>
    </div>
  );
};

interface InvoiceHistoryProps {
  history: Invoice[];
  onLoad: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InvoiceHistory = ({ history, onLoad, onDuplicate, onDelete }: InvoiceHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No hay facturas guardadas</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {history.map((inv) => {
          const moneda = MONEDAS.find(m => m.codigo === inv.moneda);
          return (
            <div
              key={inv.id}
              className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-foreground">{inv.numero}</p>
                  <p className="text-sm text-muted-foreground">{inv.cliente.nombre}</p>
                </div>
                <p className="font-bold text-primary">
                  {moneda?.simbolo}{inv.total.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {new Date(inv.creadoEn).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onLoad(inv.id)}>
                  Cargar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDuplicate(inv.id)}>
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive ml-auto"
                  onClick={() => onDelete(inv.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

interface InvoiceHistorySheetProps {
  history: Invoice[];
  onLoad: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InvoiceHistorySheet = ({ history, onLoad, onDuplicate, onDelete }: InvoiceHistorySheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="no-print">
          <History className="w-4 h-4 mr-2" />
          Historial ({history.length})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Historial de Facturas</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <InvoiceHistory
            history={history}
            onLoad={onLoad}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
