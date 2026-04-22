import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const RATING_BUTTONS = [
  { label: 'Снова', rating: 0, variant: 'destructive', hint: 'Не вспомнили — повтор завтра' },
  { label: 'Трудно', rating: 1, variant: 'outline', hint: 'Вспомнили с трудом' },
  { label: 'Хорошо', rating: 2, variant: 'default', hint: 'Вспомнили легко — через неск. дней' },
  { label: 'Легко', rating: 3, variant: 'secondary', hint: 'Знали сразу — долгий интервал' }
];

const Flashcard = ({ card, onRate }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleRate = (e, rating) => {
    e.stopPropagation();
    setIsFlipped(false);
    onRate(rating);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[480px] perspective-1000">
      <div
        onClick={handleFlip}
        className={cn(
          "relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer",
          isFlipped ? 'rotate-y-180' : ''
        )}
      >
        <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card border-2 border-primary/20 shadow-2xl backface-hidden h-full">
          <CardContent className="flex flex-col items-center justify-center h-full p-0">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/10">
              English Word
            </Badge>
            <h2 className="text-5xl font-black text-foreground break-words w-full tracking-tight text-center">{card.front}</h2>
            <div className="mt-12 flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <RotateCcw size={16} />
              <span>Нажмите для перевода</span>
            </div>
          </CardContent>
        </Card>

        <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-primary-gradient border-0 shadow-2xl backface-hidden rotate-y-180 h-full">
          <CardContent className="flex flex-col items-center justify-center h-full p-0 text-primary-foreground">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-white/15 text-white/90 hover:bg-white/15">
              Перевод
            </Badge>
            <h2 className="text-5xl font-black break-words w-full tracking-tight text-center text-white">{card.back}</h2>
          </CardContent>
        </Card>
      </div>

      <div className={cn(
        "flex gap-2 mt-8 w-full transition-all duration-300",
        isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        <TooltipProvider delay={500}>
          {RATING_BUTTONS.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger render={<span className="inline-flex flex-1" />}>
                <Button
                  onClick={(e) => handleRate(e, item.rating)}
                  variant={item.variant}
                  className="w-full h-12 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
                >
                  {item.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{item.hint}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Flashcard;
