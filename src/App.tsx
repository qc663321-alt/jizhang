import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Reports from '@/pages/Reports';
import SmartImport from '@/pages/SmartImport';
import AIAnalysis from '@/pages/AIAnalysis';
import Settings from '@/pages/Settings';
import BottomNav from '@/components/common/BottomNav';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    navigate(page);
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return '/';
    if (path === '/reports') return '/reports';
    if (path === '/import') return '/import';
    if (path === '/ai-analysis') return '/ai-analysis';
    if (path === '/settings') return '/settings';
    return '/';
  };

  return (
    <div className="min-h-screen pb-16">
      <Routes />
      <BottomNav currentPage={getCurrentPage()} onNavigate={handleNavigate} />
    </div>
  );
}

function Routes() {
  const location = useLocation();
  
  const renderPage = () => {
    switch (location.pathname) {
      case '/':
        return <Dashboard />;
      case '/reports':
        return <Reports />;
      case '/import':
        return <SmartImport />;
      case '/ai-analysis':
        return <AIAnalysis />;
      case '/settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return <>{renderPage()}</>;
}

export default function App() {
  return (
    <AppContent />
  );
}
