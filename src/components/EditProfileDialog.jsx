import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const AVATAR_STYLES = [
  { id: 'initials', label: 'Инициалы' },
  { id: 'avataaars', label: 'Аватар' },
  { id: 'bottts', label: 'Робот' },
  { id: 'fun-emoji', label: 'Эмодзи' },
  { id: 'lorelei', label: 'Лорелея' },
  { id: 'pixel-art', label: 'Пиксель' },
  { id: 'thumbs', label: 'Палец' },
  { id: 'big-smile', label: 'Улыбка' }
];

const getAvatarUrl = (seed, style) =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed || 'default')}`;

const EditProfileDialog = ({ open, onOpenChange, profile, email, onSave }) => {
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarStyle, setAvatarStyle] = useState(profile?.avatar_style || 'initials');

  const handleSave = () => {
    onSave({ username: username.trim(), avatar_style: avatarStyle });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Редактировать профиль</DialogTitle>
          <DialogDescription>Измените имя и аватар</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Имя</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 rounded-xl"
              placeholder="Ваше имя"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Стиль аватара</label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_STYLES.map(style => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setAvatarStyle(style.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:border-primary/50",
                    avatarStyle === style.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  )}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={getAvatarUrl(email, style.id)} />
                    <AvatarFallback className="text-xs">
                      {style.label[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] font-bold text-muted-foreground leading-tight">
                    {style.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="h-12 rounded-xl font-bold"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            className="h-12 px-8 rounded-xl font-bold bg-primary-gradient text-primary-foreground"
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
export { getAvatarUrl };
