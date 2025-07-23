
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUploads } from '@/hooks/useUploads';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Calendar,
  FileUp,
  Hash
} from 'lucide-react';

interface DocumentCardProps {
  companyId: string;
  documentType: {
    id: string;
    name: string;
    description: string;
    acceptedFormats: string[];
    icon: React.ComponentType<any>;
    color: string;
  };
}

export const DocumentCard = ({ companyId, documentType }: DocumentCardProps) => {
  const { user } = useAuth();
  const { addUpload, getUploadCountForMonth, getLastUploadDate } = useUploads();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const monthlyCount = getUploadCountForMonth(companyId, documentType.id);
  const lastUploadDate = getLastUploadDate(companyId, documentType.id);
  const hasUploads = monthlyCount > 0;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file formats
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !documentType.acceptedFormats.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Formato inválido",
        description: `Apenas arquivos ${documentType.acceptedFormats.join(', ')} são aceitos`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !user) return;

    setUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add each file as a separate upload record
      selectedFiles.forEach(file => {
        addUpload({
          userId: user.id,
          companyId,
          documentType: documentType.id,
          fileName: file.name,
          status: 'enviado'
        });
      });

      toast({
        title: "Upload realizado com sucesso!",
        description: `${selectedFiles.length} arquivo(s) enviado(s)`,
      });

      // Reset
      setSelectedFiles([]);
      setIsDialogOpen(false);
      
      // Clear file input
      const fileInput = document.getElementById(`file-upload-${documentType.id}`) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar os arquivos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatLastUploadDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${hasUploads ? 'border-green-200' : 'border-gray-200'}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${hasUploads ? 'bg-green-100' : 'bg-gray-100'}`}>
              <documentType.icon className={`w-6 h-6 ${hasUploads ? 'text-green-600' : documentType.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{documentType.name}</h3>
              <p className="text-xs text-gray-600">{documentType.acceptedFormats.join(', ')}</p>
            </div>
          </div>
          
          <Badge variant={hasUploads ? "default" : "outline"} className="text-xs">
            {hasUploads ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                ENVIADO
              </div>
            ) : (
              'A ENVIAR'
            )}
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Este mês:</span>
              <span className="font-medium text-gray-900">{monthlyCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Último:</span>
              <span className="font-medium text-gray-900 text-xs">
                {formatLastUploadDate(lastUploadDate)}
              </span>
            </div>
          </div>

          {/* Upload Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de {documentType.name}</DialogTitle>
                <DialogDescription>
                  Selecione os arquivos ({documentType.acceptedFormats.join(', ')}) para envio
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    id={`file-upload-${documentType.id}`}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept={documentType.acceptedFormats.join(',')}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`file-upload-${documentType.id}`)?.click()}
                  >
                    Selecionar Arquivos
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Formatos aceitos: {documentType.acceptedFormats.join(', ')}
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Arquivos selecionados ({selectedFiles.length}):</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="flex-1">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Enviar {selectedFiles.length} arquivo(s)
                    </div>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};
