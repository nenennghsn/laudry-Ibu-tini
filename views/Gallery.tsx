import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, X, ZoomIn } from 'lucide-react';

const Gallery: React.FC = () => {
  const { role, gallery, addPhoto, removePhoto } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleAddPhoto = () => {
    if (newUrl) {
      addPhoto({
        id: Date.now().toString(),
        url: newUrl,
        caption: newCaption || 'Foto Laundry'
      });
      setIsAdding(false);
      setNewUrl('');
      setNewCaption('');
    }
  };

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Galeri Laundry</h2>

      <div className="grid grid-cols-2 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-sm bg-white aspect-square">
            <img 
              src={item.url} 
              alt={item.caption} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
               <button 
                onClick={() => setSelectedPhoto(item.url)}
                className="bg-white p-2 rounded-full text-blue-600 shadow-lg"
               >
                 <ZoomIn size={18} />
               </button>
               {role === 'admin' && (
                 <button 
                  onClick={() => removePhoto(item.id)}
                  className="bg-white p-2 rounded-full text-red-600 shadow-lg"
                 >
                   <Trash2 size={18} />
                 </button>
               )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs truncate">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

       {/* Admin Add Button */}
       {role === 'admin' && !isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-blue-300 text-blue-500 p-4 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          <Plus size={20} /> Tambah Foto
        </button>
      )}

      {/* Add Modal/Form */}
      {isAdding && (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h3 className="font-bold text-lg mb-4">Tambah Foto Baru</h3>
              <input 
                type="text" 
                placeholder="URL Foto (https://...)" 
                className="w-full border p-2 rounded mb-3 text-sm"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Keterangan" 
                className="w-full border p-2 rounded mb-4 text-sm"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600">Batal</button>
                <button onClick={handleAddPhoto} className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
              </div>
            </div>
         </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[60] bg-black bg-opacity-90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2">
            <X size={32} />
          </button>
          <img 
            src={selectedPhoto} 
            alt="Zoom" 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" 
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;