import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    telegram: ''
  });


  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.telegram.startsWith('@')) {
      toast({
        title: 'Ошибка',
        description: 'Никнейм должен начинаться с @',
        variant: 'destructive'
      });
      return;
    }

    if (formData.telegram.length < 2) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректный никнейм Telegram',
        variant: 'destructive'
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const existingUser = users.find((u: any) => u.telegram === formData.telegram);
    if (existingUser) {
      toast({
        title: 'Ошибка',
        description: 'Пользователь с таким никнеймом уже зарегистрирован',
        variant: 'destructive'
      });
      return;
    }

    const newUser = {
      telegram: formData.telegram
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    toast({
      title: 'Успешно!',
      description: 'Регистрация прошла успешно!'
    });

    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MNS.shop
            </span>
          </Link>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Регистрация</CardTitle>
            <CardDescription className="text-center">
              Создайте аккаунт для покупок
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="telegram" className="text-sm font-medium">
                  Никнейм Telegram
                </label>
                <div className="relative">
                  <Icon name="AtSign" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telegram"
                    name="telegram"
                    type="text"
                    placeholder="@username"
                    value={formData.telegram}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                Зарегистрироваться
              </Button>
            </form>


          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
            <Icon name="ArrowLeft" size={16} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}