import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';

const products = [
  { 
    id: 1, 
    name: 'Los Mobilis Yin Yang 165 M/S', 
    price: 400, 
    category: 'electronics', 
    image: 'https://cdn.poehali.dev/files/20b3b8e7-ba98-4bdc-bf25-59937138561f.jpg', 
    rating: 4.9 
  },
];

const reviews = [];

const Index = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const handlePurchase = (product: any) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    window.open(`https://t.me/CeTzyyy?text=Хочу купить: ${product.name} (${product.price} ₽)`, '_blank');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
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
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {currentUser.name}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  <Icon name="LogOut" size={18} className="mr-2" />
                  Выход
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline">
                  <Icon name="User" size={18} className="mr-2" />
                  Вход
                </Button>
              </Link>
            )}
            <Button variant="outline" size="icon">
              <Icon name="ShoppingCart" size={20} />
            </Button>
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
          
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card key={product.id} className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-scale-in border-border/50" style={{ animationDelay: `${index * 50}ms` }}>
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
    </div>
  );
};

export default Index;