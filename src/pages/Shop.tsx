import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Shop() {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!productId) {
      navigate('/');
      return;
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841');
      if (response.ok) {
        const data = await response.json();
        const found = data.find((p: any) => p.id === parseInt(productId!));
        if (found && !found.sold) {
          setProduct(found);
        } else {
          toast({ title: 'Товар недоступен', variant: 'destructive' });
          navigate('/');
        }
      }
    } catch (error) {
      toast({ title: 'Ошибка загрузки', variant: 'destructive' });
      navigate('/');
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerName.trim() || !buyerContact.trim()) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          sold: true
        })
      });

      if (response.ok) {
        toast({
          title: 'Покупка оформлена! 🎉',
          description: 'Продавец свяжется с вами в ближайшее время'
        });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast({ title: 'Ошибка оформления', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="ShoppingCart" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">Оформление покупки</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardContent className="p-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <span className="text-sm font-medium">Цена за единицу:</span>
                  <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">Данные покупателя</h3>
                
                <form onSubmit={handlePurchase} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ваше имя</label>
                    <Input
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Иван Иванов"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Контакт (Telegram или телефон)</label>
                    <Input
                      value={buyerContact}
                      onChange={(e) => setBuyerContact(e.target.value)}
                      placeholder="@username или +7..."
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Количество</label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={loading}
                      >
                        <Icon name="Minus" size={18} />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-center w-20"
                        min="1"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={loading}
                      >
                        <Icon name="Plus" size={18} />
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg font-medium">Итого:</span>
                      <span className="text-3xl font-bold text-primary">{totalPrice} ₽</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg py-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Icon name="Loader2" size={20} className="animate-spin" />
                          Оформление...
                        </>
                      ) : (
                        <>
                          <Icon name="Check" size={20} />
                          Купить за {totalPrice} ₽
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex gap-2 text-sm text-blue-800 dark:text-blue-200">
                    <Icon name="Info" size={16} className="flex-shrink-0 mt-0.5" />
                    <p>После оформления продавец свяжется с вами для согласования деталей и оплаты</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
