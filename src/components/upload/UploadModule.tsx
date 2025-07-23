
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DocumentCard } from './DocumentCard';
import { useAuth } from '@/hooks/useAuth';
import { useUploads } from '@/hooks/useUploads';
import { 
  Upload, 
  FileText, 
  Building2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  acceptedFormats: string[];
  icon: React.ComponentType<any>;
  color: string;
}

const documentTypes: DocumentType[] = [
  {
    id: 'nfe_entrada',
    name: 'NFe Entrada',
    description: 'Notas fiscais eletrônicas de entrada',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    id: 'nfe_saida',
    name: 'NFe Saída',
    description: 'Notas fiscais eletrônicas de saída',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-blue-400'
  },
  {
    id: 'cfe',
    name: 'CFe - Cupom Fiscal Eletrônico',
    description: 'Cupom Fiscal Eletrônico',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-orange-600'
  },
  {
    id: 'cte_entrada',
    name: 'CTe Entrada',
    description: 'Conhecimento de Transporte Eletrônico de entrada',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-green-600'
  },
  {
    id: 'cte_saida',
    name: 'CTe Saída',
    description: 'Conhecimento de Transporte Eletrônico de saída',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-green-600'
  },
  {
    id: 'nfce',
    name: 'NFC-e - Nota Fiscal de Consumidor',
    description: 'Notas fiscais de consumidor eletrônicas',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-yellow-600'
  },
  {
    id: 'sped_fiscal',
    name: 'SPED Fiscal',
    description: 'Arquivo do SPED Fiscal (armazenado no Google Drive)',
    acceptedFormats: ['.txt'],
    icon: FileText,
    color: 'text-red-600'
  },
  {
    id: 'nfse_prestados',
    name: 'NFS-e Prestados',
    description: 'Notas fiscais de serviços prestados',
    acceptedFormats: ['.xml'],
    icon: FileText,
    color: 'text-purple-600'
  },
  {
    id: 'nfse_tomados',
    name: 'NFS-e Tomados',
    description: 'Notas fiscais de serviços tomados',
    acceptedFormats: ['.pdf', '.xml'],
    icon: FileText,
    color: 'text-indigo-600'
  }
];

export const UploadModule = () => {
  const { user } = useAuth();
  const { getCompanyConfig } = useUploads();
  const [selectedCompany, setSelectedCompany] = useState('');

  const getFilteredDocumentTypes = (companyId: string): DocumentType[] => {
    const allowedTypes = getCompanyConfig(companyId);
    if (allowedTypes.length === 0) {
      // If no configuration exists, show all types
      return documentTypes;
    }
    return documentTypes.filter(type => allowedTypes.includes(type.id));
  };

  const selectedCompanyInfo = user?.companies?.find(c => c.id === selectedCompany);
  const filteredDocTypes = selectedCompany ? getFilteredDocumentTypes(selectedCompany) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Upload className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload de Documentos Fiscais</h2>
          <p className="text-gray-600">Selecione a empresa e envie seus documentos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Empresa</CardTitle>
          <CardDescription>
            Escolha a empresa para visualizar os tipos de documentos disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <select
              id="company"
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-11"
              required
            >
              <option value="" disabled>
                Selecione a empresa
              </option>
              {user?.companies && user.companies.length > 0 ? (
                user.companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Nenhuma empresa disponível</option>
              )}
            </select>
          </div>
        </CardContent>
      </Card>

      {selectedCompany && (
        <>
          {/* Company Info */}
          <Alert>
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Empresa selecionada:</strong> {selectedCompanyInfo?.name}<br />
              <strong>CNPJ:</strong> {selectedCompanyInfo?.cnpj}<br />
              <strong>Tipos de documentos configurados:</strong> {filteredDocTypes.length}
            </AlertDescription>
          </Alert>

          {/* Document Cards */}
          {filteredDocTypes.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Documentos para Envio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocTypes.map((docType) => (
                  <DocumentCard
                    key={docType.id}
                    companyId={selectedCompany}
                    documentType={docType}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhum tipo de documento foi configurado para esta empresa. 
                Entre em contato com o administrador para configurar os tipos de documentos necessários.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Armazenamento Seguro</p>
                    <p className="text-gray-600">
                      Todos os documentos são armazenados de forma segura e organizados automaticamente
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Processamento Automático</p>
                    <p className="text-gray-600">
                      Documentos são enviados automaticamente para os sistemas adequados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Histórico Completo</p>
                    <p className="text-gray-600">
                      Mantenha o controle de todos os envios com histórico detalhado
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
