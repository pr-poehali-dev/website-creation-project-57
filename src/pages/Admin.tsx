import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { EditProductModal } from '@/components/EditProductModal';

export default function Admin() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, sold: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const adminEnabled = localStorage.getItem('adminMode');
    if (adminEnabled !== 'true') {
      navigate('/');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setStats({
          total: data.length,
          active: data.filter((p: any) => !p.sold).length,
          sold: data.filter((p: any) => p.sold).length
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({ title: 'Товар удален' });
        fetchProducts();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить товар', variant: 'destructive' });
    }
  };

  const exitAdminMode = () => {
    localStorage.removeItem('adminMode');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Админ-панель</h1>
              <p className="text-xs text-muted-foreground">MNS.shop</p>
            </div>
          </div>
          <Button variant="outline" onClick={exitAdminMode}>
            <Icon name="LogOut" size={18} />
            Выйти из админки
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего товаров</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Активные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Проданные</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.sold}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Управление товарами</h2>
          <Button onClick={() => navigate('/add-product')} className="bg-gradient-to-r from-primary to-secondary">
            <Icon name="Plus" size={18} />
            Добавить товар
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{product.price} ₽</p>
                        {product.sold && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            Продано
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Icon name="Pencil" size={16} />
                        Редактировать
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Icon name="Trash2" size={16} />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Товары отсутствуют</p>
          </div>
        )}
      </main>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
