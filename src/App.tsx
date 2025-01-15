import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { ProfilePage } from '@/pages/auth/ProfilePage';
import { MarketsPage } from '@/pages/MarketsPage';
import { LeadsPage } from '@/pages/LeadsPage';
import { Layout } from '@/components/layout/Layout';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminMarkets } from '@/pages/admin/AdminMarkets';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          
          {/* User routes */}
          <Route
            path="/app"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<MarketsPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin routes - now double protected */}
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              </AuthGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="markets" element={<AdminMarkets />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}