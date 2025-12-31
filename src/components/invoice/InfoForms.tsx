import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CompanyInfo, ClientInfo, FieldVisibility } from '@/types/invoice';
import { LogoUpload, LogoPrint } from './LogoUpload';
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
  type?: 'input' | 'textarea';
  rows?: number;
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
  rows = 2,
}: FieldWithToggleProps) => {
  const { t } = useLanguage();

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
      {type === 'input' ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={!visible ? 'opacity-50' : ''}
        />
      ) : (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={!visible ? 'opacity-50' : ''}
        />
      )}
    </div>
  );
};

interface CompanyInfoFormProps {
  empresa: CompanyInfo;
  onChange: (updates: Partial<CompanyInfo>) => void;
  camposVisibles: FieldVisibility;
  onVisibilityChange: (updates: Partial<FieldVisibility>) => void;
}

export const CompanyInfoForm = ({ empresa, onChange, camposVisibles, onVisibilityChange }: CompanyInfoFormProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{t('companyInfo')}</h3>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <LogoUpload
            logo={empresa.logo}
            onLogoChange={(logo) => onChange({ logo })}
          />
          <LogoPrint logo={empresa.logo} />
        </div>

        <div className="md:w-2/3 space-y-3">
          <FieldWithToggle
            label={t('companyName')}
            id="empresa-nombre"
            value={empresa.nombre}
            onChange={(nombre) => onChange({ nombre })}
            visible={camposVisibles.empresaNombre}
            onVisibilityChange={(v) => onVisibilityChange({ empresaNombre: v })}
            placeholder={t('placeholderCompanyName')}
          />

          <FieldWithToggle
            label={t('companyCuit')}
            id="empresa-cuit"
            value={empresa.cuit}
            onChange={(cuit) => onChange({ cuit })}
            visible={camposVisibles.empresaCuit}
            onVisibilityChange={(v) => onVisibilityChange({ empresaCuit: v })}
            placeholder={t('placeholderCompanyCuit')}
          />
        </div>
      </div>

      <FieldWithToggle
        label={t('address')}
        id="empresa-direccion"
        value={empresa.direccion}
        onChange={(direccion) => onChange({ direccion })}
        visible={camposVisibles.empresaDireccion}
        onVisibilityChange={(v) => onVisibilityChange({ empresaDireccion: v })}
        placeholder={t('placeholderCompanyAddress')}
        type="textarea"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldWithToggle
          label={t('phone')}
          id="empresa-telefono"
          value={empresa.telefono}
          onChange={(telefono) => onChange({ telefono })}
          visible={camposVisibles.empresaTelefono}
          onVisibilityChange={(v) => onVisibilityChange({ empresaTelefono: v })}
          placeholder={t('placeholderCompanyPhone')}
        />
        <FieldWithToggle
          label={t('email')}
          id="empresa-email"
          value={empresa.email}
          onChange={(email) => onChange({ email })}
          visible={camposVisibles.empresaEmail}
          onVisibilityChange={(v) => onVisibilityChange({ empresaEmail: v })}
          placeholder={t('placeholderCompanyEmail')}
        />
      </div>
    </div>
  );
};

interface ClientInfoFormProps {
  cliente: ClientInfo;
  onChange: (updates: Partial<ClientInfo>) => void;
  camposVisibles: FieldVisibility;
  onVisibilityChange: (updates: Partial<FieldVisibility>) => void;
}

export const ClientInfoForm = ({ cliente, onChange, camposVisibles, onVisibilityChange }: ClientInfoFormProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">{t('clientInfo')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldWithToggle
          label={t('clientName')}
          id="cliente-nombre"
          value={cliente.nombre}
          onChange={(nombre) => onChange({ nombre })}
          visible={camposVisibles.clienteNombre}
          onVisibilityChange={(v) => onVisibilityChange({ clienteNombre: v })}
          placeholder={t('placeholderClientName')}
        />
        <FieldWithToggle
          label={t('clientCuit')}
          id="cliente-cuit"
          value={cliente.cuit}
          onChange={(cuit) => onChange({ cuit })}
          visible={camposVisibles.clienteCuit}
          onVisibilityChange={(v) => onVisibilityChange({ clienteCuit: v })}
          placeholder={t('placeholderClientCuit')}
        />
      </div>

      <FieldWithToggle
        label={t('address')}
        id="cliente-direccion"
        value={cliente.direccion}
        onChange={(direccion) => onChange({ direccion })}
        visible={camposVisibles.clienteDireccion}
        onVisibilityChange={(v) => onVisibilityChange({ clienteDireccion: v })}
        placeholder={t('placeholderClientAddress')}
        type="textarea"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldWithToggle
          label={t('phone')}
          id="cliente-telefono"
          value={cliente.telefono}
          onChange={(telefono) => onChange({ telefono })}
          visible={camposVisibles.clienteTelefono}
          onVisibilityChange={(v) => onVisibilityChange({ clienteTelefono: v })}
          placeholder={t('placeholderClientPhone')}
        />
        <FieldWithToggle
          label={t('email')}
          id="cliente-email"
          value={cliente.email}
          onChange={(email) => onChange({ email })}
          visible={camposVisibles.clienteEmail}
          onVisibilityChange={(v) => onVisibilityChange({ clienteEmail: v })}
          placeholder={t('placeholderClientEmail')}
        />
      </div>
    </div>
  );
};
