import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface EditProductModalProps {
  editingProduct: any;
  setEditingProduct: (product: any) => void;
  onSave: () => void;
}

export const EditProductModal = ({ editingProduct, setEditingProduct, onSave }: EditProductModalProps) => {
  if (!editingProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Редактировать товар</h3>
          <button onClick={() => setEditingProduct(null)}>
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Название</label>
            <Input
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Цена</label>
            <Input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Рейтинг</label>
            <Input
              type="number"
              step="0.1"
              value={editingProduct.rating}
              onChange={(e) => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Категория</label>
            <select
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="electronics">Brainrot</option>
              <option value="clothing">Одежда</option>
              <option value="shoes">Обувь</option>
              <option value="accessories">Аксессуары</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">URL изображения</label>
            <Input
              value={editingProduct.image}
              onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email продавца</label>
            <Input
              value={editingProduct.seller_email || ''}
              onChange={(e) => setEditingProduct({...editingProduct, seller_email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Telegram продавца</label>
            <Input
              value={editingProduct.seller_telegram || ''}
              onChange={(e) => setEditingProduct({...editingProduct, seller_telegram: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Имя продавца</label>
            <Input
              value={editingProduct.seller_name || ''}
              onChange={(e) => setEditingProduct({...editingProduct, seller_name: e.target.value})}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={onSave} className="flex-1">Сохранить</Button>
            <Button onClick={() => setEditingProduct(null)} variant="outline" className="flex-1">Отмена</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
