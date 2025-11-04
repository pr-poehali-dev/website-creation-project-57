import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const HeroSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
          Добро пожаловать в MNS.shop
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Лучшие товары по лучшим ценам
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '200ms' }}>
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-lg px-8 hover:scale-105 transition-transform">
            <Icon name="ShoppingCart" size={20} className="mr-2" />
            Начать покупки
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 hover:scale-105 transition-transform">
            <Icon name="Info" size={20} className="mr-2" />
            О нас
          </Button>
        </div>
      </div>
    </section>
  );
};
