import React, { useState, useEffect } from 'react';
import ProdukList from './components/ProdukList';
import ProdukForm from './components/ProdukForm';


const translations = {
  id: {
    title: 'Toko Serba Ada',
    subtitle: 'Satu Tempat, Sejuta Kebutuhan.',
    productList: 'Daftar Produk',
    updated: 'Diperbarui',
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    searchPlaceholder: 'Cari di Toko Serba Ada...'
  },
  en: {
    title: 'Toko Serba Ada',
    subtitle: 'One Place, A Million Needs.',
    productList: 'Product List',
    updated: 'Updated',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    searchPlaceholder: 'Search in Toko Serba Ada...'
  }
};

function App() {
  const [currentProduk, setCurrentProduk] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme and Language State
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('id');

  useEffect(() => {
    // Check system preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to HTML tag
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const t = translations[lang];

  useEffect(() => {
    // Sync browser tab title
    document.title = t.title;
  }, [lang, t.title]);

  const handleEdit = (produk) => {
    setCurrentProduk(produk);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setCurrentProduk(null);
    setRefreshKey(old => old + 1);
  };

  const handleCancel = () => {
    setCurrentProduk(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 shadow-lg text-white py-6 mb-10 transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-5 group">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden border-2 border-white/50">
                  <img src="/logo.svg" alt="Toko Serba Ada Logo" className="w-full h-full object-contain p-2" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-2">
                    {t.title}
                  </h1>
                  <p className="text-indigo-100 mt-1 text-lg opacity-90">{t.subtitle}</p>
                </div>
              </div>

              <div className="mt-6 max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>

                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-white/10 text-white placeholder-indigo-200 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 sm:text-sm transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 self-start">
              <button 
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-bold backdrop-blur-sm transition-all flex items-center gap-2"
              >
                {lang === 'id' ? (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" preserveAspectRatio="none" className="w-6 h-4 rounded-[2px] shadow-[0_0_2px_rgba(0,0,0,0.5)]">
                      <clipPath id="t"><path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z"/></clipPath>
                      <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
                      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
                      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                      <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
                    </svg>
                    EN
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-6 h-4 rounded-[2px] shadow-[0_0_2px_rgba(0,0,0,0.5)]">
                      <rect width="3" height="1" fill="#ff0000"/>
                      <rect y="1" width="3" height="1" fill="#fff"/>
                    </svg>
                    ID
                  </div>
                )}
              </button>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium backdrop-blur-sm transition-all"
              >
                {isDark ? '☀️ ' + t.lightMode : '🌙 ' + t.darkMode}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/3">
             <ProdukForm 
                currentProduk={currentProduk} 
                onSuccess={handleSuccess} 
                onCancel={handleCancel}
                lang={lang}
             />
          </div>
          <div className="w-full lg:w-2/3">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                 <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4 transition-colors duration-300">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.productList}</h2>
                     <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full">{t.updated}</span>
                 </div>
                 <ProdukList 
                    key={refreshKey} 
                    onEdit={handleEdit} 
                    lang={lang} 
                    searchQuery={searchQuery}
                 />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
