import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import {
  Building2,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Double-check admin status
  useEffect(() => {
    async function verifyAdmin() {
      if (!user) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (!profile?.is_admin) {
          console.error('Access denied: User is not an admin');
          navigate('/');
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
        navigate('/');
      }
    }

    verifyAdmin();
  }, [user, navigate]);

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 text-white">
        <div className="p-6">
          <Logo />
        </div>
        <nav className="mt-6">
          <Button
            variant="ghost"
            className="w-full justify-start px-6 py-3 text-left"
            onClick={() => navigate('/admin')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-6 py-3 text-left"
            onClick={() => navigate('/admin/markets')}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Markets
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-6 py-3 text-left"
            onClick={() => navigate('/admin/users')}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-6 py-3 text-left"
            onClick={() => navigate('/admin/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}