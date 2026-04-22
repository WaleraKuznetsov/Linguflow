import { useState } from 'react';
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FormInput } from '@/components/ui/form-input';
import { PasswordInput } from '@/components/ui/password-input';
import { Alert } from '@/components/ui/alert';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email обязателен';
  if (!re.test(email)) return 'Неверный формат email';
  return '';
};

const validatePassword = (password) => {
  if (!password) return 'Пароль обязателен';
  if (password.length < 6) return 'Минимум 6 символов';
  return '';
};

const validateName = (name) => {
  if (!name?.trim()) return 'Имя обязательно';
  if (name.trim().length < 2) return 'Минимум 2 символа';
  return '';
};

const AuthScreen = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  
  const { signIn, signUp } = useAuth();

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setAlert(null);
  };

  const validate = () => {
    const newErrors = {};
    if (isRegistering) {
      newErrors.name = validateName(form.name);
    }
    newErrors.email = validateEmail(form.email);
    newErrors.password = validatePassword(form.password);
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      if (isRegistering) {
        const { error, needsConfirmation } = await signUp(form.email, form.password, form.name.trim());
        console.log('SignUp result:', { error, needsConfirmation });
        
        if (error) {
          setAlert({ type: 'error', message: error });
        } else if (needsConfirmation) {
          setAlert({ 
            type: 'info', 
            message: 'Подтвердите email для активации аккаунта. Проверьте почту.' 
          });
        } else {
          setAlert({ 
            type: 'success', 
            message: 'Регистрация прошла успешно!' 
          });
        }
      } else {
        const { error } = await signIn(form.email, form.password);
        
        if (error) {
          if (error.includes('Invalid login credentials')) {
            setAlert({ type: 'error', message: 'Неверный email или пароль' });
          } else {
            setAlert({ type: 'error', message: error });
          }
        }
      }
    } catch {
      setAlert({ type: 'error', message: 'Что-то пошло не так. Попробуйте снова.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <BookOpen className="text-primary-foreground w-10 h-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl font-black text-foreground tracking-tight">
            LinguFlow
          </h1>
          <p className="text-muted-foreground mt-3 font-medium text-lg">
            {isRegistering ? 'Создайте аккаунт для начала обучения' : 'С возвращением! Войдите в аккаунт'}
          </p>
        </div>

        {alert && (
          <Alert 
            variant={alert.type} 
            className="mb-6"
          >
            {alert.message}
          </Alert>
        )}

        <Card className="shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-5">
              {isRegistering && (
                <FormInput
                  label="Имя"
                  icon={User}
                  placeholder="Ваше имя"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  autoComplete="name"
                />
              )}
              
              <FormInput
                label="Email"
                icon={Mail}
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
                autoComplete="email"
              />
              
              <PasswordInput
                label="Пароль"
                placeholder={isRegistering ? 'Минимум 6 символов' : 'Введите пароль'}
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
              />

              {!isRegistering && (
                <div className="text-right">
                  <button 
                    type="button"
                    className="text-sm text-primary hover:text-primary/90 font-semibold transition-colors"
                  >
                    Забыли пароль?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl font-bold text-base bg-primary-gradient text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isRegistering ? 'Зарегистрироваться' : 'Войти'}
                    {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-medium">или</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button"
                disabled={true}
                className="w-full h-12 rounded-xl font-semibold opacity-50 cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google (скоро)
              </Button>
            </CardContent>
            
            <CardFooter className="flex justify-center pb-8 pt-2">
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrors({});
                  setAlert(null);
                }}
                className="text-muted-foreground font-semibold hover:text-primary transition-colors"
              >
                {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
          Продолжая, вы соглашаетесь с нашими{' '}
          <a href="#" className="text-primary hover:underline">Условиями</a>
          {' '}и{' '}
          <a href="#" className="text-primary hover:underline">Политикой конфиденциальности</a>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
