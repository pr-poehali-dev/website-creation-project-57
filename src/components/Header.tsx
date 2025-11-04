import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: any;
  favoritesCount: number;
  onLogout: () => void;
}

export const Header = ({ theme, toggleTheme, currentUser, favoritesCount, onLogout }: HeaderProps) => {
  return (
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
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
          </Button>
          {currentUser ? (
            <>
              <Button variant="outline" size="icon" className="relative" onClick={() => alert(`У вас ${favoritesCount} товаров в избранном`)}>
                <Icon name="Heart" size={20} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
              <Link to="/account">
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  <Icon name="User" size={16} />
                  {currentUser.name}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={onLogout} className="hidden md:block">
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Войти</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
