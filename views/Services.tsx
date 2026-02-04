import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Edit2, Save, X, Plus, Image as ImageIcon, Upload } from 'lucide-react';

const Services: React.FC = () => {
  const { role, services, updateService, addService } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: 0, unit: 'kg', description: '', image: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const handleStartEdit = (service: any) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateService(editingId, editForm);
      setEditingId(null);
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price > 0) {
      addService({
        id: Date.now().toString(),
        name: newService.name,
        price: Number(newService.price),
        unit: newService.unit as 'kg' | 'pcs',
        isActive: true,
        description: newService.description,
        image: newService.image
      });
      setIsAdding(false);
      setNewService({ name: '', price: 0, unit: 'kg', description: '', image: '' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit) {
          setEditForm((prev: any) => ({ ...prev, image: base64String }));
        } else {
          setNewService((prev: any) => ({ ...prev, image: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Layanan & Harga</h2>

      {/* List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className={`bg-white p-3 rounded-xl shadow-sm border ${service.isActive ? 'border-gray-100' : 'border-red-100 opacity-70'}`}>
            {editingId === service.id ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border p-2 rounded text-sm font-semibold"
                  placeholder="Nama Layanan"
                />
                <input 
                  type="text" 
                  value={editForm.description} 
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Deskripsi singkat"
                />
                
                {/* Image Edit Section */}
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    {editForm.image && (
                      <img src={editForm.image} alt="Preview" className="w-12 h-12 object-cover rounded border" />
                    )}
                    <input 
                      type="text" 
                      value={editForm.image || ''} 
                      onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                      className="flex-1 border p-2 rounded text-sm"
                      placeholder="URL Gambar"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">atau upload:</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-gray-100 px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-200"
                    >
                      <Upload size={12} /> Pilih File
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={editForm.price} 
                    onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                    className="w-1/2 border p-2 rounded text-sm"
                    placeholder="Harga"
                  />
                  <select 
                    value={editForm.unit}
                    onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                    className="w-1/2 border p-2 rounded text-sm"
                  >
                    <option value="kg">per Kg</option>
                    <option value="pcs">per Pcs</option>
                    <option value="meter">per Meter</option>
                  </select>
                </div>
                 <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                        id={`active-${service.id}`}
                    />
                    <label htmlFor={`active-${service.id}`} className="text-sm">Aktif</label>
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button onClick={() => setEditingId(null)} className="p-2 text-gray-500"><X size={18}/></button>
                  <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded text-sm"><Save size={18}/></button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {/* Image Section */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-gray-100">
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-300" size={24} />
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 text-base leading-tight mb-1">{service.name}</h3>
                    {role === 'admin' && (
                      <button onClick={() => handleStartEdit(service)} className="text-gray-400 hover:text-blue-600 -mt-1 -mr-1 p-1">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">{service.description || 'Tidak ada deskripsi'}</p>
                  
                  <div className="flex justify-between items-end">
                    <p className="text-blue-600 font-bold text-sm">
                      {formatPrice(service.price)} <span className="text-gray-400 font-normal text-xs">/ {service.unit}</span>
                    </p>
                    {!service.isActive && <span className="text-[10px] text-red-500 font-semibold bg-red-50 px-1.5 py-0.5 rounded">Nonaktif</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Admin Add Button */}
      {role === 'admin' && !isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-blue-300 text-blue-500 p-4 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          <Plus size={20} /> Tambah Layanan
        </button>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
           <h3 className="font-semibold mb-3">Tambah Layanan Baru</h3>
           <div className="space-y-3">
              <input 
                  type="text" 
                  value={newService.name} 
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Nama Layanan (e.g. Cuci Boneka)"
                />
                <input 
                  type="text" 
                  value={newService.description} 
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Deskripsi singkat"
                />
                
                {/* Image Add Section */}
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    {newService.image && (
                      <img src={newService.image} alt="Preview" className="w-12 h-12 object-cover rounded border" />
                    )}
                    <input 
                      type="text" 
                      value={newService.image || ''} 
                      onChange={(e) => setNewService({...newService, image: e.target.value})}
                      className="flex-1 border p-2 rounded text-sm"
                      placeholder="URL Gambar"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">atau upload:</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={addFileInputRef}
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                    <button 
                      onClick={() => addFileInputRef.current?.click()}
                      className="text-xs bg-gray-100 px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-200"
                    >
                      <Upload size={12} /> Pilih File
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={newService.price || ''} 
                    onChange={(e) => setNewService({...newService, price: Number(e.target.value)})}
                    className="w-1/2 border p-2 rounded text-sm"
                    placeholder="Harga"
                  />
                  <select 
                    value={newService.unit}
                    onChange={(e) => setNewService({...newService, unit: e.target.value})}
                    className="w-1/2 border p-2 rounded text-sm"
                  >
                    <option value="kg">per Kg</option>
                    <option value="pcs">per Pcs</option>
                    <option value="meter">per Meter</option>
                  </select>
                </div>
                 <div className="flex gap-2 justify-end mt-4">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 text-sm">Batal</button>
                  <button onClick={handleAddService} className="px-4 py-2 bg-blue-600 text-white rounded text-sm shadow-sm">Simpan</button>
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Services;