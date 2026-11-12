import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaShieldAlt,
  FaImages,
  FaBoxOpen,
  FaComments,
  FaTrash,
  FaPlus,
  FaWhatsapp,
  FaPhone,
  FaExternalLinkAlt,
  FaSearch,
  FaArrowLeft,
  FaEye,
  FaLock,
  FaSignOutAlt,
  FaSyncAlt,
  FaPalette,
  FaCheckCircle,
  FaClock,
  FaSpinner
} from 'react-icons/fa';
import orderApi from '../../services/orderApi';
import galleryService from '../../services/galleryService';
import './Admin.css';

const DEFAULT_PIN = '1234';

const Admin = () => {
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('harsath_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'orders' | 'gallery' | 'messages'
  const [activeTab, setActiveTab] = useState('orders');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  // Gallery State
  const [artworks, setArtworks] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState({ type: '', text: '' });
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    category: 'Pencil Sketch',
    image: '',
    description: '',
    price: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load Data on Auth
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();

      const handleOrderUpdate = () => loadOrders();
      const handleGalleryUpdate = () => loadGallery();

      window.addEventListener('harsath_orders_updated', handleOrderUpdate);
      window.addEventListener('harsath_gallery_updated', handleGalleryUpdate);

      return () => {
        window.removeEventListener('harsath_orders_updated', handleOrderUpdate);
        window.removeEventListener('harsath_gallery_updated', handleGalleryUpdate);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadAllData = () => {
    loadOrders();
    loadGallery();
    loadMessages();
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadGallery = async () => {
    setLoadingGallery(true);
    try {
      const data = await galleryService.getArtworks();
      setArtworks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGallery(false);
    }
  };

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await orderApi.getFeedbacks();
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Auth Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN || pinInput.trim() === 'admin' || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('harsath_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Incorrect PIN. Default PIN is 1234');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('harsath_admin_auth');
    navigate('/');
  };

  // Order Handlers
  const handleStatusChange = async (orderId, newStatus) => {
    await orderApi.updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await orderApi.deleteOrder(orderId);
      loadOrders();
    }
  };

  // Gallery Handlers
  const handleArtworkImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewArtwork((prev) => ({ ...prev, image: reader.result }));
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!newArtwork.image) {
      setGalleryMsg({ type: 'error', text: 'Please upload an image or provide an image URL.' });
      return;
    }

    try {
      await galleryService.addArtwork(newArtwork);
      setGalleryMsg({ type: 'success', text: 'New artwork added! Main page gallery updated.' });
      setNewArtwork({
        title: '',
        category: 'Pencil Sketch',
        image: '',
        description: '',
        price: ''
      });
      loadGallery();
      setTimeout(() => setGalleryMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setGalleryMsg({ type: 'error', text: 'Failed to add artwork.' });
    }
  };

  const handleDeleteArtwork = async (id, title) => {
    if (window.confirm(`Delete "${title || 'this artwork'}" from gallery? It will be removed from the main page immediately.`)) {
      await galleryService.deleteArtwork(id);
      loadGallery();
    }
  };

  const handleResetGallery = () => {
    if (window.confirm('Reset gallery to default 10 artworks?')) {
      galleryService.resetToDefault();
      loadGallery();
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      await orderApi.deleteFeedback(id);
      loadMessages();
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      orderFilter === 'ALL' ||
      (order.status || 'Pending').toLowerCase() === orderFilter.toLowerCase();

    const name = order.customerName || order.name || '';
    const phone = order.customerPhone || order.phone || '';
    const ordNum = order.orderNumber || '';
    const type = order.drawingType || '';

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      ordNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.price) || 0), 0);
  const pendingCount = orders.filter((o) => (o.status || 'Pending') === 'Pending').length;

  // ─── LOGIN SCREEN ───
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="lock-icon-wrapper">
            <FaShieldAlt className="lock-icon" />
          </div>
          <h2>Harsath Arts — Admin Portal</h2>
          <p className="lock-desc">Enter your Admin PIN to manage Customer Orders & Gallery</p>

          <form onSubmit={handleLogin} className="lock-form">
            <div className="pin-input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
              />
            </div>

            {authError && <div className="auth-error-badge">{authError}</div>}

            <button type="submit" className="admin-primary-btn">
              Unlock Dashboard
            </button>

            <button
              type="button"
              className="quick-unlock-btn"
              onClick={() => {
                setPinInput(DEFAULT_PIN);
                setIsAuthenticated(true);
                sessionStorage.setItem('harsath_admin_auth', 'true');
              }}
            >
              Quick Access (Default: 1234)
            </button>
          </form>

          <button onClick={() => navigate('/')} className="back-to-home-link">
            <FaArrowLeft /> Back to Website
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN ADMIN DASHBOARD ───
  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Bar */}
      <header className="admin-header">
        <div className="admin-header-left">
          <button onClick={() => navigate('/')} className="admin-nav-back-btn" title="View Main Site">
            <FaArrowLeft />
          </button>
          <div className="admin-brand-info">
            <h1>HARSATH ARTS <span>/ Admin</span></h1>
            <p className="admin-subtitle">Live Store & Gallery Management</p>
          </div>
        </div>

        <div className="admin-header-right">
          <button onClick={loadAllData} className="admin-refresh-btn" title="Refresh Data">
            <FaSyncAlt /> <span>Refresh</span>
          </button>
          <button onClick={() => navigate('/')} className="admin-site-btn">
            <FaExternalLinkAlt /> <span>View Site</span>
          </button>
          <button onClick={handleLogout} className="admin-logout-btn" title="Logout">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="admin-metrics-grid">
        <div className="metric-card metric-orders">
          <div className="metric-icon"><FaBoxOpen /></div>
          <div className="metric-details">
            <span className="metric-label">Total Orders</span>
            <h3 className="metric-value">{orders.length}</h3>
          </div>
        </div>

        <div className="metric-card metric-pending">
          <div className="metric-icon"><FaClock /></div>
          <div className="metric-details">
            <span className="metric-label">Pending Orders</span>
            <h3 className="metric-value">{pendingCount}</h3>
          </div>
        </div>

        <div className="metric-card metric-gallery">
          <div className="metric-icon"><FaImages /></div>
          <div className="metric-details">
            <span className="metric-label">Live Artworks</span>
            <h3 className="metric-value">{artworks.length}</h3>
          </div>
        </div>

        <div className="metric-card metric-revenue">
          <div className="metric-icon"><FaCheckCircle /></div>
          <div className="metric-details">
            <span className="metric-label">Total Revenue</span>
            <h3 className="metric-value">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <FaBoxOpen /> Customer Orders ({orders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <FaPalette /> Manage Gallery ({artworks.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <FaComments /> Inquiries ({messages.length})
        </button>
      </nav>

      {/* ─── TAB 1: CUSTOMER ORDERS ─── */}
      {activeTab === 'orders' && (
        <section className="admin-tab-content">
          <div className="orders-toolbar">
            <div className="orders-search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by customer name, phone, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="orders-filter-chips">
              {['ALL', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  className={`filter-chip ${orderFilter === status ? 'active' : ''}`}
                  onClick={() => setOrderFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loadingOrders ? (
            <div className="admin-loading-state">
              <FaSpinner className="spin-icon" /> Loading customer orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="admin-empty-state">
              <FaBoxOpen className="empty-icon" />
              <h3>No Orders Found</h3>
              <p>Customer orders placed on the website will instantly appear right here.</p>
            </div>
          ) : (
            <div className="orders-table-wrapper">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order Info</th>
                    <th>Customer Details</th>
                    <th>Artwork Spec</th>
                    <th>Reference Photo</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const id = order._id || order.id || order.orderNumber;
                    const name = order.customerName || order.name || 'Anonymous Customer';
                    const phone = order.customerPhone || order.phone || '';
                    const email = order.customerEmail || order.email || '';
                    const cleanPhone = phone.replace(/\D/g, '');
                    const status = order.status || 'Pending';
                    const orderDate = new Date(order.createdAt || order.orderDate || Date.now()).toLocaleDateString(
                      'en-IN',
                      { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                    );

                    const whatsappText = encodeURIComponent(
                      `Hello ${name}! This is Harsath Arts regarding your sketch order (${order.orderNumber || ''}) for ${order.drawingType || 'artwork'}. We are working on your sketch!`
                    );

                    return (
                      <tr key={id} className={`status-row-${status.toLowerCase().replace(' ', '-')}`}>
                        {/* Order Info */}
                        <td className="cell-order-id">
                          <span className="order-number-badge">{order.orderNumber || id.slice(-8)}</span>
                          <span className="order-date-text">{orderDate}</span>
                        </td>

                        {/* Customer */}
                        <td className="cell-customer">
                          <strong className="customer-name">{name}</strong>
                          <div className="customer-contact-links">
                            {phone && (
                              <a href={`tel:${phone}`} className="phone-link">
                                <FaPhone /> {phone}
                              </a>
                            )}
                            {email && <span className="email-text">{email}</span>}
                          </div>
                        </td>

                        {/* Artwork */}
                        <td className="cell-artwork">
                          <span className="art-type-tag">{order.drawingType || 'Pencil Sketch'}</span>
                          <span className="art-size-tag">Size: {order.size || 'A4'}</span>
                          {order.specialInstructions && (
                            <p className="special-notes" title={order.specialInstructions}>
                              "{order.specialInstructions}"
                            </p>
                          )}
                        </td>

                        {/* Reference Image */}
                        <td className="cell-reference">
                          {order.referenceImage ? (
                            <button
                              className="ref-thumb-btn"
                              onClick={() => setSelectedImageModal(order.referenceImage)}
                              title="Click to zoom image"
                            >
                              <img src={order.referenceImage} alt="Reference" />
                              <span className="zoom-hint"><FaEye /> Zoom</span>
                            </button>
                          ) : (
                            <span className="no-photo-badge">No Photo</span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="cell-price">
                          <strong>₹{(Number(order.totalAmount || order.price) || 999).toLocaleString('en-IN')}</strong>
                          <span className="payment-method-badge">{order.paymentMethod || 'Online'}</span>
                        </td>

                        {/* Status */}
                        <td className="cell-status">
                          <select
                            value={status}
                            onChange={(e) => handleStatusChange(id, e.target.value)}
                            className={`status-selector status-${status.toLowerCase().replace(' ', '-')}`}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="In Progress">🎨 In Progress</option>
                            <option value="Completed">✅ Completed</option>
                            <option value="Delivered">📦 Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="cell-actions">
                          <div className="action-buttons-group">
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/91${cleanPhone}?text=${whatsappText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn-whatsapp"
                                title="Contact customer on WhatsApp"
                              >
                                <FaWhatsapp /> Chat
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(id)}
                              className="action-btn-delete"
                              title="Delete Order"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ─── TAB 2: MANAGE GALLERY ─── */}
      {activeTab === 'gallery' && (
        <section className="admin-tab-content">
          <div className="gallery-admin-layout">
            {/* Left: Add Artwork Form */}
            <div className="admin-card add-artwork-card">
              <div className="card-header">
                <h3><FaPlus /> Add New Artwork</h3>
                <p>New artwork will appear on the main page gallery immediately.</p>
              </div>

              {galleryMsg.text && (
                <div className={`gallery-banner-alert ${galleryMsg.type}`}>
                  {galleryMsg.text}
                </div>
              )}

              <form onSubmit={handleAddArtwork} className="add-artwork-form">
                <div className="form-group">
                  <label>Artwork Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Realistic Charcoal Portrait"
                    value={newArtwork.title}
                    onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={newArtwork.category}
                      onChange={(e) => setNewArtwork({ ...newArtwork, category: e.target.value })}
                    >
                      <option value="Pencil Sketch">Pencil Sketch</option>
                      <option value="Color Pencil">Color Pencil</option>
                      <option value="Charcoal">Charcoal</option>
                      <option value="Portraits">Portraits</option>
                      <option value="Custom Art">Custom Art</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1499"
                      value={newArtwork.price}
                      onChange={(e) => setNewArtwork({ ...newArtwork, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Upload Artwork Photo *</label>
                  <div className="artwork-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      id="artwork-upload-input"
                      onChange={handleArtworkImageUpload}
                    />
                    <label htmlFor="artwork-upload-input" className="file-dropzone-label">
                      {uploadingImage ? (
                        <span><FaSpinner className="spin-icon" /> Reading image...</span>
                      ) : newArtwork.image ? (
                        <span><FaCheckCircle className="check-icon" /> Photo Selected (Click to change)</span>
                      ) : (
                        <span><FaImages /> Click to choose drawing image file</span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Or Paste Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/drawing.jpg"
                    value={newArtwork.image.startsWith('data:') ? '' : newArtwork.image}
                    onChange={(e) => setNewArtwork({ ...newArtwork, image: e.target.value })}
                  />
                </div>

                {newArtwork.image && (
                  <div className="artwork-preview-container">
                    <span className="preview-label">Live Preview:</span>
                    <img src={newArtwork.image} alt="Preview" className="artwork-preview-thumb" />
                  </div>
                )}

                <div className="form-group">
                  <label>Description / Story (optional)</label>
                  <textarea
                    rows="2"
                    placeholder="Short description of the artwork, paper type, or techniques used..."
                    value={newArtwork.description}
                    onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                  />
                </div>

                <button type="submit" className="admin-primary-btn add-btn">
                  <FaPlus /> Publish to Main Page Gallery
                </button>
              </form>
            </div>

            {/* Right: Existing Gallery Grid */}
            <div className="admin-card existing-gallery-card">
              <div className="card-header gallery-list-header">
                <div>
                  <h3>Current Live Artworks ({artworks.length})</h3>
                  <p>All items currently visible in the main page gallery.</p>
                </div>
                <button onClick={handleResetGallery} className="admin-outline-btn reset-btn" title="Reset default items">
                  Restore Defaults
                </button>
              </div>

              {loadingGallery ? (
                <div className="admin-loading-state">
                  <FaSpinner className="spin-icon" /> Loading artworks...
                </div>
              ) : artworks.length === 0 ? (
                <div className="admin-empty-state">
                  <FaImages className="empty-icon" />
                  <h3>No Artworks in Gallery</h3>
                  <p>Add your first artwork using the form on the left.</p>
                </div>
              ) : (
                <div className="admin-gallery-items-grid">
                  {artworks.map((art) => (
                    <div key={art.id} className="admin-art-item-card">
                      <div className="art-item-thumb-wrapper">
                        <img src={art.image} alt={art.title} className="art-item-thumb" />
                        <span className="art-category-pill">{art.category}</span>
                      </div>
                      <div className="art-item-info">
                        <h4 className="art-item-title">{art.title}</h4>
                        {art.price > 0 && <span className="art-item-price">₹{art.price}</span>}
                        <button
                          onClick={() => handleDeleteArtwork(art.id, art.title)}
                          className="art-delete-btn"
                          title="Remove from Main Page"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── TAB 3: CONTACT INQUIRIES ─── */}
      {activeTab === 'messages' && (
        <section className="admin-tab-content">
          <div className="messages-card admin-card">
            <div className="card-header">
              <h3><FaComments /> Customer Inquiries & Contact Messages</h3>
              <p>Messages received from the contact form on the home page.</p>
            </div>

            {loadingMessages ? (
              <div className="admin-loading-state">
                <FaSpinner className="spin-icon" /> Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="admin-empty-state">
                <FaComments className="empty-icon" />
                <h3>No Messages Yet</h3>
                <p>When customers send a message via the Contact Us form, they will appear here.</p>
              </div>
            ) : (
              <div className="messages-grid">
                {messages.map((msg) => {
                  const id = msg._id || msg.id;
                  const date = new Date(msg.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <div key={id} className="message-item-card">
                      <div className="msg-header">
                        <div>
                          <h4 className="msg-sender">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="msg-email">{msg.email}</a>
                        </div>
                        <span className="msg-date">{date}</span>
                      </div>
                      <p className="msg-body">"{msg.message}"</p>
                      <div className="msg-footer">
                        <a href={`mailto:${msg.email}?subject=Reply from Harsath Arts`} className="msg-reply-btn">
                          Reply via Email
                        </a>
                        <button onClick={() => handleDeleteMessage(id)} className="msg-delete-btn" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* High-Res Image Modal */}
      {selectedImageModal && (
        <div className="image-zoom-overlay" onClick={() => setSelectedImageModal(null)}>
          <div className="image-zoom-card" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImageModal} alt="Enlarged Reference" />
            <button className="close-zoom-btn" onClick={() => setSelectedImageModal(null)}>
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
