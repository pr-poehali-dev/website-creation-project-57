import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

export default function Rules() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                MNS.shop
              </span>
            </Link>
            <Link to="/">
              <Button variant="ghost">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Правила магазина
        </h1>

        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="ShieldCheck" size={28} className="text-green-500" />
              Честность и прозрачность
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <Icon name="Check" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>Все товары соответствуют описанию и фотографиям на сайте</span>
              </li>
              <li className="flex gap-2">
                <Icon name="Check" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>Цены указаны итоговые, без скрытых комиссий</span>
              </li>
              <li className="flex gap-2">
                <Icon name="Check" size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>Мы ответственны за то, чтобы вы получили то, что и должны были</span>
              </li>
            </ul>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Users" size={28} className="text-accent" />
              Поддержка клиентов
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-2">
                <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <span>Консультация по товарам 24/7</span>
              </li>
              <li className="flex gap-2">
                <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <span>Быстрый ответ на любые вопросы</span>
              </li>
              <li className="flex gap-2">
                <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-0.5" />
                <span>Помощь в выборе и оформлении заказа</span>
              </li>
            </ul>
          </section>

          <div className="bg-gradient-to-r from-green-600/10 to-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <Icon name="Heart" size={40} className="text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Мы ценим каждого клиента!</p>
            <p className="text-muted-foreground">
              Ваше доверие — наша главная награда. Работаем честно и открыто.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
              <Icon name="Home" size={20} className="mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}