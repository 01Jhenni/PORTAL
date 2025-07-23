
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUploads } from '@/hooks/useUploads';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock,
  Building2,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';

export const ClientDashboard = () => {
  const { user } = useAuth();
  const { uploads, getUploadsForCompany } = useUploads();

  // Calculate statistics
  const totalUploads = uploads.filter(upload => upload.userId === user?.id).length;
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const monthlyUploads = uploads.filter(upload => {
    const uploadDate = new Date(upload.uploadDate);
    return upload.userId === user?.id && 
           uploadDate.getMonth() === thisMonth && 
           uploadDate.getFullYear() === thisYear;
  }).length;

  const successRate = totalUploads > 0 ? 
    (uploads.filter(u => u.userId === user?.id && u.status === 'enviado').length / totalUploads * 100).toFixed(1) 
    : 0;

  const lastUpload = uploads
    .filter(upload => upload.userId === user?.id)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0];

  // Get recent uploads for display
  const recentUploads = uploads
    .filter(upload => upload.userId === user?.id)
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enviado':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processando':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'erro':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enviado':
        return 'ENVIADO';
      case 'processando':
        return 'Processando';
      case 'erro':
        return 'Erro';
      default:
        return 'Pendente';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'enviado':
        return 'default';
      case 'processando':
        return 'secondary';
      case 'erro':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompanyName = (companyId: string) => {
    return user?.companies?.find(c => c.id === companyId)?.name || 'Empresa não encontrada';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Olá, {user?.name}!</h2>
        <p className="text-blue-100 mb-4">
          Acompanhe seus envios de documentos fiscais em tempo real
        </p>
        <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
          <Upload className="w-4 h-4 mr-2" />
          Fazer Novo Upload
        </Button>
      </div>

      {/* Companies Section */}
      {user?.companies && user.companies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Suas Empresas
            </CardTitle>
            <CardDescription>
              Empresas vinculadas e seus uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.companies.map((company) => {
                const companyUploads = getUploadsForCompany(company.id);
                const companyMonthlyUploads = companyUploads.filter(upload => {
                  const uploadDate = new Date(upload.uploadDate);
                  return uploadDate.getMonth() === thisMonth && uploadDate.getFullYear() === thisYear;
                }).length;

                return (
                  <div key={company.id} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{company.name}</h3>
                      <Badge variant={company.active ? "default" : "secondary"}>
                        {company.active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">CNPJ: {company.cnpj}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{companyUploads.length} uploads total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{companyMonthlyUploads} este mês</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Uploads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUploads}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +{monthlyUploads} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyUploads}</div>
            <p className="text-xs text-muted-foreground">
              Arquivos enviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Uploads bem-sucedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Upload</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {lastUpload ? formatDate(lastUpload.uploadDate) : 'Nenhum'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastUpload ? lastUpload.fileName : 'Faça seu primeiro upload'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Uploads Recentes</CardTitle>
          <CardDescription>
            Histórico dos seus últimos envios com status em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentUploads.length > 0 ? (
            <div className="space-y-4">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{upload.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {upload.documentType.toUpperCase()} • {getCompanyName(upload.companyId)}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(upload.uploadDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(upload.status)}
                    <Badge variant={getStatusVariant(upload.status)}>
                      {getStatusText(upload.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhum upload realizado ainda</p>
              <p className="text-sm text-gray-500">Faça seu primeiro upload na aba "Upload"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
