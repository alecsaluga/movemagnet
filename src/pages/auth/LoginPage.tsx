import { Logo } from '@/components/layout/Logo';
import { LoginForm } from '@/components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="bg-card p-6 rounded-lg shadow-xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}