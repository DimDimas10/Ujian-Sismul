import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

const translations = {
  id: {
    deleteConfirm: 'Yakin ingin menghapus produk ini?',
    deleteText: 'Data yang dihapus tidak bisa dikembalikan!',
    editBtn: 'Edit',
    deleteBtn: 'Hapus',
    empty: 'Belum ada produk tersedia.',
    emptyDesc: 'Silakan tambah produk baru melalui form di samping.',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
    deletedTitle: 'Terhapus!',
    deletedText: 'Produk berhasil dihapus.',
    noResults: 'Produk tidak ditemukan.',
    noResultsDesc: 'Coba kata kunci pencarian yang lain.'
  },
  en: {
    deleteConfirm: 'Are you sure?',
    deleteText: 'You won\'t be able to revert this!',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    empty: 'No products available yet.',
    emptyDesc: 'Please add a new product using the form aside.',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    deletedTitle: 'Deleted!',
    deletedText: 'Product has been deleted.',
    noResults: 'No products found.',
    noResultsDesc: 'Try another search keyword.'
  }
};

const ProdukList = ({ onEdit, lang = 'id', searchQuery = '' }) => {
    const [produk, setProduk] = useState([]);
    
    const t = translations[lang];

    const fetchProduk = async () => {
        try {
            const response = await api.get('/produk');
            setProduk(response.data);
        } catch (error) {
            console.error('Error fetching produk:', error);
        }
    };

    useEffect(() => {
        fetchProduk();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: t.deleteConfirm,
            text: t.deleteText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t.confirmButtonText,
            cancelButtonText: t.cancelButtonText
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/produk/${id}`);
                Swal.fire(
                    t.deletedTitle,
                    t.deletedText,
                    'success'
                );
                fetchProduk();
            } catch (error) {
                console.error('Error deleting produk:', error);
                Swal.fire(
                    'Error!',
                    'Gagal menghapus produk.',
                    'error'
                );
            }
        }
    };

    // Filter produk berdasarkan searchQuery
    const filteredProduk = produk.filter(item => 
        item.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProduk.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                        <img 
                            src={item.foto_url || `http://localhost:8080/uploads/produk/${item.foto}`} 
                            alt={item.nama} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }}
                        />
                    </div>
                    <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 truncate transition-colors duration-300" title={item.nama}>{item.nama}</h3>
                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 transition-colors duration-300">
                            {lang === 'en' 
                                ? `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.harga / 15000)}`
                                : `Rp ${new Intl.NumberFormat('id-ID').format(item.harga)}`
                            }
                        </p>
                        <div className="flex justify-between items-center mt-4">
                            <button 
                                onClick={() => onEdit(item)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium focus:ring-2 focus:ring-yellow-400 focus:outline-none shadow-sm"
                            >
                                {t.editBtn}
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm"
                            >
                                {t.deleteBtn}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Keadaan jika tidak ada produk sama sekali */}
            {produk.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{t.empty}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t.emptyDesc}</p>
                </div>
            )}

            {/* Keadaan jika produk ada tapi tidak cocok dengan pencarian */}
            {produk.length > 0 && filteredProduk.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors duration-300">
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{t.noResults}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t.noResultsDesc}</p>
                </div>
            )}
        </div>
    );
};

export default ProdukList;
