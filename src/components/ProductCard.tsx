import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: any;
  index: number;
  adminMode: boolean;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onEdit: (product: any, e: React.MouseEvent) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  onPurchase: (product: any) => void;
}

export const ProductCard = ({
  product,
  index,
  adminMode,
  favorites,
  onToggleFavorite,
  onEdit,
  onDelete,
  onPurchase
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card key={product.id} className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-scale-in border-border/50 relative" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {!adminMode && (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 flex items-center justify-center shadow-lg transition-all hover:scale-110"
          >
            <Icon name="Heart" size={16} className={favorites.includes(product.id) ? 'fill-red-500' : ''} />
          </button>
        )}
        {adminMode && (
          <>
            <button
              onClick={(e) => onEdit(product, e)}
              className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110"
            >
              <Icon name="Pencil" size={16} />
            </button>
            <button
              onClick={(e) => onDelete(product.id, e)}
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
        {product.seller_email && (
          <button
            onClick={() => navigate(`/seller/${product.seller_email}`)}
            className="text-sm text-primary hover:underline mt-2 flex items-center gap-1"
          >
            <Icon name="User" size={14} />
            Профиль продавца
          </button>
        )}
        {adminMode && (
          <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs space-y-1">
            <div><strong>Email:</strong> {product.seller_email || 'N/A'}</div>
            <div><strong>Telegram:</strong> {product.seller_telegram || 'N/A'}</div>
            <div><strong>Имя:</strong> {product.seller_name || 'N/A'}</div>
            <div><strong>ID:</strong> {product.id}</div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          onClick={() => onPurchase(product)}
        >
          Перейти к покупке
        </Button>
      </CardFooter>
    </Card>
  );
};
