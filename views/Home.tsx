import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, LogOut, Lock, ArrowRight, Cloud, WifiOff } from 'lucide-react';

interface HomeProps {
  setView: (view: string) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  const { role, setRole, resetData, isOnline, syncData } = useApp();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const [isDbModalOpen, setIsDbModalOpen] = useState(false); // Hidden feature
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // DB Form (Hidden functionality)
  const [dbUrl, setDbUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [dbKey, setDbKey] = useState(localStorage.getItem('supabase_key') || '');

  const toggleRole = () => {
    if (role === 'admin') {
      setRole('customer');
    } else {
      setIsLoginOpen(true);
      setError('');
      setPassword('');
    }
  };

  const handleLogin = () => {
    if (password === '123456') {
      setRole('admin');
      setIsLoginOpen(false);
      setView('transactions');
    } else {
      setError('Password salah!');
    }
  };

  /* Hidden handlers
  const handleSaveDb = () => {
    localStorage.setItem('supabase_url', dbUrl);
    localStorage.setItem('supabase_key', dbKey);
    setIsDbModalOpen(false);
    alert('Konfigurasi tersimpan! Aplikasi akan mencoba sinkronisasi.');
    syncData();
  };
  */

  const handleMainAction = () => {
    if (role === 'admin') {
      setView('transactions');
    } else {
      setView('services');
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cucian Nih</h1>
          <div className="flex items-center gap-1.5 mt-1">
             <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
             <p className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline Mode'}</p>
          </div>
        </div>
        {/* Settings Button Removed/Hidden 
        <button onClick={() => setIsDbModalOpen(true)} className="bg-blue-50 p-2 rounded-full text-blue-600">
          <Settings size={20} />
        </button>
        */}
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-1">
            {role === 'customer' ? 'Selamat Datang!' : 'Halo, Admin!'}
          </h2>
          <p className="text-blue-50 text-sm mb-4">
            {role === 'customer' 
              ? 'Pakaian bersih, wangi, dan rapi siap kami antar.'
              : 'Pantau transaksi dan kelola laundry dengan mudah.'}
          </p>
          <button 
            onClick={handleMainAction}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm active:scale-95 transition-transform"
          >
            {role === 'customer' ? 'Lihat Layanan' : 'Input Order Baru'}
          </button>
        </div>
        <div className="absolute -bottom-4 -right-4 opacity-20">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" />
          </svg>
        </div>
      </div>

      {/* Quick Menu */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Menu Cepat</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setView('services')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.4a1.6 1.6 0 0 1 .58 2.15l-6.18 10.7a1.6 1.6 0 0 1-2.15.58l-10.7-6.18a1.6 1.6 0 0 1-.58-2.15l6.18-10.7a1.6 1.6 0 0 1 2.15-.58l10.7 6.18Z"/><path d="M16 2v4"/><path d="M22 8h-4"/><path d="M12 15v7"/><path d="M8 15v7"/><path d="M4 15v7"/></svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Daftar Harga</span>
          </button>
          
          <button onClick={() => setView('transactions')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <span className="text-sm font-medium text-gray-700">{role === 'admin' ? 'Input Order' : 'Pesanan Saya'}</span>
          </button>

          <button onClick={() => setView('gallery')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition">
             <div className="bg-pink-100 p-3 rounded-full text-pink-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Galeri Foto</span>
          </button>

           <a href="https://wa.me/6281385035662" target="_blank" rel="noreferrer" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition">
             <div className="bg-green-100 p-3 rounded-full text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Chat Admin</span>
          </a>
        </div>
      </div>

      {/* Settings / Mode Switcher */}
      <div className="pt-4 border-t border-gray-200">
         <h3 className="font-semibold text-gray-800 mb-2">Pengaturan Aplikasi</h3>
         
         <div className="space-y-3">
           <button 
            onClick={toggleRole}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200 active:bg-gray-50"
           >
             <div className="flex items-center gap-3">
               <div className={`${role === 'admin' ? 'bg-red-50' : 'bg-blue-50'} p-2 rounded-full`}>
                  {role === 'admin' ? <LogOut size={18} className="text-red-600" /> : <User size={18} className="text-blue-600" />}
               </div>
               <div className="text-left">
                 <p className="text-sm font-semibold text-gray-900">
                    Mode: {role === 'customer' ? 'Pelanggan' : 'Administrator'}
                 </p>
                 <p className="text-xs text-gray-500">
                    {role === 'customer' ? 'Ketuk untuk masuk Admin' : 'Ketuk untuk keluar Admin'}
                 </p>
               </div>
             </div>
             <ArrowRight size={16} className="text-gray-400" />
           </button>

           {/* Database and Reset Data buttons hidden as requested */}
         </div>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl scale-100">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Admin Login</h3>
              <p className="text-xs text-gray-500">Masukkan password (123456)</p>
            </div>
            
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold tracking-widest"
              placeholder="******"
              autoFocus
            />
            
            {error && <p className="text-red-500 text-xs text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setIsLoginOpen(false); setError(''); setPassword(''); }} className="py-2 text-gray-500 font-medium text-sm hover:bg-gray-50 rounded-lg">
                Batal
              </button>
              <button onClick={handleLogin} className="py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 shadow-md">
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Modal removed from view */}
    </div>
  );
};

export default Home;