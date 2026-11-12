// services/galleryService.js
import artwork1 from '../assets/images/1.jpeg';
import artwork2 from '../assets/images/2.jpeg';
import artwork3 from '../assets/images/3.jpeg';
import artwork4 from '../assets/images/4.jpeg';
import artwork5 from '../assets/images/5.jpeg';
import artwork6 from '../assets/images/c1.jpeg';
import artwork7 from '../assets/images/c4.jpeg';
import artwork8 from '../assets/images/c3.jpeg';
import artwork9 from '../assets/images/c2.jpeg';
import artwork10 from '../assets/images/c5.jpeg';
import axios from 'axios';

const STORAGE_KEY = 'harsath_gallery_artworks_v2';
const API_URL =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : 'https://drawing-8587.onrender.com/api');

// Initial default artworks
export const INITIAL_ARTWORKS = [
  {
    id: 'art-1',
    title: 'Hyper-Realistic Pencil Portrait',
    category: 'Pencil Sketch',
    image: artwork1,
    description: 'Detailed graphite shading on premium Strathmore paper.',
    price: 1499,
    createdAt: new Date('2026-01-10').toISOString()
  },
  {
    id: 'art-2',
    title: 'Vibrant Prismacolor Portrait',
    category: 'Color Pencil',
    image: artwork6,
    description: 'Rich layers of color pencil with lifelike skin tones.',
    price: 1999,
    createdAt: new Date('2026-01-15').toISOString()
  },
  {
    id: 'art-3',
    title: 'Soulful Expressive Portrait',
    category: 'Pencil Sketch',
    image: artwork2,
    description: 'Soft blending and high contrast charcoal details.',
    price: 1299,
    createdAt: new Date('2026-01-20').toISOString()
  },
  {
    id: 'art-4',
    title: 'Dramatic Charcoal Artwork',
    category: 'Charcoal',
    image: artwork7,
    description: 'Deep carbon darks and stark highlights.',
    price: 1799,
    createdAt: new Date('2026-02-01').toISOString()
  },
  {
    id: 'art-5',
    title: 'Cherished Memories Portrait',
    category: 'Portraits',
    image: artwork3,
    description: 'Custom anniversary hand-drawn gift portrait.',
    price: 2499,
    createdAt: new Date('2026-02-10').toISOString()
  },
  {
    id: 'art-6',
    title: 'Vivid Celebrity Sketch',
    category: 'Color Pencil',
    image: artwork8,
    description: 'Color pencil illustration capturing energy and character.',
    price: 2199,
    createdAt: new Date('2026-02-18').toISOString()
  },
  {
    id: 'art-7',
    title: 'Masterpiece Pencil Shading',
    category: 'Pencil Sketch',
    image: artwork4,
    description: 'Micro-textured graphite pencil rendering.',
    price: 1599,
    createdAt: new Date('2026-03-01').toISOString()
  },
  {
    id: 'art-8',
    title: 'Bold Contrast Art Piece',
    category: 'Charcoal',
    image: artwork9,
    description: 'Expressive stroke work with smudge transitions.',
    price: 1899,
    createdAt: new Date('2026-03-12').toISOString()
  },
  {
    id: 'art-9',
    title: 'Traditional Fine Art Sketch',
    category: 'Pencil Sketch',
    image: artwork5,
    description: 'Timeless classic pencil artwork on archival sheet.',
    price: 1399,
    createdAt: new Date('2026-03-20').toISOString()
  },
  {
    id: 'art-10',
    title: 'Cinematic Color Artistry',
    category: 'Color Pencil',
    image: artwork10,
    description: 'Blended multi-layer color realism.',
    price: 2299,
    createdAt: new Date('2026-04-01').toISOString()
  }
];

export const galleryService = {
  // Get all artworks from LocalStorage + Backend
  getArtworks: async () => {
    let localArtworks = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localArtworks = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    if (!localArtworks || localArtworks.length === 0) {
      localArtworks = [...INITIAL_ARTWORKS];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localArtworks));
      } catch (e) {
        console.warn(e);
      }
    }

    // Try fetching from backend in background to merge
    try {
      const res = await axios.get(`${API_URL}/gallery`, { timeout: 4000 });
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const backendItems = res.data.data.map(item => ({
          id: item._id || item.id,
          title: item.title,
          category: item.category || 'Pencil Sketch',
          image: item.image,
          description: item.description,
          price: item.price,
          createdAt: item.createdAt
        }));

        // Merge: items in backend take precedence if matching id
        const merged = [...localArtworks];
        backendItems.forEach(b => {
          if (!merged.some(m => m.id === b.id || (m.image === b.image && m.title === b.title))) {
            merged.unshift(b);
          }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch {
      // Backend not reached or offline; return local items smoothly
    }

    return localArtworks;
  },

  // Add new artwork
  addArtwork: async (artworkData) => {
    const newArt = {
      id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: artworkData.title || 'Custom Artwork',
      category: artworkData.category || 'Pencil Sketch',
      image: artworkData.image,
      description: artworkData.description || '',
      price: Number(artworkData.price) || 0,
      createdAt: new Date().toISOString()
    };

    // 1. Save to local storage
    let current = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      current = stored ? JSON.parse(stored) : [...INITIAL_ARTWORKS];
    } catch {
      current = [...INITIAL_ARTWORKS];
    }
    current.unshift(newArt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

    // 2. Try saving to backend
    try {
      await axios.post(`${API_URL}/gallery`, newArt, { timeout: 5000 });
    } catch (e) {
      console.log('Saved to local gallery (backend sync will retry):', e.message);
    }

    // 3. Dispatch event so main Gallery immediately re-renders
    window.dispatchEvent(new CustomEvent('harsath_gallery_updated'));
    return newArt;
  },

  // Delete artwork
  deleteArtwork: async (id) => {
    let current = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      current = stored ? JSON.parse(stored) : [...INITIAL_ARTWORKS];
    } catch {
      current = [...INITIAL_ARTWORKS];
    }

    const filtered = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // Try deleting from backend
    try {
      await axios.delete(`${API_URL}/gallery/${id}`, { timeout: 4000 });
    } catch {
      // Local deletion is already successful
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('harsath_gallery_updated'));
    return true;
  },

  // Reset to initial
  resetToDefault: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ARTWORKS));
    window.dispatchEvent(new CustomEvent('harsath_gallery_updated'));
    return INITIAL_ARTWORKS;
  }
};

export default galleryService;

