import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, ServiceItem, GalleryItem, Transaction, UserRole } from '../types';
import { getSupabaseClient, hasDbConfig } from '../utils/supabase';

interface AppContextType extends AppState {
  setRole: (role: UserRole) => void;
  addService: (service: ServiceItem) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  addTransaction: (transaction: Transaction) => void;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  addPhoto: (photo: GalleryItem) => void;
  removePhoto: (id: string) => void;
  resetData: () => void;
  isOnline: boolean;
  syncData: () => Promise<void>;
}

const initialServices: ServiceItem[] = [
  { 
    id: '1', 
    name: 'Cuci Komplit (Cuci + Setrika)', 
    price: 7000, 
    unit: 'kg', 
    isActive: true, 
    description: 'Layanan standar bersih dan rapi.',
    image: 'https://images.unsplash.com/photo-1545173168-9f1947eebb8f?w=200&h=200&fit=crop'
  },
  { 
    id: '2', 
    name: 'Cuci Kering (Lipat)', 
    price: 5000, 
    unit: 'kg', 
    isActive: true, 
    description: 'Tanpa setrika, cocok untuk pakaian santai.',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe8d75206c1?w=200&h=200&fit=crop'
  },
  { 
    id: '3', 
    name: 'Setrika Saja', 
    price: 4000, 
    unit: 'kg', 
    isActive: true, 
    description: 'Hanya jasa setrika uap.',
    image: 'https://images.unsplash.com/photo-1489274495757-95c7c83700c0?w=200&h=200&fit=crop'
  },
  { 
    id: '4', 
    name: 'Bedcover Besar', 
    price: 25000, 
    unit: 'pcs', 
    isActive: true, 
    description: 'Cuci bersih bedcover ukuran King/Queen.',
    image: 'https://images.unsplash.com/photo-1599908680789-724d9c737976?w=200&h=200&fit=crop'
  },
  { 
    id: '5', 
    name: 'Karpet', 
    price: 15000, 
    unit: 'meter', 
    isActive: true, 
    description: 'Cuci karpet bersih wangi.',
    image: 'https://images.unsplash.com/photo-1579308638421-507949352dc0?w=200&h=200&fit=crop'
  },
];

const initialGallery: GalleryItem[] = [
  { id: '1', url: 'https://picsum.photos/400/300?random=1', caption: 'Area Produksi Bersih' },
  { id: '2', url: 'https://picsum.photos/400/300?random=2', caption: 'Mesin Cuci Modern' },
  { id: '3', url: 'https://picsum.photos/400/300?random=3', caption: 'Hasil Setrika Uap' },
];

const initialTransactions: Transaction[] = [
  { id: 'TRX-001', customerName: 'Budi Santoso', date: new Date(Date.now() - 86400000 * 2).toISOString(), serviceId: '1', serviceName: 'Cuci Komplit', weightOrQty: 5, totalPrice: 35000, status: 'picked_up' },
  { id: 'TRX-002', customerName: 'Siti Aminah', date: new Date(Date.now() - 86400000).toISOString(), serviceId: '4', serviceName: 'Bedcover Besar', weightOrQty: 1, totalPrice: 25000, status: 'completed' },
  { id: 'TRX-003', customerName: 'Pelanggan (Anda)', date: new Date().toISOString(), serviceId: '1', serviceName: 'Cuci Komplit', weightOrQty: 3.5, totalPrice: 24500, status: 'processing' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => (localStorage.getItem('laundry_role') as UserRole) || 'customer');
  const [isOnline, setIsOnline] = useState(hasDbConfig());

  const [services, setServicesState] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('laundry_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [gallery, setGalleryState] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('laundry_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [transactions, setTransactionsState] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('laundry_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // DB Sync Helper
  const syncData = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data: sData } = await supabase.from('services').select('*');
      if (sData && sData.length > 0) setServicesState(sData);

      const { data: tData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      if (tData && tData.length > 0) setTransactionsState(tData);

      const { data: gData } = await supabase.from('gallery').select('*');
      if (gData && gData.length > 0) setGalleryState(gData);
      
      setIsOnline(true);
    } catch (error) {
      console.error("Sync failed:", error);
      setIsOnline(false);
    }
  };

  // Initial Sync
  useEffect(() => {
    if (hasDbConfig()) {
      syncData();
    }
  }, []);

  // Persistence Effects (Local Mirror)
  useEffect(() => localStorage.setItem('laundry_role', role), [role]);
  useEffect(() => localStorage.setItem('laundry_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('laundry_gallery', JSON.stringify(gallery)), [gallery]);
  useEffect(() => localStorage.setItem('laundry_transactions', JSON.stringify(transactions)), [transactions]);

  const setRole = (r: UserRole) => setRoleState(r);

  const addService = async (service: ServiceItem) => {
    setServicesState(prev => [...prev, service]);
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('services').insert([service]);
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>) => {
    setServicesState(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('services').update(updates).eq('id', id);
  };

  const addTransaction = async (transaction: Transaction) => {
    setTransactionsState(prev => [transaction, ...prev]);
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('transactions').insert([transaction]);
  };
  
  const editTransaction = async (id: string, updates: Partial<Transaction>) => {
    setTransactionsState(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('transactions').update(updates).eq('id', id);
  };

  const removeTransaction = async (id: string) => {
    setTransactionsState(prev => prev.filter(t => t.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('transactions').delete().eq('id', id);
  };

  const updateTransactionStatus = async (id: string, status: Transaction['status']) => {
    setTransactionsState(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('transactions').update({ status }).eq('id', id);
  };

  const addPhoto = async (photo: GalleryItem) => {
    setGalleryState(prev => [photo, ...prev]);
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('gallery').insert([photo]);
  };

  const removePhoto = async (id: string) => {
    setGalleryState(prev => prev.filter(g => g.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) await supabase.from('gallery').delete().eq('id', id);
  };

  const resetData = () => {
    if (window.confirm('Reset data lokal? Jika terhubung DB, data DB tidak akan dihapus otomatis (aman).')) {
      setServicesState(initialServices);
      setGalleryState(initialGallery);
      setTransactionsState(initialTransactions);
      setRoleState('customer'); 
      localStorage.removeItem('laundry_services');
      localStorage.removeItem('laundry_gallery');
      localStorage.removeItem('laundry_transactions');
      // Do not clear DB config or Role to avoid frustration
      window.location.reload();
    }
  };

  return (
    <AppContext.Provider value={{
      role, setRole,
      services, addService, updateService,
      gallery, addPhoto, removePhoto,
      transactions, addTransaction, editTransaction, removeTransaction, updateTransactionStatus,
      resetData,
      isOnline,
      syncData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};