import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Invoice, MONEDAS, TERMINOS_PAGO, FieldVisibility } from '@/types/invoice';
import { ColorPicker } from './ColorPicker';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FieldWithToggleProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  placeholder?: string;
  type?: 'input' | 'date' | 'select';
  selectOptions?: { valor: string; etiqueta: string; etiquetaEn?: string }[];
}

const FieldWithToggle = ({
  label,
  id,
  value,
  onChange,
  visible,
  onVisibilityChange,
  placeholder,
  type = 'input',
  selectOptions,
}: FieldWithToggleProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <button
          type="button"
          onClick={() => onVisibilityChange(!visible)}
          className="p-1 rounded hover:bg-muted transition-colors"
          title={visible ? t('hideInPdf') : t('showInPdf')}
        >
          {visible ? (
            <Eye className="h-4 w-4 text-muted-foreground" />
          ) : (
            <EyeOff className="h-4 w-4 text-muted-foreground/50" />
          )}
        </button>
      </div>
      {type === 'select' ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} className={!visible ? 'opacity-50' : ''}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions?.map((opcion) => (
              <SelectItem key={opcion.valor} value={opcion.valor}>
                {language === 'en' && opcion.etiquetaEn ? opcion.etiquetaEn : opcion.etiqueta}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={!visible ? 'opacity-50' : ''}
        />
      )}
    </div>
  );
};

interface InvoiceDetailsProps {
  invoice: Invoice;
  onChange: (updates: Partial<Invoice>) => void;
  camposVisibles: FieldVisibility;
  onVisibilityChange: (updates: Partial<FieldVisibility>) => void;
}

export const InvoiceDetails = ({ invoice, onChange, camposVisibles, onVisibilityChange }: InvoiceDetailsProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{t('invoiceDetails')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FieldWithToggle
          label={t('invoiceNumber')}
          id="numero-factura"
          value={invoice.numero}
          onChange={(numero) => onChange({ numero })}
          visible={camposVisibles.numero}
          onVisibilityChange={(v) => onVisibilityChange({ numero: v })}
          placeholder={t('placeholderInvoiceNumber')}
        />

        <FieldWithToggle
          label={t('invoiceDate')}
          id="fecha-factura"
          type="date"
          value={invoice.fechaFactura}
          onChange={(fechaFactura) => onChange({ fechaFactura })}
          visible={camposVisibles.fechaFactura}
          onVisibilityChange={(v) => onVisibilityChange({ fechaFactura: v })}
        />

        <FieldWithToggle
          label={t('dueDate')}
          id="fecha-vencimiento"
          type="date"
          value={invoice.fechaVencimiento}
          onChange={(fechaVencimiento) => onChange({ fechaVencimiento })}
          visible={camposVisibles.fechaVencimiento}
          onVisibilityChange={(v) => onVisibilityChange({ fechaVencimiento: v })}
        />

        <FieldWithToggle
          label={t('paymentTerms')}
          id="terminos-pago"
          type="select"
          value={invoice.terminosPago}
          onChange={(terminosPago) => onChange({ terminosPago })}
          visible={camposVisibles.terminosPago}
          onVisibilityChange={(v) => onVisibilityChange({ terminosPago: v })}
          placeholder={t('placeholderPaymentTerms')}
          selectOptions={TERMINOS_PAGO}
        />

        <FieldWithToggle
          label={t('currency')}
          id="moneda"
          type="select"
          value={invoice.moneda}
          onChange={(moneda) => onChange({ moneda })}
          visible={camposVisibles.moneda}
          onVisibilityChange={(v) => onVisibilityChange({ moneda: v })}
          placeholder={t('placeholderCurrency')}
          selectOptions={MONEDAS.map((m) => ({
            valor: m.codigo,
            etiqueta: `${m.simbolo} ${m.nombre} (${m.codigo})`,
            etiquetaEn: `${m.simbolo} ${m.nombreEn} (${m.codigo})`,
          }))}
        />
      </div>

      <ColorPicker
        color={invoice.colorAccento || '#4f46e5'}
        onChange={(color) => onChange({ colorAccento: color })}
      />
    </div>
  );
};
