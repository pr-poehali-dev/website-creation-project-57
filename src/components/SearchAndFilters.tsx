import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface SearchAndFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  priceMin: string;
  setPriceMin: (value: string) => void;
  priceMax: string;
  setPriceMax: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export const SearchAndFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  sortBy,
  setSortBy
}: SearchAndFiltersProps) => {
  return (
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
  );
};
