import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const reviews: any[] = [];

export const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Отзывы клиентов</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <Card key={review.id} className="animate-fade-in border-border/50" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {review.author[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.author}</h4>
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
