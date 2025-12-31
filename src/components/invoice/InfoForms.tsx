import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CompanyInfo, ClientInfo, FieldVisibility } from '@/types/invoice';
import { LogoUpload, LogoPrint } from './LogoUpload';
import { Eye, EyeOff } from 'lucide-react';

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
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <button
          type="button"
          onClick={() => onVisibilityChange(!visible)}
          className="p-1 rounded hover:bg-muted transition-colors"
          title={visible ? 'Ocultar en PDF' : 'Mostrar en PDF'}
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
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Información de la Empresa</h3>
      
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
            label="Nombre de la Empresa"
            id="empresa-nombre"
            value={empresa.nombre}
            onChange={(nombre) => onChange({ nombre })}
            visible={camposVisibles.empresaNombre}
            onVisibilityChange={(v) => onVisibilityChange({ empresaNombre: v })}
            placeholder="Mi Empresa S.A."
          />
          
          <FieldWithToggle
            label="CUIT/CUIL"
            id="empresa-cuit"
            value={empresa.cuit}
            onChange={(cuit) => onChange({ cuit })}
            visible={camposVisibles.empresaCuit}
            onVisibilityChange={(v) => onVisibilityChange({ empresaCuit: v })}
            placeholder="20-12345678-9"
          />
        </div>
      </div>
      
      <FieldWithToggle
        label="Dirección"
        id="empresa-direccion"
        value={empresa.direccion}
        onChange={(direccion) => onChange({ direccion })}
        visible={camposVisibles.empresaDireccion}
        onVisibilityChange={(v) => onVisibilityChange({ empresaDireccion: v })}
        placeholder="Calle Principal 123, Buenos Aires, Argentina"
        type="textarea"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldWithToggle
          label="Teléfono"
          id="empresa-telefono"
          value={empresa.telefono}
          onChange={(telefono) => onChange({ telefono })}
          visible={camposVisibles.empresaTelefono}
          onVisibilityChange={(v) => onVisibilityChange({ empresaTelefono: v })}
          placeholder="+54 11 1234 5678"
        />
        <FieldWithToggle
          label="Email"
          id="empresa-email"
          value={empresa.email}
          onChange={(email) => onChange({ email })}
          visible={camposVisibles.empresaEmail}
          onVisibilityChange={(v) => onVisibilityChange({ empresaEmail: v })}
          placeholder="contacto@miempresa.com"
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
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Información del Cliente</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldWithToggle
          label="Nombre del Cliente"
          id="cliente-nombre"
          value={cliente.nombre}
          onChange={(nombre) => onChange({ nombre })}
          visible={camposVisibles.clienteNombre}
          onVisibilityChange={(v) => onVisibilityChange({ clienteNombre: v })}
          placeholder="Cliente Ejemplo S.L."
        />
        <FieldWithToggle
          label="CUIT/CUIL"
          id="cliente-cuit"
          value={cliente.cuit}
          onChange={(cuit) => onChange({ cuit })}
          visible={camposVisibles.clienteCuit}
          onVisibilityChange={(v) => onVisibilityChange({ clienteCuit: v })}
          placeholder="30-87654321-0"
        />
      </div>
      
      <FieldWithToggle
        label="Dirección"
        id="cliente-direccion"
        value={cliente.direccion}
        onChange={(direccion) => onChange({ direccion })}
        visible={camposVisibles.clienteDireccion}
        onVisibilityChange={(v) => onVisibilityChange({ clienteDireccion: v })}
        placeholder="Avenida Secundaria 456, Córdoba, Argentina"
        type="textarea"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldWithToggle
          label="Teléfono"
          id="cliente-telefono"
          value={cliente.telefono}
          onChange={(telefono) => onChange({ telefono })}
          visible={camposVisibles.clienteTelefono}
          onVisibilityChange={(v) => onVisibilityChange({ clienteTelefono: v })}
          placeholder="+54 351 234 5678"
        />
        <FieldWithToggle
          label="Email"
          id="cliente-email"
          value={cliente.email}
          onChange={(email) => onChange({ email })}
          visible={camposVisibles.clienteEmail}
          onVisibilityChange={(v) => onVisibilityChange({ clienteEmail: v })}
          placeholder="cliente@ejemplo.com"
        />
      </div>
    </div>
  );
};
