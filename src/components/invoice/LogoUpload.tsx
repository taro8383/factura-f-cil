import { useRef, useState, useCallback } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  logo?: string;
  onLogoChange: (logo: string | undefined) => void;
  className?: string;
}

export const LogoUpload = ({ logo, onLogoChange, className }: LogoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      onLogoChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onLogoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogoChange(undefined);
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer no-print",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      
      {logo ? (
        <div className="relative">
          <img 
            src={logo} 
            alt="Logo de la empresa" 
            className="max-h-24 max-w-full object-contain mx-auto"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="p-3 bg-muted rounded-full">
            <Image className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Subir Logo</p>
            <p className="text-xs">Arrastra o haz clic para seleccionar</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Print version that just shows the logo
export const LogoPrint = ({ logo }: { logo?: string }) => {
  if (!logo) return null;
  
  return (
    <div className="print-only">
      <img 
        src={logo} 
        alt="Logo de la empresa" 
        className="max-h-24 max-w-full object-contain"
      />
    </div>
  );
};
