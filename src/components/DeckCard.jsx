import { Layers, Trash2, Edit3, Brain, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

const DeckCard = ({ deck, onStudy, onReview, onManage, onDelete }) => {
  return (
    <Card className="group relative overflow-hidden border border-border shadow-sm hover:shadow-md dark:shadow-none transition-all duration-300 hover:-translate-y-1 bg-card hover:border-primary/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-2xl flex items-center justify-center transition-all duration-300">
            <Layers size={28} strokeWidth={2} />
          </div>
          <TooltipProvider delay={400}>
            <Tooltip>
              <TooltipTrigger
                render={<span className="inline-flex" />}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:opacity-100"
                >
                  <Trash2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Удалить колоду</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardTitle className="text-xl font-black text-foreground mt-4 leading-tight group-hover:text-primary transition-colors">
          {deck.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium group-hover:text-primary/80 transition-colors">
          {deck.description || 'Пользовательская колода'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-accent text-accent-foreground font-bold px-3 py-1">
            {deck.cards.length} слов
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button 
          onClick={onStudy}
          className="flex-1 h-11 rounded-xl font-bold text-sm bg-primary-gradient text-primary-foreground shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        >
          <Brain size={18} className="mr-2" />
          Учить
        </Button>
        <TooltipProvider delay={400}>
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <Button 
                onClick={onReview}
                variant="outline"
                className="h-11 w-11 rounded-xl border-border hover:bg-accent transition-all"
              >
                <RefreshCw size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Повторить (SRS)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delay={400}>
          <Tooltip>
            <TooltipTrigger render={<span className="inline-flex" />}>
              <Button 
                onClick={onManage}
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl border-border hover:bg-accent transition-all"
              >
                <Edit3 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Редактировать</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default DeckCard;
