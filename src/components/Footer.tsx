import Icon from '@/components/ui/icon';

export const Footer = () => {
  return (
    <footer className="bg-card/50 py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MNS.shop
            </h3>
            <p className="text-muted-foreground">Ваш надежный онлайн-магазин</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                support@mns.shop
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                +7 (999) 123-45-67
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Социальные сети</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Icon name="Facebook" size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© 2024 MNS.shop. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
