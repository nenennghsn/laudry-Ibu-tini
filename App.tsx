import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './views/Home';
import Services from './views/Services';
import Gallery from './views/Gallery';
import Transactions from './views/Transactions';
import AdminReports from './views/AdminReports';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home setView={setCurrentView} />;
      case 'services': return <Services />;
      case 'gallery': return <Gallery />;
      case 'transactions': return <Transactions />;
      case 'reports': return <AdminReports />;
      default: return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-900 flex justify-center">
      {/* Mobile Frame Simulation Container */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-hidden">
        
        {/* Main Content Area */}
        <main className="h-full overflow-y-auto no-scrollbar">
          {renderView()}
        </main>

        {/* Floating Elements */}
        <WhatsAppButton />
        <BottomNav currentView={currentView} setView={setCurrentView} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;