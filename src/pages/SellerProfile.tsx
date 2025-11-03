import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const SellerProfile = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchSellerData();
  }, [email]);

  const fetchSellerData = async () => {
    try {
      const productsResp = await fetch('https://functions.poehali.dev/84a3f103-fdda-416a-abf4-551410b16841');
      if (productsResp.ok) {
        const allProducts = await productsResp.json();
        const sellerProducts = allProducts.filter((p: any) => p.seller_email === email);
        setProducts(sellerProducts);
        
        if (sellerProducts.length > 0) {
          setSeller({
            email: email,
            name: sellerProducts[0].seller_name || email?.split('@')[0] || 'Продавец'
          });
        } else {
          setSeller({
            email: email,
            name: email?.split('@')[0] || 'Продавец'
          });
        }
      }

      const reviewsResp = await fetch(`https://functions.poehali.dev/0f2c69fc-a273-45c0-bf47-9e7dc37204d6?action=get_reviews&seller_email=${email}`);
      if (reviewsResp.ok) {
        const reviewsData = await reviewsResp.json();
        setReviews(reviewsData);
      }

      const purchasesResp = await fetch(`https://functions.poehali.dev/0f2c69fc-a273-45c0-bf47-9e7dc37204d6?action=get_purchases&seller_email=${email}`);
      if (purchasesResp.ok) {
        const purchasesData = await purchasesResp.json();
        setPurchases(purchasesData);
      }
    } catch (error) {
      console.error('Failed to fetch seller data:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      await fetch('https://functions.poehali.dev/0f2c69fc-a273-45c0-bf47-9e7dc37204d6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_review',
          seller_email: email,
          reviewer_email: currentUser.email,
          reviewer_name: currentUser.name,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      setNewReview({ rating: 5, comment: '' });
      fetchSellerData();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
                {seller.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">{seller.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={20} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xl font-semibold">{avgRating}</span>
                  <span className="text-muted-foreground">({reviews.length} отзывов)</span>
                </div>
                <p className="text-muted-foreground mt-2">{seller.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Товары продавца ({products.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate('/')}>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Icon name="Package" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{product.price} ₽</p>
                    {product.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Товаров пока нет</p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Отзывы ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentUser && currentUser.email !== email && (
                  <div className="p-4 border rounded-lg bg-accent/20">
                    <h4 className="font-semibold mb-3">Оставить отзыв</h4>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={24}
                          className={`cursor-pointer transition-colors ${
                            star <= newReview.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                        />
                      ))}
                    </div>
                    <Textarea
                      placeholder="Ваш комментарий..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="mb-3"
                    />
                    <Button onClick={handleSubmitReview} className="w-full">
                      Отправить отзыв
                    </Button>
                  </div>
                )}

                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{review.reviewer_name}</span>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Отзывов пока нет</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История продаж ({purchases.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{purchase.product_name}</span>
                      <Badge variant="secondary">{purchase.product_price} ₽</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Покупатель: {purchase.buyer_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
                {purchases.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Продаж пока нет</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerProfile;