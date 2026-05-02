import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Swal from 'sweetalert2';

const translations = {
  id: {
    add: 'Tambah Produk',
    edit: 'Edit Produk',
    name: 'Nama Produk',
    price: 'Harga (Rp)',
    photo: 'Foto Produk',
    save: 'Simpan',
    cancel: 'Batal',
    loading: 'Memproses...',
    successTitle: 'Berhasil!',
    successAdd: 'Produk berhasil ditambahkan!',
    successEdit: 'Produk berhasil diperbarui!',
    errorTitle: 'Waduh!'
  },
  en: {
    add: 'Add Product',
    edit: 'Edit Product',
    name: 'Product Name',
    price: 'Price ($)',
    photo: 'Product Photo',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Processing...',
    successTitle: 'Success!',
    successAdd: 'Product added successfully!',
    successEdit: 'Product updated successfully!',
    errorTitle: 'Oops!'
  }
};

const ProdukForm = ({ currentProduk, onSuccess, onCancel, lang = 'id' }) => {
    const [nama, setNama] = useState('');
    const [harga, setHarga] = useState('');
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const t = translations[lang];

    useEffect(() => {
        if (currentProduk) {
            setNama(currentProduk.nama);
            setHarga(currentProduk.harga);
            setPreview(currentProduk.foto_url || `http://localhost:8080/uploads/produk/${currentProduk.foto}`);
        } else {
            resetForm();
        }
    }, [currentProduk]);

    const resetForm = () => {
        setNama('');
        setHarga('');
        setFoto(null);
        setPreview('');
        setErrorMsg('');
        if (document.getElementById('fileInput')) {
            document.getElementById('fileInput').value = '';
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('harga', harga);
        if (foto) {
            formData.append('foto', foto);
        }

        try {
            if (currentProduk) {
                await api.post(`/produk/update/${currentProduk.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({
                    title: t.successTitle,
                    text: t.successEdit,
                    icon: 'success',
                    confirmButtonColor: '#4f46e5'
                });
            } else {
                await api.post('/produk', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({
                    title: t.successTitle,
                    text: t.successAdd,
                    icon: 'success',
                    confirmButtonColor: '#4f46e5'
                });
            }
            resetForm();
            onSuccess();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.messages?.error || error.response?.data?.messages?.foto || 'Terjadi kesalahan pada server.';
            setErrorMsg(msg);
            Swal.fire({
                title: t.errorTitle,
                text: msg,
                icon: 'error',
                confirmButtonColor: '#4f46e5'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 transition-colors duration-300">
                {currentProduk ? t.edit : t.add}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">{t.name}</label>
                    <input 
                        type="text" 
                        value={nama} 
                        onChange={(e) => setNama(e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                        placeholder="Contoh: Laptop Gaming"
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">{t.price}</label>
                    <div className="relative">
                        <span className="absolute left-4 top-2 text-gray-500 dark:text-gray-400 font-medium">{lang === 'en' ? '$' : 'Rp'}</span>
                        <input 
                            type="number"
                            step="any" 
                            value={harga === '' ? '' : (lang === 'en' ? harga / 15000 : harga)} 
                            onChange={(e) => setHarga(e.target.value === '' ? '' : (lang === 'en' ? e.target.value * 15000 : e.target.value))} 
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-300"
                            placeholder="0"
                            required 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">{t.photo}</label>
                    
                    {preview && (
                        <div className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                            <img src={preview} alt="Preview" className="w-full h-48 object-contain" />
                        </div>
                    )}
                    
                    <input 
                        id="fileInput"
                        type="file" 
                        onChange={handleImageChange} 
                        className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900 dark:file:text-indigo-200 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800 transition-colors duration-300 cursor-pointer"
                        accept="image/png, image/jpeg, image/jpg"
                        required={!currentProduk} 
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Max 2MB (JPG/PNG)</p>
                </div>
                
                <div className="pt-4 flex gap-3">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`flex-1 py-2.5 rounded-lg text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isLoading ? t.loading : t.save}
                    </button>
                    {currentProduk && (
                        <button 
                            type="button" 
                            onClick={() => { resetForm(); onCancel(); }}
                            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                        >
                            {t.cancel}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProdukForm;
