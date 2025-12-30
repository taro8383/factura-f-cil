import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanyInfo, ClientInfo } from '@/types/invoice';
import { LogoUpload, LogoPrint } from './LogoUpload';

interface CompanyInfoFormProps {
  empresa: CompanyInfo;
  onChange: (updates: Partial<CompanyInfo>) => void;
}

export const CompanyInfoForm = ({ empresa, onChange }: CompanyInfoFormProps) => {
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
          <div>
            <Label htmlFor="empresa-nombre">Nombre de la Empresa</Label>
            <Input
              id="empresa-nombre"
              value={empresa.nombre}
              onChange={(e) => onChange({ nombre: e.target.value })}
              placeholder="Mi Empresa S.A."
            />
          </div>
          
          <div>
            <Label htmlFor="empresa-nif">NIF/CIF</Label>
            <Input
              id="empresa-nif"
              value={empresa.nif}
              onChange={(e) => onChange({ nif: e.target.value })}
              placeholder="B12345678"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="empresa-direccion">Dirección</Label>
        <Textarea
          id="empresa-direccion"
          value={empresa.direccion}
          onChange={(e) => onChange({ direccion: e.target.value })}
          placeholder="Calle Principal 123, 28001 Madrid, España"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="empresa-telefono">Teléfono</Label>
          <Input
            id="empresa-telefono"
            value={empresa.telefono}
            onChange={(e) => onChange({ telefono: e.target.value })}
            placeholder="+34 912 345 678"
          />
        </div>
        <div>
          <Label htmlFor="empresa-email">Email</Label>
          <Input
            id="empresa-email"
            type="email"
            value={empresa.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="contacto@miempresa.com"
          />
        </div>
      </div>
    </div>
  );
};

interface ClientInfoFormProps {
  cliente: ClientInfo;
  onChange: (updates: Partial<ClientInfo>) => void;
}

export const ClientInfoForm = ({ cliente, onChange }: ClientInfoFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-foreground">Información del Cliente</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="cliente-nombre">Nombre del Cliente</Label>
          <Input
            id="cliente-nombre"
            value={cliente.nombre}
            onChange={(e) => onChange({ nombre: e.target.value })}
            placeholder="Cliente Ejemplo S.L."
          />
        </div>
        <div>
          <Label htmlFor="cliente-nif">NIF/CIF</Label>
          <Input
            id="cliente-nif"
            value={cliente.nif}
            onChange={(e) => onChange({ nif: e.target.value })}
            placeholder="B87654321"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="cliente-direccion">Dirección</Label>
        <Textarea
          id="cliente-direccion"
          value={cliente.direccion}
          onChange={(e) => onChange({ direccion: e.target.value })}
          placeholder="Avenida Secundaria 456, 08001 Barcelona, España"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="cliente-telefono">Teléfono</Label>
          <Input
            id="cliente-telefono"
            value={cliente.telefono}
            onChange={(e) => onChange({ telefono: e.target.value })}
            placeholder="+34 934 567 890"
          />
        </div>
        <div>
          <Label htmlFor="cliente-email">Email</Label>
          <Input
            id="cliente-email"
            type="email"
            value={cliente.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="cliente@ejemplo.com"
          />
        </div>
      </div>
    </div>
  );
};
