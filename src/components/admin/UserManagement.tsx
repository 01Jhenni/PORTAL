
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Building2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  active: boolean;
  companies?: string[];
  createdAt: string;
}

export const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@fiscai.com',
      role: 'admin',
      active: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Cliente Exemplo',
      email: 'cliente@empresa.com',
      role: 'client',
      active: true,
      companies: ['1', '2'],
      createdAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'client',
      active: false,
      companies: ['3'],
      createdAt: '2024-01-20'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client' as 'admin' | 'client',
    companies: [] as string[]
  });

  // Mock companies data
  const companies = [
    { id: '1', name: 'Empresa ABC Ltda' },
    { id: '2', name: 'Comércio XYZ Eireli' },
    { id: '3', name: 'Indústria DEF SA' },
    { id: '4', name: 'Serviços GHI Ltda' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'client',
      companies: []
    });
  };

  const handleCreateUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      active: true,
      companies: formData.role === 'client' ? formData.companies : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    resetForm();
    
    toast({
      title: "Usuário criado",
      description: "Novo usuário foi criado com sucesso",
    });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            companies: formData.role === 'client' ? formData.companies : undefined
          }
        : user
    );

    setUsers(updatedUsers);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    resetForm();
    
    toast({
      title: "Usuário atualizado",
      description: "Dados do usuário foram atualizados com sucesso",
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário removido",
      description: "Usuário foi removido do sistema",
    });
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    );
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    toast({
      title: user?.active ? "Usuário desativado" : "Usuário ativado",
      description: `${user?.name} foi ${user?.active ? 'desativado' : 'ativado'} com sucesso`,
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      companies: user.companies || []
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h2>
            <p className="text-gray-600">Gerencie usuários e suas permissões no sistema</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Senha temporária"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Perfil</Label>
                <Select value={formData.role} onValueChange={(value: 'admin' | 'client') => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'client' && (
                <div className="grid gap-2">
                  <Label>Empresas Vinculadas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {companies.map(company => (
                      <label key={company.id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.companies.includes(company.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, companies: [...formData.companies, company.id]});
                            } else {
                              setFormData({...formData, companies: formData.companies.filter(id => id !== company.id)});
                            }
                          }}
                        />
                        <span>{company.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>
                Criar Usuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {users.length} usuários cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </Badge>
                      <Badge variant={user.active ? 'default' : 'secondary'}>
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {user.companies && user.companies.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Building2 className="w-3 h-3" />
                          {user.companies.length} empresa(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(user)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere os dados do usuário
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Perfil</Label>
              <Select value={formData.role} onValueChange={(value: 'admin' | 'client') => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === 'client' && (
              <div className="grid gap-2">
                <Label>Empresas Vinculadas</Label>
                <div className="grid grid-cols-2 gap-2">
                  {companies.map(company => (
                    <label key={company.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.companies.includes(company.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, companies: [...formData.companies, company.id]});
                          } else {
                            setFormData({...formData, companies: formData.companies.filter(id => id !== company.id)});
                          }
                        }}
                      />
                      <span>{company.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
