import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useInvoice } from '@/hooks/useInvoice';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { CompanyInfoForm, ClientInfoForm } from '@/components/invoice/InfoForms';
import { InvoiceDetails } from '@/components/invoice/InvoiceDetails';
import { ItemsTable } from '@/components/invoice/ItemsTable';
import { InvoiceTotals } from '@/components/invoice/InvoiceTotals';
import { InvoiceFooter } from '@/components/invoice/InvoiceFooter';
import { InvoiceControls, InvoiceHistorySheet } from '@/components/invoice/InvoiceControls';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const {
    invoice,
    history,
    updateInvoice,
    addItem,
    updateItem,
    removeItem,
    clearInvoice,
    saveToHistory,
    loadFromHistory,
    duplicateFromHistory,
    deleteFromHistory,
  } = useInvoice();

  const { generatePdf, printInvoice } = usePdfGenerator();

  const handleSave = () => {
    saveToHistory();
    toast({
      title: t('toastSaved'),
      description: t('toastSavedDesc').replace('{numero}', invoice.numero),
    });
  };

  const handleGeneratePdf = async () => {
    await generatePdf(invoice, language);
    toast({
      title: t('toastPdfGenerated'),
      description: t('toastPdfDesc'),
    });
  };

  const handleClear = () => {
    clearInvoice();
    toast({
      title: t('toastNewInvoice'),
      description: t('toastNewInvoiceDesc'),
    });
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('appTitle')}</h1>
            <p className="text-muted-foreground">{t('appDescription')}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <InvoiceHistorySheet
              history={history}
              onLoad={loadFromHistory}
              onDuplicate={duplicateFromHistory}
              onDelete={deleteFromHistory}
            />
          </div>
        </div>

        {/* Invoice Content */}
        <Card id="invoice-content" className="shadow-lg">
          <CardContent className="p-6 md:p-8 space-y-8">
            {/* Header with Company and Client Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CompanyInfoForm
                empresa={invoice.empresa}
                onChange={(updates) => updateInvoice({ empresa: { ...invoice.empresa, ...updates } })}
                camposVisibles={invoice.camposVisibles}
                onVisibilityChange={(updates) => updateInvoice({ camposVisibles: { ...invoice.camposVisibles, ...updates } })}
              />
              <ClientInfoForm
                cliente={invoice.cliente}
                onChange={(updates) => updateInvoice({ cliente: { ...invoice.cliente, ...updates } })}
                camposVisibles={invoice.camposVisibles}
                onVisibilityChange={(updates) => updateInvoice({ camposVisibles: { ...invoice.camposVisibles, ...updates } })}
              />
            </div>

            <Separator />

            {/* Invoice Details */}
            <InvoiceDetails
              invoice={invoice}
              onChange={updateInvoice}
              camposVisibles={invoice.camposVisibles}
              onVisibilityChange={(updates) => updateInvoice({ camposVisibles: { ...invoice.camposVisibles, ...updates } })}
            />

            <Separator />

            {/* Items Table */}
            <ItemsTable
              articulos={invoice.articulos}
              moneda={invoice.moneda}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />

            <Separator />

            {/* Totals */}
            <InvoiceTotals invoice={invoice} onChange={updateInvoice} />

            <Separator />

            {/* Footer */}
            <InvoiceFooter
              notas={invoice.notas}
              instruccionesPago={invoice.instruccionesPago}
              camposVisibles={invoice.camposVisibles}
              onChange={updateInvoice}
              onVisibilityChange={(updates) => updateInvoice({ camposVisibles: { ...invoice.camposVisibles, ...updates } })}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center">
          <InvoiceControls
            onSave={handleSave}
            onGeneratePdf={handleGeneratePdf}
            onPrint={printInvoice}
            onClear={handleClear}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
