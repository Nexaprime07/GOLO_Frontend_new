'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { adminGetAllAds, adminDeleteAd, adminUpdateAd } from '@/app/lib/api';
import { 
  Search, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Filter, 
  RefreshCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FileText
} from 'lucide-react';
import Image from 'next/image';

export default function AdminAdsManagement() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await adminGetAllAds();
      if (response.success) {
        setAds(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad? This action is irreversible.')) return;
    
    try {
      setIsDeleting(true);
      const res = await adminDeleteAd(adId);
      if (res.success) {
        setAds(ads.filter(ad => ad.adId !== adId));
        alert('Ad deleted successfully');
      }
    } catch (err) {
      alert('Failed to delete ad');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateAd = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      title: formData.get('title'),
      price: parseFloat(formData.get('price')),
      description: formData.get('description'),
    };

    try {
      setLoading(true);
      const res = await adminUpdateAd(selectedAd.adId, updateData);
      if (res.success) {
        setAds(ads.map(ad => ad.adId === selectedAd.adId ? { ...ad, ...updateData } : ad));
        setShowEditModal(false);
        alert('Ad updated successfully');
      }
    } catch (err) {
      alert('Failed to update ad');
    } finally {
      setLoading(false);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ad.adId.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(ads.map(ad => ad.category).filter(Boolean))];

  return (
    <>
      <Navbar />
      <div className="bg-[#F8F6F2] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/admin')} className="p-2 hover:bg-white rounded-xl transition-all">
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Ads Management</h1>
                <p className="text-gray-500 text-sm">Monitor and moderate all listings ({filteredAds.length})</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by ID or title..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-[#157A4F] outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#157A4F]"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
              <button 
                onClick={fetchAds}
                className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Ad Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User ID</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="6" className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      </tr>
                    ))
                  ) : filteredAds.length > 0 ? filteredAds.map((ad) => (
                    <tr key={ad._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {ad.images?.[0] && !ad.images[0].startsWith('file://') ? (
                              <Image 
                                src={ad.images[0]} 
                                alt={ad.title} 
                                fill 
                                className="object-cover" 
                                unoptimized={ad.images[0].includes('placeholder') || ad.images[0].includes('temp')}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                <FileText size={20} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 truncate max-w-[200px]">{ad.title}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{ad.adId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{ad.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800">₹{ad.price?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ad.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500 truncate block max-w-[100px]">{ad.userId}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/product/${ad.adId}`)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Publicly"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button 
                            onClick={() => { setSelectedAd(ad); setShowEditModal(true); }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Edit Content"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAd(ad.adId)}
                            disabled={isDeleting}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Permanently"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                        No ads found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedAd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[10000] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 text-[#157A4F] rounded-xl">
                  <Edit size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Edit Ad Content</h3>
                  <p className="text-sm text-gray-500">Modify listing details as administrator</p>
                </div>
              </div>
              
              <form onSubmit={handleUpdateAd} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                  <input 
                    name="title" 
                    defaultValue={selectedAd.title}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#157A4F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    name="price" 
                    type="number"
                    defaultValue={selectedAd.price}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#157A4F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    rows="4"
                    defaultValue={selectedAd.description}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#157A4F] outline-none resize-none"
                  ></textarea>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-2xl flex items-start gap-3 border border-orange-100">
                  <AlertTriangle className="text-orange-500 mt-0.5" size={18} />
                  <p className="text-[11px] text-orange-800 font-medium leading-relaxed">
                    Note: Updates are logged and the original owner may be notified of clerical changes. 
                    Ensure modifications maintain content integrity.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-3.5 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3.5 bg-[#157A4F] text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-green-900/20 active:scale-95 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
