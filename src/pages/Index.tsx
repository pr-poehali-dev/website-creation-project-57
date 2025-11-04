import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { ProductCard } from '@/components/ProductCard';
import { EditProductModal } from '@/components/EditProductModal';
import { ReviewsSection } from '@/components/ReviewsSection';
import { Footer } from '@/components/Footer';

const products: any[] = [];

const Index = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => {
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
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        favoritesCount={favorites.length}
        onLogout={handleLogout}
      />

      <HeroSection />

      <section id="catalog" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Каталог товаров</h2>
          
          <SearchAndFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                adminMode={adminMode}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onPurchase={handlePurchase}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">Ничего не найдено. Попробуй другой запрос</p>
            </div>
          )}
        </div>
      </section>

      <ReviewsSection />

      <Footer />

      <EditProductModal
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Index;
