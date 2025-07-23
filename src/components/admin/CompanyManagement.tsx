
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useUploads } from '@/hooks/useUploads';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  FileText, 
  Save,
  Settings
} from 'lucide-react';

const documentTypes = [
  { id: 'nfe', name: 'NFe - Nota Fiscal Eletrônica', format: 'XML' },
  { id: 'cte_entrada', name: 'CTe Entrada', format: 'XML' },
  { id: 'cte_saida', name: 'CTe Saída', format: 'XML' },
  { id: 'nfce', name: 'NFC-e - Nota Fiscal de Consumidor', format: 'XML' },
  { id: 'sped_fiscal', name: 'SPED Fiscal', format: 'TXT' },
  { id: 'sped_contribuicoes', name: 'SPED Contribuições', format: 'TXT' },
  { id: 'nfse_prestados', name: 'NFS-e Prestados', format: 'XML' },
  { id: 'nfse_tomados', name: 'NFS-e Tomados', format: 'PDF/XML' }
];

export const CompanyManagement = () => {
  const { user } = useAuth();
  const { companyConfigs, updateCompanyConfig, getCompanyConfig } = useUploads();
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState('');

  // Mock companies data - in real app this would come from API
  const companies = [
    { id: '1', name: 'Empresa ABC Ltda', cnpj: '12.345.678/0001-90', active: true },
    { id: '2', name: 'Comércio XYZ Eireli', cnpj: '98.765.432/0001-10', active: true },
    { id: '3', name: 'Indústria DEF SA', cnpj: '11.222.333/0001-44', active: true },
    { id: '4', name: 'Serviços GHI Ltda', cnpj: '55.666.777/0001-88', active: false },
  ];

  const handleDocumentTypeChange = (companyId: string, documentId: string, checked: boolean) => {
    const currentConfig = getCompanyConfig(companyId);
    let newConfig;
    
    if (checked) {
      newConfig = [...currentConfig, documentId];
    } else {
      newConfig = currentConfig.filter(id => id !== documentId);
    }
    
    updateCompanyConfig(companyId, newConfig);
  };

  const saveCompanyConfig = (companyId: string) => {
    toast({
      title: "Configuração salva",
      description: "Tipos de documentos atualizados com sucesso",
    });
  };

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Acesso negado. Apenas administradores podem acessar esta área.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Empresas</h2>
          <p className="text-gray-600">Configure os tipos de documentos para cada empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Companies List */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
            <CardDescription>
              Selecione uma empresa para configurar os tipos de documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companies.map((company) => (
                <div 
                  key={company.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCompany === company.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCompany(company.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{company.name}</h3>
                    <Badge variant={company.active ? "default" : "secondary"}>
                      {company.active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">CNPJ: {company.cnpj}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {getCompanyConfig(company.id).length} tipos de documento configurados
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Types Configuration */}
        {selectedCompany && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tipos de Documentos
              </CardTitle>
              <CardDescription>
                Configure quais tipos de documentos esta empresa deve enviar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documentTypes.map((docType) => {
                  const isChecked = getCompanyConfig(selectedCompany).includes(docType.id);
                  
                  return (
                    <div key={docType.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`${selectedCompany}-${docType.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => 
                          handleDocumentTypeChange(selectedCompany, docType.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`${selectedCompany}-${docType.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {docType.name}
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Formato: {docType.format}
                        </p>
                      </div>
                      <FileText className="w-4 h-4 text-gray-400" />
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => saveCompanyConfig(selectedCompany)}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configuração
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
