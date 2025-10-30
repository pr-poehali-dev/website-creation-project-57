import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(user);
    setCurrentUser(userData);
    setEditedName(userData.name);
    setEditedEmail(userData.email);
    fetchUserProducts(userData.email);
  }, [navigate]);

  const fetchUserProducts = async (email: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841');
      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter((p: any) => p.seller_email === email);
        setUserProducts(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const response = await fetch(`https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Email': currentUser.email
        }
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Товар удалён из каталога'
        });
        setUserProducts(userProducts.filter(p => p.id !== productId));
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleSaveProfile = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], name: editedName, email: editedEmail };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...currentUser, name: editedName, email: editedEmail };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      toast({
        title: 'Успешно!',
        description: 'Профиль обновлен'
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(currentUser.name);
    setEditedEmail(currentUser.email);
    setIsEditing(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer">
              MNS.shop
            </h1>
          </Link>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="User" size={32} className="text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                    <CardDescription>{currentUser.email}</CardDescription>
                  </div>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выйти
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="products">
                <Icon name="Package" size={18} className="mr-2" />
                Мои Brainrot
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Icon name="Settings" size={18} className="mr-2" />
                Настройки
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Мои Brainrot ({userProducts.length})</h2>
                <Link to="/add-product">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить Brainrot
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Загрузка...</p>
                </div>
              ) : userProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Icon name="Package" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">У вас пока нет Brainrot</h3>
                    <p className="text-muted-foreground mb-4">Добавьте свой первый Brainrot на продажу</p>
                    <Link to="/add-product">
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить товар
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="mb-4 overflow-hidden rounded-lg">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Icon name="Star" size={14} className="fill-accent text-accent" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="mb-3">
                          {product.category === 'electronics' && 'Brainrot'}
                          {product.category === 'clothing' && 'Одежда'}
                          {product.category === 'shoes' && 'Обувь'}
                          {product.category === 'accessories' && 'Аксессуары'}
                        </Badge>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                          {product.price.toLocaleString()} ₽
                        </p>
                      </CardContent>
                      <CardFooter className="p-6 pt-0 gap-2">
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Icon name="Trash2" size={18} className="mr-2" />
                          Удалить
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Информация об аккаунте</CardTitle>
                      <CardDescription>Ваши личные данные</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Icon name="Edit" size={18} className="mr-2" />
                        Редактировать
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Имя</Label>
                        <Input 
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Введите ваше имя"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          placeholder="Введите ваш email"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSaveProfile} className="flex-1">
                          <Icon name="Check" size={18} className="mr-2" />
                          Сохранить
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                          <Icon name="X" size={18} className="mr-2" />
                          Отмена
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Имя</p>
                        <p className="text-lg">{currentUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-lg">{currentUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Дата регистрации</p>
                        <p className="text-lg">
                          {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('ru-RU') : 'Не указана'}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;