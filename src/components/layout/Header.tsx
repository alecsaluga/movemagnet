import { Logo } from './Logo';
import { UserProfile } from './UserProfile';

export function Header() {
  return (
    <header className="bg-zinc-900 text-white border-b border-zinc-800">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <Logo />
        <UserProfile />
      </div>
    </header>
  );
}