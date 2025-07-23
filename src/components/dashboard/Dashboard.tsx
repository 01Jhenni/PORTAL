import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { AdminDashboard } from './AdminDashboard';
import { ClientDashboard } from './ClientDashboard';
import { CompanyManagement } from '../admin/CompanyManagement';
import { UploadModule } from '../upload/UploadModule';
import { 
  LogOut, 
  FileText, 
  Upload, 
  BarChart3, 
  Building2,
  Users
} from 'lucide-react';
import { UserManagement } from '../admin/UserManagement';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Fisc<span className="text-indigo-600">AI</span>
                </h1>
                <p className="text-xs text-gray-500">Portal Fiscal Inteligente</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-2'} lg:w-fit`}>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="companies" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresas
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Usuários
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <UploadModule />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="companies" className="space-y-6">
              <CompanyManagement />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};
