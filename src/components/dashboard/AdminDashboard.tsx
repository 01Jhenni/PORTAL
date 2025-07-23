
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Building2, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Upload
} from 'lucide-react';

export const AdminDashboard = () => {
  // Mock data for demonstration
  const stats = {
    totalFiles: 1247,
    totalCompanies: 15,
    totalUsers: 42,
    successRate: 98.5
  };

  const recentUploads = [
    { id: 1, company: 'Empresa ABC Ltda', type: 'NFe', count: 15, time: '10:30', status: 'success' },
    { id: 2, company: 'Comércio XYZ Eireli', type: 'CTe', count: 8, time: '09:45', status: 'success' },
    { id: 3, company: 'Indústria DEF SA', type: 'SPED', count: 1, time: '08:20', status: 'processing' },
    { id: 4, company: 'Serviços GHI Ltda', type: 'NFS-e', count: 23, time: '07:15', status: 'error' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Processado';
      case 'processing':
        return 'Processando';
      case 'error':
        return 'Erro';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bem-vindo, Administrador!</h2>
        <p className="text-indigo-100">
          Gerencie uploads fiscais, empresas e usuários do sistema FiscAI
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFiles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +12% desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +2 novas este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +8 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              +0.3% desde semana passada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uploads Recentes</CardTitle>
            <CardDescription>
              Últimas atividades de upload no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-sm">{upload.company}</p>
                      <p className="text-xs text-gray-500">
                        {upload.type} • {upload.count} arquivo(s) • {upload.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(upload.status)}
                    <span className="text-xs text-gray-600">
                      {getStatusText(upload.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo</CardTitle>
            <CardDescription>
              Arquivos processados por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'NFe', count: 542, percentage: 43.5, color: 'bg-blue-500' },
                { type: 'CTe', count: 289, percentage: 23.2, color: 'bg-green-500' },
                { type: 'NFC-e', count: 231, percentage: 18.5, color: 'bg-yellow-500' },
                { type: 'NFS-e', count: 156, percentage: 12.5, color: 'bg-purple-500' },
                { type: 'SPED', count: 29, percentage: 2.3, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.type} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-gray-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
