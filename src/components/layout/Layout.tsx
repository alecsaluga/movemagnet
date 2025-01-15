import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname === '/app' ? 'markets' : location.pathname.split('/').pop();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Tabs value={currentTab} onValueChange={(value) => navigate(value === 'markets' ? '/app' : `/app/${value}`)}>
        <div className="border-b">
          <div className="container mx-auto">
            <TabsList className="h-16">
              <TabsTrigger value="markets">Markets</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value={currentTab} className="flex-1">
          <Outlet />
        </TabsContent>
      </Tabs>
    </div>
  );
}