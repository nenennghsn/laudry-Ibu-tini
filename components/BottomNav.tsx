import React from 'react';
import { Home, Shirt, Image as ImageIcon, FileText, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  currentView: string;
  setView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const { role } = useApp();

  const navItemClass = (viewName: string) =>
    `flex flex-col items-center justify-center w-full py-2 transition-colors ${
      currentView === viewName ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
    }`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        <button onClick={() => setView('home')} className={navItemClass('home')}>
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Beranda</span>
        </button>

        <button onClick={() => setView('services')} className={navItemClass('services')}>
          <Shirt size={24} />
          <span className="text-[10px] mt-1 font-medium">Layanan</span>
        </button>

        <button onClick={() => setView('gallery')} className={navItemClass('gallery')}>
          <ImageIcon size={24} />
          <span className="text-[10px] mt-1 font-medium">Galeri</span>
        </button>

        <button onClick={() => setView('transactions')} className={navItemClass('transactions')}>
          <FileText size={24} />
          <span className="text-[10px] mt-1 font-medium">Transaksi</span>
        </button>

        {role === 'admin' && (
          <button onClick={() => setView('reports')} className={navItemClass('reports')}>
            <BarChart3 size={24} />
            <span className="text-[10px] mt-1 font-medium">Laporan</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomNav;