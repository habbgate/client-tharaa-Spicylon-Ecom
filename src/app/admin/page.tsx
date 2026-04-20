'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('products'); // 'products', 'orders', 'reviews', 'orderDetails'
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  const [deliverySettings, setDeliverySettings] = useState({ USD: 0, EUR: 0, LKR: 0 });

  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Spices',
    priceUSD: 0,
    priceEUR: 0,
    priceLKR: 0,
    stock: 0,
    images: ''
  });

  const [reviewsProduct, setReviewsProduct] = useState<any>(null);
  const [productReviews, setProductReviews] = useState([]);

  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts();
      fetchOrders();
      fetchUsers();
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings');
      const usd = data.find((s: any) => s.key === 'deliveryCost_USD');
      const eur = data.find((s: any) => s.key === 'deliveryCost_EUR');
      const lkr = data.find((s: any) => s.key === 'deliveryCost_LKR');
      setDeliverySettings({
        USD: usd?.value ? Number(usd.value) : 0,
        EUR: eur?.value ? Number(eur.value) : 0,
        LKR: lkr?.value ? Number(lkr.value) : 0,
      });
    } catch {
      toast.error('Failed to load settings');
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/settings', { key: 'deliveryCost_USD', value: deliverySettings.USD.toString() });
      await axios.put('/api/settings', { key: 'deliveryCost_EUR', value: deliverySettings.EUR.toString() });
      await axios.put('/api/settings', { key: 'deliveryCost_LKR', value: deliverySettings.LKR.toString() });
      toast.success('Settings updated');
    } catch {
      toast.error('Failed to update settings');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const toggleOrderStatus = async (id: string) => {
    try {
      await axios.put(`/api/orders/${id}/deliver`);
      toast.success('Order status updated');
      fetchOrders();
      setViewingOrder((prev: any) => prev?._id === id ? { ...prev, isDelivered: !prev.isDelivered } : prev);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const viewReviews = async (product: any) => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviewsProduct(product);
      setProductReviews(data);
      setTab('reviews');
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  };

  const openForm = (product: any = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        priceUSD: product.price?.USD || 0,
        priceEUR: product.price?.EUR || 0,
        priceLKR: product.price?.LKR || 0,
        stock: product.stock,
        images: product.images?.join(', ') || ''
      });
    } else {
      setFormData({
        name: '', description: '', category: 'Spices', 
        priceUSD: 0, priceEUR: 0, priceLKR: 0, stock: 0, images: ''
      });
    }
    setShowModal(true);
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: {
        USD: Number(formData.priceUSD),
        EUR: Number(formData.priceEUR),
        LKR: Number(formData.priceLKR),
      },
      stock: Number(formData.stock),
      images: formData.images.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload);
        toast.success('Product updated');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Product added');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save product');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center py-20 font-bold text-red-500">Access Denied</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter italic">Admin <span className="text-orange-600">Dashboard</span></h1>
        <div className="flex gap-4">
          <button             onClick={() => setTab('users')} 
            className={`px-6 py-3 font-bold rounded-xl transition-all ${tab === 'users' ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
          >
            Users
          </button>
          <button             onClick={() => setTab('products')} 
            className={`px-6 py-3 font-bold rounded-xl transition-all ${tab === 'products' ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setTab('orders')} 
            className={`px-6 py-3 font-bold rounded-xl transition-all ${tab === 'orders' ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
          >
            Orders
          </button>
          <button 
            onClick={() => setTab('settings')} 
            className={`px-6 py-3 font-bold rounded-xl transition-all ${tab === 'settings' ? 'bg-orange-500 text-white' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'}`}
          >
            Settings
          </button>
        </div>
      </div>

      {tab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">User ID</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Name/Email</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Role</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u: any) => (
                <tr key={u._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-6 font-medium text-stone-600">{u._id}</td>
                  <td className="px-8 py-6 font-bold text-stone-900">{u.name} <br/><span className="text-xs text-stone-500 font-normal">{u.email}</span></td>
                  <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span></td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={async () => {
                      if(confirm('Toggle role?')) {
                        try {
                          await axios.put(`/api/admin/users/${u._id}`, { role: u.role === 'admin' ? 'customer' : 'admin' });
                          toast.success('User updated');
                          fetchUsers();
                        } catch { toast.error('Failed'); }
                      }
                    }} className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-bold hover:bg-stone-100 transition-all mr-2">Toggle Role</button>
                    <button onClick={async () => {
                      if(confirm('Delete user?')) {
                        try {
                          await axios.delete(`/api/admin/users/${u._id}`);
                          toast.success('User deleted');
                          fetchUsers();
                        } catch { toast.error('Failed'); }
                      }
                    }} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-all">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-stone-200 flex justify-end">
            <button onClick={() => openForm()} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all">
              <HiOutlinePlus className="h-5 w-5" /> Add Product
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Product</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Prices (USD/EUR/LKR)</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Stock</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product: any) => (
                <tr key={product._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {product.images?.[0] && <img src={product.images[0]} className="w-12 h-12 rounded-lg object-cover" />}
                      <span className="font-bold text-stone-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium text-stone-600">
                    {product.price?.USD} / {product.price?.EUR} / {product.price?.LKR}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => viewReviews(product)} className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="View Reviews">
                        <HiOutlineEye className="h-5 w-5" />
                      </button>
                      <button onClick={() => openForm(product)} className="p-2 text-stone-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Edit Product">
                        <HiOutlinePencil className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteProduct(product._id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Product">
                        <HiOutlineTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl overflow-x-auto">
           <table className="w-full text-left min-w-[800px]">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Order ID</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Customer</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Shipping</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Total</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest">Status</th>
                <th className="px-8 py-5 font-black text-stone-400 uppercase text-xs tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-8 py-6 font-medium text-stone-600 text-sm">
                    {order._id}
                    <div className="text-xs text-stone-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-6 font-bold text-stone-900">
                    {order.userId?.name} <br/><span className="text-xs text-stone-500 font-normal">{order.userId?.email}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-stone-600 max-w-[200px] truncate">
                    {order.shippingAddress ? (
                      <>
                        <span className="font-bold">{order.shippingAddress.fullName}</span><br />
                        {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                        {order.shippingAddress.postalCode} {order.shippingAddress.country}<br />
                        {order.shippingAddress.phone}
                      </>
                    ) : 'No Address'}
                  </td>
                  <td className="px-8 py-6 font-bold text-stone-900">
                    {order.currency} {order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => { setViewingOrder(order); setTab('orderDetails'); }}
                      className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-bold hover:bg-stone-100 transition-all mr-2"
                    >
                      <HiOutlineEye className="inline-block mr-1 h-4 w-4 -mt-0.5" /> View
                    </button>
                    <button 
                      onClick={() => toggleOrderStatus(order._id)}
                      className="px-4 py-2 border border-stone-300 rounded-lg text-sm font-bold hover:bg-stone-100 transition-all"
                    >
                      {order.isDelivered ? 'Processing' : 'Delivered'}
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-10 text-center text-stone-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-8">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-black text-stone-900">Reviews for {reviewsProduct?.name}</h2>
             <button onClick={() => setTab('products')} className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg transition-all">Back to Products</button>
           </div>
           
           {productReviews.length === 0 ? (
             <p className="text-stone-500">No reviews found for this product.</p>
           ) : (
             <div className="space-y-4">
               {productReviews.map((review: any) => (
                 <div key={review._id} className="p-4 border border-stone-100 rounded-xl bg-stone-50">
                    <div className="flex justify-between">
                      <span className="font-bold text-stone-800">{review.userName}</span>
                      <span className="text-orange-500 font-black">★ {review.rating}/5</span>
                    </div>
                    <p className="text-stone-600 mt-2">{review.comment}</p>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-8">
          <h2 className="text-2xl font-black text-stone-900 mb-6">Store Settings</h2>
          <form onSubmit={saveSettings} className="space-y-6 max-w-lg">
            <h3 className="font-bold text-lg text-stone-800">Delivery Costs</h3>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">USD Cost</label>
              <input type="number" step="0.01" value={deliverySettings.USD} onChange={(e) => setDeliverySettings({...deliverySettings, USD: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">EUR Cost</label>
              <input type="number" step="0.01" value={deliverySettings.EUR} onChange={(e) => setDeliverySettings({...deliverySettings, EUR: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">LKR Cost</label>
              <input type="number" step="0.01" value={deliverySettings.LKR} onChange={(e) => setDeliverySettings({...deliverySettings, LKR: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all">Save Settings</button>
          </form>
        </div>
      )}

      {tab === 'orderDetails' && viewingOrder && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl p-8">
           <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b border-stone-100 pb-6 gap-4">
             <div>
               <h2 className="text-3xl font-black text-stone-900 tracking-tighter italic">Order #{viewingOrder._id}</h2>
               <p className="text-stone-500 mt-2 font-bold uppercase tracking-widest text-xs">Placed on {new Date(viewingOrder.createdAt).toLocaleString()}</p>
             </div>
             <div className="flex flex-wrap gap-3">
               <button 
                 onClick={() => toggleOrderStatus(viewingOrder._id)}
                 className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${viewingOrder.isDelivered ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
               >
                 {viewingOrder.isDelivered ? 'Mark Processing' : 'Mark Delivered'}
               </button>
               <button onClick={() => setTab('orders')} className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition-all shadow-sm">
                 Back to Orders
               </button>
             </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
             {/* Customer & Shipping */}
             <div className="space-y-6">
               <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-stone-200 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                 <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-stone-800 relative z-10 flex items-center gap-2">
                   <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                   Customer Details
                 </h3>
                 <div className="space-y-5 text-stone-600 relative z-10">
                   <div className="flex flex-col border-b border-stone-200 pb-3">
                     <span className="text-xs uppercase font-bold text-stone-400 tracking-widest mb-1">Name</span>
                     <span className="font-bold text-stone-900 text-lg">{viewingOrder.userId?.name || 'N/A'}</span>
                   </div>
                   <div className="flex flex-col border-b border-stone-200 pb-3">
                     <span className="text-xs uppercase font-bold text-stone-400 tracking-widest mb-1">Email</span>
                     <span className="font-bold text-stone-900 text-lg">{viewingOrder.userId?.email || 'N/A'}</span>
                   </div>
                   <div className="flex flex-col">
                     <span className="text-xs uppercase font-bold text-stone-400 tracking-widest mb-1">Phone</span>
                     <span className="font-bold text-stone-900 text-lg">{viewingOrder.shippingAddress?.phone || 'N/A'}</span>
                   </div>
                 </div>
               </div>

               <div className="bg-stone-50 rounded-2xl p-8 border border-stone-200 overflow-hidden relative">
                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mb-16 blur-2xl opacity-50"></div>
                 <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-stone-800 relative z-10 flex items-center gap-2">
                   <div className="w-2 h-6 bg-stone-900 rounded-full"></div>
                   Shipping Address
                 </h3>
                 <div className="space-y-2 text-stone-600 text-lg relative z-10">
                   <p className="font-bold text-stone-900 pb-2">{viewingOrder.shippingAddress?.fullName}</p>
                   <p>{viewingOrder.shippingAddress?.address}</p>
                   <p>{viewingOrder.shippingAddress?.city}, {viewingOrder.shippingAddress?.postalCode}</p>
                   <p>{viewingOrder.shippingAddress?.country}</p>
                 </div>
               </div>
             </div>

             {/* Order Summary */}
             <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 flex flex-col">
               <h3 className="text-xl font-black mb-6 uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-6 flex items-center gap-2">
                 <HiOutlineEye className="w-6 h-6 text-orange-500" />
                 Order Items
               </h3>
               
               <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                 {viewingOrder.orderItems.map((item: any, i: number) => (
                   <div key={i} className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100 hover:border-orange-200 transition-colors">
                     <div className="flex items-center gap-4">
                       <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                       <div>
                         <p className="font-bold text-stone-900">{item.name}</p>
                         <p className="text-stone-500 font-medium text-sm mt-1 bg-stone-200 inline-block px-2 py-0.5 rounded-md">Qty: {item.quantity}</p>
                       </div>
                     </div>
                     <span className="font-black text-stone-900 text-lg">{viewingOrder.currency} {(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
               </div>

               <div className="mt-8 pt-8 border-t border-stone-100 space-y-4">
                 <div className="flex justify-between text-stone-500 font-bold text-lg">
                   <span>Items Subtotal</span>
                   <span>{viewingOrder.currency} {viewingOrder.itemsPrice?.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-stone-500 font-bold text-lg">
                   <span>Shipping</span>
                   <span>{viewingOrder.currency} {viewingOrder.shippingPrice?.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-3xl font-black text-stone-900 mt-6 pt-6 border-t border-stone-200">
                   <span>Total</span>
                   <span>{viewingOrder.currency} {viewingOrder.totalPrice?.toFixed(2)}</span>
                 </div>
               </div>

               <div className="mt-8 bg-stone-900 p-6 rounded-2xl flex items-center justify-between shadow-lg">
                 <span className="font-bold text-stone-300 uppercase text-sm tracking-widest">Payment Status</span>
                 <span className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-inner ${viewingOrder.isPaid ? 'bg-green-500 text-stone-900' : 'bg-red-500 text-white'}`}>
                   {viewingOrder.isPaid ? 'PAID' : 'PENDING'}
                 </span>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <h2 className="text-3xl font-black mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" rows={3}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Stock Amount</label>
                  <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Price (USD)</label>
                  <input required type="number" step="0.01" value={formData.priceUSD} onChange={(e) => setFormData({...formData, priceUSD: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Price (EUR)</label>
                  <input required type="number" step="0.01" value={formData.priceEUR} onChange={(e) => setFormData({...formData, priceEUR: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Price (LKR)</label>
                  <input required type="number" step="0.01" value={formData.priceLKR} onChange={(e) => setFormData({...formData, priceLKR: Number(e.target.value)})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Images (Comma-separated URLs)</label>
                <input required type="text" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://domain.com/img1.png, https://domain.com/img2.png" />
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t border-stone-200 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
