import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';

const products: any[] = [];

const reviews = [];

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'KeyG') {
        e.preventDefault();
        setAdminMode(prev => {
          console.log('Admin mode toggled:', !prev);
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchFavorites();
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841');
      if (response.ok) {
        const data = await response.json();
        setUserProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchFavorites = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch(`https://functions.poehali.dev/3dd7b6c6-8df1-4991-a4fd-9969397ab8bc?user_email=${currentUser.email}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((item: any) => item.id));
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const toggleFavorite = async (productId: number) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const isFavorite = favorites.includes(productId);
    
    try {
      if (isFavorite) {
        await fetch(`https://functions.poehali.dev/3dd7b6c6-8df1-4991-a4fd-9969397ab8bc?user_email=${currentUser.email}&product_id=${productId}`, {
          method: 'DELETE'
        });
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        await fetch('https://functions.poehali.dev/3dd7b6c6-8df1-4991-a4fd-9969397ab8bc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: currentUser.email, product_id: productId })
        });
        setFavorites([...favorites, productId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const handlePurchase = async (product: any) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      await fetch('https://functions.poehali.dev/0f2c69fc-a273-45c0-bf47-9e7dc37204d6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchase',
          product_id: product.id,
          buyer_email: currentUser.email,
          buyer_name: currentUser.name,
          seller_email: product.seller_email || 'admin@mns.shop',
          product_name: product.name,
          product_price: product.price
        })
      });
    } catch (error) {
      console.error('Failed to record purchase:', error);
    }
    
    window.open(`https://t.me/CeTzyyy?text=Хочу купить: ${product.name} (${product.price} ₽)`, '_blank');
  };

  const handleDeleteProduct = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Deleting product ID:', productId);
    if (!confirm('Удалить этот товар из каталога?')) return;
    
    try {
      const url = `https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841?id=${productId}`;
      console.log('DELETE request to:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'X-User-Email': 'admin@mns.shop'
        }
      });
      
      const data = await response.json();
      console.log('Delete response:', response.status, data);
      
      if (response.ok) {
        console.log('Product deleted, refreshing list...');
        await fetchProducts();
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось удалить товар'));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Ошибка при удалении товара');
    }
  };

  const handleEditProduct = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': 'admin@mns.shop'
        },
        body: JSON.stringify(editingProduct)
      });
      
      if (response.ok) {
        await fetchProducts();
        setEditingProduct(null);
      } else {
        const data = await response.json();
        alert('Ошибка: ' + (data.error || 'Не удалось обновить товар'));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Ошибка при обновлении товара');
    }
  };

  const allProducts = [...products, ...userProducts];

  const filteredProducts = allProducts
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || p.category === category;
      const matchesPriceMin = !priceMin || p.price >= parseFloat(priceMin);
      const matchesPriceMax = !priceMax || p.price <= parseFloat(priceMax);
      return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MNS.shop
          </h1>
          <nav className="hidden md:flex gap-8">
            <a href="#catalog" className="text-foreground/80 hover:text-foreground transition-colors">Каталог</a>
            <a href="#reviews" className="text-foreground/80 hover:text-foreground transition-colors">Отзывы</a>
          </nav>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                <Button variant="outline" size="icon" className="relative" onClick={() => alert(`У вас ${favorites.length} товаров в избранном`)}>
                  <Icon name="Heart" size={20} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
                <Link to="/add-product">
                  <Button variant="outline" className="hidden md:flex">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить товар
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" size="icon">
                    <Icon name="User" size={20} />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline">
                  <Icon name="User" size={18} className="mr-2" />
                  Вход
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Быстро, надёжно, без обмана
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              У нас все честно и надежно!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rules">
                <Button size="lg" className="animate-shimmer text-white relative overflow-hidden group">
                  <span className="relative z-10">Правила</span>
                  <span className="absolute inset-0 bg-green-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                </Button>
              </Link>
              <a href="#catalog">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  Смотреть товары
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Каталог товаров</h2>
          
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={category} onValueChange={setCategory}>
                <TabsList className="bg-card">
                  <TabsTrigger value="all">Всё</TabsTrigger>
                  <TabsTrigger value="electronics">Brainrot</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Цена от"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-32"
                />
                <Input
                  type="number"
                  placeholder="Цена до"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-32"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="newest">Сначала новые</option>
                <option value="price-asc">Дешевле</option>
                <option value="price-desc">Дороже</option>
                <option value="rating">По рейтингу</option>
                <option value="name">По названию</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-scale-in border-border/50 relative" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                  {!adminMode && (
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      <Icon name="Heart" size={16} className={favorites.includes(product.id) ? 'fill-red-500' : ''} />
                    </button>
                  )}
                  {adminMode && (
                    <>
                      <button
                        onClick={(e) => handleEditProduct(product, e)}
                        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteProduct(product.id, e)}
                        className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4 text-center overflow-hidden rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
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
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {product.price.toLocaleString()} ₽
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    onClick={() => handlePurchase(product)}
                  >
                    Перейти к покупке
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">Ничего не найдено. Попробуй другой запрос</p>
            </div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Отзывы клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={review.id} className="animate-fade-in border-border/50" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{review.text}</p>
                  <p className="font-semibold">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 MNS.shop. Все права защищены</p>
        </div>
      </footer>

      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingProduct(null)}>
          <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Редактировать товар</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Цена (₽)</Label>
                <Input 
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label>Категория</Label>
                <Input 
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                />
              </div>
              <div>
                <Label>Ссылка на изображение</Label>
                <Input 
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">Сохранить</Button>
                <Button onClick={() => setEditingProduct(null)} variant="outline" className="flex-1">Отмена</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;