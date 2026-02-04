import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileDown, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const AdminReports: React.FC = () => {
  const { transactions } = useApp();

  // Calculate totals from real data
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const totalOrders = transactions.length;

  // Process data for the last 7 days dynamically
  const processChartData = () => {
    const daysIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const today = new Date();
    const chartData = [];

    // Loop backwards for 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0); // Normalize time
      
      // Filter transactions for this specific day
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === d.getDate() && 
               tDate.getMonth() === d.getMonth() && 
               tDate.getFullYear() === d.getFullYear();
      });

      const dayTotal = dayTransactions.reduce((sum, t) => sum + t.totalPrice, 0);
      
      chartData.push({
        name: daysIndo[d.getDay()],
        fullDate: d.toLocaleDateString('id-ID'),
        amount: dayTotal
      });
    }
    return chartData;
  };

  const data = processChartData();

  const handleExport = (type: 'pdf' | 'excel') => {
    alert(`Laporan ${type.toUpperCase()} berhasil diunduh! (Data tersimpan di LocalStorage)`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Laporan & Statistik</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-1 text-gray-500">
            <DollarSign size={16} />
            <span className="text-xs font-medium">Pendapatan</span>
          </div>
          <p className="text-lg font-bold text-blue-600 truncate">{formatPrice(totalRevenue)}</p>
        </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
          <div className="flex items-center gap-2 mb-1 text-gray-500">
             <TrendingUp size={16} />
            <span className="text-xs font-medium">Total Order</span>
          </div>
          <p className="text-lg font-bold text-green-600">{totalOrders} Transaksi</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar size={16} /> Pendapatan 7 Hari Terakhir
        </h3>
        <div className="h-48 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [formatPrice(value), 'Pendapatan']}
                labelFormatter={(label) => `Hari ${label}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Export Laporan</h3>
        <button 
          onClick={() => handleExport('pdf')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 active:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
             <div className="bg-red-100 text-red-600 p-2 rounded-lg">
               <FileDown size={20} />
             </div>
             <div className="text-left">
               <p className="font-medium text-gray-800">Laporan PDF</p>
               <p className="text-xs text-gray-500">Rekapitulasi keuangan siap cetak</p>
             </div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Download</span>
        </button>

         <button 
          onClick={() => handleExport('excel')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 active:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
             <div className="bg-green-100 text-green-600 p-2 rounded-lg">
               <FileDown size={20} />
             </div>
             <div className="text-left">
               <p className="font-medium text-gray-800">Laporan Excel</p>
               <p className="text-xs text-gray-500">Data mentah untuk audit</p>
             </div>
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Download</span>
        </button>
      </div>
    </div>
  );
};

export default AdminReports;