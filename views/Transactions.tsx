import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, TransactionStatus } from '../types';
import { CheckCircle, Clock, Package, ShoppingBag, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const Transactions: React.FC = () => {
  const { role, transactions, services, addTransaction, editTransaction, removeTransaction, updateTransactionStatus } = useApp();
  const [isAdding, setIsAdding] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [selectedService, setSelectedService] = useState(services[0]?.id || '');
  const [qty, setQty] = useState('');

  const myTransactions = role === 'admin' 
    ? transactions 
    : transactions.filter(t => t.customerName === 'Pelanggan (Anda)' || t.customerName === 'Budi Santoso'); // Mock filtering

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'picked_up': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusLabel = (status: TransactionStatus) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'processing': return 'Diproses';
      case 'completed': return 'Selesai';
      case 'picked_up': return 'Diambil';
      default: return status;
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setCustomerName('');
    setQty('');
    setSelectedService(services[0]?.id || '');
  };

  const handleStartEdit = (trx: Transaction) => {
    setIsAdding(true);
    setEditingId(trx.id);
    setCustomerName(trx.customerName);
    setSelectedService(trx.serviceId);
    setQty(trx.weightOrQty.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini permanen?')) {
      removeTransaction(id);
    }
  };

  const handleSaveTransaction = () => {
    const service = services.find(s => s.id === selectedService);
    if (service && customerName && qty) {
      const quantity = parseFloat(qty);
      const totalPrice = quantity * service.price;

      if (editingId) {
        // Update existing
        editTransaction(editingId, {
          customerName,
          serviceId: service.id,
          serviceName: service.name,
          weightOrQty: quantity,
          totalPrice: totalPrice,
        });
      } else {
        // Add new
        addTransaction({
          id: `TRX-${Date.now()}`,
          customerName,
          date: new Date().toISOString(),
          serviceId: service.id,
          serviceName: service.name,
          weightOrQty: quantity,
          totalPrice: totalPrice,
          status: 'pending'
        });
      }
      resetForm();
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {role === 'admin' ? 'Semua Transaksi' : 'Transaksi Saya'}
        </h2>
        {role === 'admin' && (
          <button 
            onClick={() => {
              if (isAdding && !editingId) {
                setIsAdding(false);
              } else {
                resetForm();
                setIsAdding(true);
              }
            }}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} className={isAdding && !editingId ? "rotate-45 transition-transform" : "transition-transform"} />
          </button>
        )}
      </div>

      {isAdding && role === 'admin' && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-blue-200 animate-in fade-in slide-in-from-top-4">
           <div className="flex justify-between items-center mb-3">
             <h3 className="font-semibold text-gray-800">
               {editingId ? 'Edit Pesanan' : 'Input Order Baru'}
             </h3>
             {editingId && (
               <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Sedang Mengedit</span>
             )}
           </div>
           
           <div className="space-y-3">
             <input 
                className="w-full border p-2 rounded text-sm" 
                placeholder="Nama Pelanggan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
             <select 
                className="w-full border p-2 rounded text-sm"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
             >
                {services.filter(s => s.isActive || s.id === selectedService).map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {formatPrice(s.price)}/{s.unit}</option>
                ))}
             </select>
             <input 
                type="number" 
                className="w-full border p-2 rounded text-sm" 
                placeholder="Berat (Kg) / Jumlah (Pcs)"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <button onClick={resetForm} className="flex-1 py-2 text-gray-500 bg-gray-100 rounded text-sm flex items-center justify-center gap-2">
                  <X size={16} /> Batal
                </button>
                <button onClick={handleSaveTransaction} className="flex-1 py-2 text-white bg-blue-600 rounded text-sm shadow flex items-center justify-center gap-2">
                  <Save size={16} /> {editingId ? 'Update' : 'Simpan'}
                </button>
              </div>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {myTransactions.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
            <p>Belum ada transaksi</p>
          </div>
        ) : (
          myTransactions.map((trx) => (
            <div key={trx.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group">
              
              <div className="flex justify-between items-start mb-2">
                <div>
                   <p className="text-xs text-gray-500">{new Date(trx.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                   <h3 className="font-bold text-gray-800">{trx.serviceName}</h3>
                   <p className="text-sm text-gray-600">{trx.customerName}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(trx.status)}`}>
                    {getStatusLabel(trx.status)}
                  </div>
                  {/* Admin Edit/Delete Actions */}
                  {role === 'admin' && (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleStartEdit(trx)}
                        className="p-1.5 bg-gray-50 text-blue-600 rounded-lg hover:bg-blue-50 transition border border-gray-200"
                        title="Edit Data"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(trx.id)}
                        className="p-1.5 bg-gray-50 text-red-600 rounded-lg hover:bg-red-50 transition border border-gray-200"
                        title="Hapus Data"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-200 my-2 pt-2 flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Package size={14} />
                  <span>{trx.weightOrQty} item/kg</span>
                </div>
                <p className="font-bold text-blue-600">{formatPrice(trx.totalPrice)}</p>
              </div>

              {role === 'admin' && trx.status !== 'picked_up' && (
                <div className="mt-3 flex gap-2">
                  {trx.status === 'pending' && (
                    <button onClick={() => updateTransactionStatus(trx.id, 'processing')} className="flex-1 bg-blue-50 text-blue-600 py-1.5 rounded text-xs font-semibold hover:bg-blue-100">Proses</button>
                  )}
                  {trx.status === 'processing' && (
                    <button onClick={() => updateTransactionStatus(trx.id, 'completed')} className="flex-1 bg-green-50 text-green-600 py-1.5 rounded text-xs font-semibold hover:bg-green-100">Selesai</button>
                  )}
                  {trx.status === 'completed' && (
                    <button onClick={() => updateTransactionStatus(trx.id, 'picked_up')} className="flex-1 bg-gray-100 text-gray-600 py-1.5 rounded text-xs font-semibold hover:bg-gray-200">Diambil</button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;