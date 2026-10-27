import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Search,
  ShoppingBag, Sparkles, Star, X, Truck, ShieldCheck, Plus, Minus, Trash2,
  SlidersHorizontal, Check, Instagram, Facebook, ArrowUpRight, UserRound
} from 'lucide-react';
import './styles.css';

const products = [
  { id: 1, name: 'Sonder Wireless Headphones', category: 'Tech', price: 189, compare: 229, rating: 4.9, reviews: 128, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85', alt: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85', tag: 'Bestseller', colors: ['#202020', '#d2c4b1'] },
  { id: 2, name: 'Marlow Leather Tote', category: 'Bags', price: 148, compare: 175, rating: 4.8, reviews: 84, image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=85', alt: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85', tag: 'New', colors: ['#7b5136', '#1d2622'] },
  { id: 3, name: 'Form Knit Cardigan', category: 'Apparel', price: 96, compare: 120, rating: 4.7, reviews: 61, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85', alt: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=85', tag: 'New', colors: ['#c5b9a7', '#292b30'] },
  { id: 4, name: 'Axis Everyday Sneakers', category: 'Footwear', price: 124, compare: 150, rating: 4.9, reviews: 207, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85', alt: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=85', tag: 'Bestseller', colors: ['#e7e4dc', '#5e756b'] },
  { id: 5, name: 'Arc Ceramic Table Lamp', category: 'Home', price: 88, compare: 105, rating: 4.8, reviews: 42, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=85', alt: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=85', tag: 'New', colors: ['#e8dfd2', '#b26b4c'] },
  { id: 6, name: 'Solace Linen Overshirt', category: 'Apparel', price: 110, compare: 138, rating: 4.6, reviews: 39, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=85', alt: 'https://images.unsplash.com/photo-1529375133-7d7e6a14e8b3?w=800&q=85', tag: 'Limited', colors: ['#d3c7b5', '#637061'] },
  { id: 7, name: 'Mira Mini Crossbody', category: 'Bags', price: 76, compare: 95, rating: 4.8, reviews: 73, image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85', alt: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85', tag: 'Bestseller', colors: ['#af6f50', '#21251f'] },
  { id: 8, name: 'Halo Smart Desk Clock', category: 'Tech', price: 72, compare: 90, rating: 4.5, reviews: 28, image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&q=85', alt: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=85', tag: 'New', colors: ['#202322', '#b7a99a'] },
  { id: 9, name: 'Rove Portable Speaker', category: 'Tech', price: 84, compare: 105, rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=85', alt: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=85', tag: 'Bestseller' },
  { id: 10, name: 'Fold Mechanical Keyboard', category: 'Tech', price: 129, compare: 155, rating: 4.8, reviews: 31, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=85', alt: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=85', tag: 'New' },
  { id: 11, name: 'Lumen Wireless Charger', category: 'Tech', price: 54, compare: 68, rating: 4.6, reviews: 44, image: 'https://images.unsplash.com/photo-1618577608401-189f3c7e9c9b?w=800&q=85', alt: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=85', tag: 'New' },
  { id: 12, name: 'Aster Cotton Tee', category: 'Apparel', price: 48, compare: 60, rating: 4.7, reviews: 91, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=85', alt: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=85', tag: 'Everyday' },
  { id: 13, name: 'Noon Relaxed Trousers', category: 'Apparel', price: 89, compare: 110, rating: 4.6, reviews: 48, image: 'https://images.unsplash.com/photo-1506629905607-d9c297d6b7b8?w=800&q=85', alt: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=85', tag: 'New' },
  { id: 14, name: 'Vale Wool Beanie', category: 'Apparel', price: 34, compare: 42, rating: 4.5, reviews: 22, image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800&q=85', alt: 'https://images.unsplash.com/photo-1510598906293-2b9e66c5f9a5?w=800&q=85', tag: 'Winter' },
  { id: 15, name: 'Drift Leather Loafers', category: 'Footwear', price: 138, compare: 170, rating: 4.9, reviews: 67, image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=85', alt: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=85', tag: 'Bestseller' },
  { id: 16, name: 'Cove Canvas Trainers', category: 'Footwear', price: 98, compare: 120, rating: 4.7, reviews: 34, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=85', alt: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=800&q=85', tag: 'Everyday' },
  { id: 17, name: 'Sola Ribbed Slides', category: 'Footwear', price: 42, compare: 55, rating: 4.4, reviews: 19, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=85', alt: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=85', tag: 'New' },
  { id: 18, name: 'Moss Glass Tumbler Set', category: 'Home', price: 38, compare: 48, rating: 4.8, reviews: 53, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=85', alt: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&q=85', tag: 'New' },
  { id: 19, name: 'Serein Cotton Throw', category: 'Home', price: 74, compare: 92, rating: 4.9, reviews: 37, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=85', alt: 'https://images.unsplash.com/photo-1600369671236-e74521d4b8ad?w=800&q=85', tag: 'Bestseller' },
  { id: 20, name: 'Cedar Incense Holder', category: 'Home', price: 29, compare: 38, rating: 4.6, reviews: 26, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=85', alt: 'https://images.unsplash.com/photo-1608181831718-c9f6b3f5b0d7?w=800&q=85', tag: 'Everyday' },
  { id: 21, name: 'Tide Travel Pouch', category: 'Bags', price: 32, compare: 42, rating: 4.7, reviews: 45, image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=85', alt: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85', tag: 'Travel' },
  { id: 22, name: 'Atlas Weekender', category: 'Bags', price: 172, compare: 210, rating: 4.8, reviews: 29, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=85', alt: 'https://images.unsplash.com/photo-1553835973-dec43bfddbeb?w=800&q=85', tag: 'Limited' },
  { id: 23, name: 'Eden Tortoise Sunglasses', category: 'Bags', price: 68, compare: 85, rating: 4.6, reviews: 38, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=85', alt: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=85', tag: 'New' },
  { id: 24, name: 'Forma Travel Water Bottle', category: 'Home', price: 44, compare: 55, rating: 4.7, reviews: 76, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=85', alt: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=85', tag: 'Everyday' }
];

const categories = [
  { name: 'Tech essentials', count: '24 products', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=900&q=85' },
  { name: 'Apparel', count: '38 products', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85' },
  { name: 'Home objects', count: '19 products', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85' },
  { name: 'Bags & carry', count: '16 products', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85' }
];

function App() {
  const routerNavigate = useNavigate();
  const [view, setView] = useState('home');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Featured');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('nexora-cart') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('nexora-wishlist') || '[]'));
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('nexora-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('nexora-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer); }, [toast]);

  const notify = (message) => setToast(message);
  const addToCart = (product) => {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }];
    });
    setDrawer(true); notify('Added to your bag');
  };
  const updateQty = (id, delta) => setCart(items => items.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  const toggleWish = (product) => {
    const exists = wishlist.includes(product.id);
    setWishlist(items => exists ? items.filter(id => id !== product.id) : [...items, product.id]);
    notify(exists ? 'Removed from wishlist' : 'Saved to wishlist');
  };
  const filtered = useMemo(() => {
    let result = products.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    if (sort === 'Top rated') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, query, sort]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const navigate = (next, nextCategory = 'All') => {
    setMenu(false);
    if (next === 'home') return routerNavigate('/');
    if (next === 'wishlist') return routerNavigate('/wishlist');
    if (next === 'shop') return routerNavigate(nextCategory === 'All' ? '/shop' : `/category/${nextCategory.toLowerCase()}`);
    setView(next);
    setCategory(nextCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <div className="app">
    <PromoBar />
    <RoutedHeader />

    {view === 'home' && <Home navigate={navigate} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} />}
    {view === 'shop' && <Shop products={filtered} category={category} setCategory={setCategory} sort={sort} setSort={setSort} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} query={query} />}
    {view === 'wishlist' && <Wishlist items={products.filter(p => wishlist.includes(p.id))} navigate={navigate} addToCart={addToCart} toggleWish={toggleWish} />}

    <RoutedFooter />

    {drawer && <CartDrawer cart={cart} subtotal={subtotal} updateQty={updateQty} setCart={setCart} close={() => setDrawer(false)} navigate={navigate} />}
    {toast && <div className="toast"><Check size={17} /> {toast}</div>}
  </div>;
}

function Home({ navigate, addToCart, wishlist, toggleWish }) {
  return <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span /> THE EVERYDAY EDIT — 01</p><h1>Good design,<br /><em>made useful.</em></h1><p className="hero-text">Thoughtfully selected objects that make everyday living feel a little more considered.</p><div className="hero-actions"><button className="button dark" onClick={() => navigate('shop')}>Shop collection <ArrowUpRight size={16} /></button><button className="text-button" onClick={() => navigate('shop')}>Explore new arrivals <ArrowRight size={16} /></button></div></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1100&q=90" alt="Premium watch and headphones" /><div className="hero-sticker"><span>NEW</span><strong>ESSENTIALS<br />FOR NOW</strong></div><div className="hero-image-label">Object no. 004 <span>↗</span></div></div></section>
    <section className="intro strip"><span className="section-number">01 / 04</span><h2>Objects with intention.<br /><span>Made to be lived with.</span></h2><p>From the things you carry to the spaces you create, we believe the everyday deserves better. NEXORA brings together enduring pieces with a point of view.</p></section>
    <section className="categories section"><SectionHead eyebrow="SHOP BY CATEGORY" title="Find your everyday" link="View all" onClick={() => navigate('shop')} /><div className="category-grid">{categories.map((c, i) => <button className="category-card" key={c.name} onClick={() => navigate('shop', i === 0 ? 'Tech' : i === 1 ? 'Apparel' : i === 2 ? 'Home' : 'Bags')}><img src={c.image} alt={c.name} /><span className="category-shade" /><div><b>{c.name}</b><small>{c.count}</small></div><ArrowUpRight size={19} /></button>)}</div></section>
    <ProductSection title="The considered edit" eyebrow="FEATURED OBJECTS" products={products.slice(0, 4)} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} navigate={navigate} />
    <section className="editorial"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85" alt="Nexora store interior" /></div><div className="editorial-copy"><p className="eyebrow">THE NEXORA STANDARD</p><h2>Less, but<br /><em>better.</em></h2><p>We look for the considered detail, the honest material, and the quiet confidence that makes something worth keeping.</p><button className="text-button" onClick={() => navigate('shop')}>Our point of view <ArrowRight size={16} /></button></div></section>
    <ProductSection title="New, for now" eyebrow="JUST LANDED" products={products.slice(4)} addToCart={addToCart} wishlist={wishlist} toggleWish={toggleWish} navigate={navigate} />
    <section className="quote"><span>“</span><blockquote>Good things should feel<br /><em>good to use.</em></blockquote><small>— THE NEXORA EDIT</small></section>
  </main>;
}

function SectionHead({ eyebrow, title, link, onClick }) { return <div className="section-head"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{link && <button className="text-button" onClick={onClick}>{link} <ArrowRight size={16} /></button>}</div>; }
function ProductSection({ eyebrow, title, products, addToCart, wishlist, toggleWish, navigate }) { return <section className="section product-section"><SectionHead eyebrow={eyebrow} title={title} link="View all" onClick={() => navigate('shop')} /><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} wished={wishlist.includes(p.id)} toggleWish={toggleWish} />)}</div></section>; }
function ProductCard({ product, addToCart, wished, toggleWish }) { const [hover, setHover] = useState(false); return <article className="product-card" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}><div className="product-image"><img src={hover ? product.alt : product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><button className={`wish ${wished ? 'wished' : ''}`} onClick={() => toggleWish(product)}><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={() => addToCart(product)}>Quick add <Plus size={15} /></button></div><div className="product-meta"><div><p>{product.category}</p><h3>{product.name}</h3></div><div className="rating"><Star size={12} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div></div><div className="price"><strong>${product.price}</strong><del>${product.compare}</del><span>-{Math.round((1 - product.price / product.compare) * 100)}%</span></div></article>; }

function Shop({ products, category, setCategory, sort, setSort, addToCart, wishlist, toggleWish, query }) { return <main className="shop-page"><div className="shop-heading"><p className="eyebrow">THE COLLECTION</p><h1>Shop all objects<span>.</span></h1><p>Useful things, beautifully considered. Find your next everyday essential.</p></div><div className="shop-toolbar"><div className="category-tabs">{['All', 'Tech', 'Apparel', 'Footwear', 'Home', 'Bags'].map(c => <button className={category === c ? 'selected' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><div className="sort"><SlidersHorizontal size={16} /><span>{products.length} objects</span><select value={sort} onChange={e => setSort(e.target.value)}><option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Top rated</option></select><ChevronDown size={15} /></div></div>{query && <div className="search-result">Search results for <strong>“{query}”</strong></div>}<div className="shop-grid">{products.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} wished={wishlist.includes(p.id)} toggleWish={toggleWish} />)}</div>{products.length === 0 && <div className="empty"><Search size={30} /><h2>No objects found</h2><p>Try a different search or category.</p></div>}</main>; }
function Wishlist({ items, navigate, addToCart, toggleWish }) { return <main className="shop-page wishlist-page"><div className="shop-heading"><p className="eyebrow">SAVED FOR LATER</p><h1>Your wishlist<span>.</span></h1><p>Pieces you love, kept in one place.</p></div>{items.length ? <div className="shop-grid">{items.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} wished toggleWish={toggleWish} />)}</div> : <div className="empty"><Heart size={30} /><h2>Your wishlist is empty</h2><p>Save objects you love and find them here later.</p><button className="button dark" onClick={() => navigate('shop')}>Explore products <ArrowRight size={15} /></button></div>}</main>; }
function CartDrawer({ cart, subtotal, updateQty, setCart, close, navigate }) { return <div className="drawer-backdrop" onClick={close}><aside className="cart-drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR BAG</p><h2>{cart.length ? `${cart.reduce((s, i) => s + i.qty, 0)} objects` : 'Nothing here yet'}</h2></div><button className="close" onClick={close}><X size={20} /></button></div>{cart.length ? <><div className="drawer-items">{cart.map(item => <div className="drawer-item" key={item.id}><img src={item.image} alt={item.name} /><div className="drawer-item-copy"><p>{item.category}</p><h3>{item.name}</h3><strong>${item.price}</strong><div className="qty"><button onClick={() => updateQty(item.id, -1)}><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => updateQty(item.id, 1)}><Plus size={13} /></button><button className="remove" onClick={() => setCart(items => items.filter(i => i.id !== item.id))}><Trash2 size={14} /></button></div></div></div>)}</div><div className="drawer-footer"><div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="button dark full" onClick={() => { close(); navigate('shop'); }}>View bag <ArrowRight size={16} /></button><div className="drawer-perks"><span><Truck size={15} /> Free shipping over $100</span><span><ShieldCheck size={15} /> Secure checkout</span></div></div></> : <div className="empty drawer-empty"><ShoppingBag size={30} /><p>Your bag is waiting for something good.</p><button className="button dark" onClick={() => { close(); navigate('shop'); }}>Explore products</button></div>}</aside></div>; }

const readCart = () => JSON.parse(localStorage.getItem('nexora-cart') || '[]');
const saveCart = (items) => localStorage.setItem('nexora-cart', JSON.stringify(items));
const readOrders = () => JSON.parse(localStorage.getItem('nexora-orders') || '[]');

function RoutedHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(new URLSearchParams(location.search).get('q') || '');
  const [focused, setFocused] = useState(false);
  const cartCount = readCart().reduce((sum, item) => sum + item.qty, 0);
  const wishlist = JSON.parse(localStorage.getItem('nexora-wishlist') || '[]');
  const suggestions = query.trim() ? products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : [];
  const submitSearch = (event) => {
    if (event.key === 'Enter' && query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };
  return <header className="header"><button className="logo" onClick={() => navigate('/')}>NEXORA<span>.</span></button><nav className="nav routed-nav"><Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/shop?sort=newest">New arrivals</Link><Link to="/about">About</Link></nav><div className="header-actions"><div className="search-wrap"><label className="search"><Search size={18} /><input value={query} onFocus={() => setFocused(true)} onChange={event => setQuery(event.target.value)} onKeyDown={submitSearch} placeholder="Search products" /><kbd>⌘ K</kbd></label>{focused && query.trim() && <div className="search-suggestions">{suggestions.length ? suggestions.map(product => <button key={product.id} onMouseDown={() => navigate(`/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}><img src={product.image} alt="" /><span>{product.name}<small>${product.price}</small></span></button>) : <p>No matching objects found.</p>}<Link to={`/search?q=${encodeURIComponent(query)}`} onMouseDown={() => setFocused(false)}>View all results <ArrowRight size={13} /></Link></div>}</div><button className="icon-btn" aria-label="Account" onClick={() => navigate('/account')}><UserRound size={18} /></button><button className="icon-btn" aria-label="Wishlist" onClick={() => navigate('/wishlist')}><Heart size={19} /><i>{wishlist.length}</i></button><button className="icon-btn" aria-label="Cart" onClick={() => navigate('/cart')}><ShoppingBag size={19} /><i>{cartCount}</i></button></div></header>;
}

function RoutedFooter() {
  const [open, setOpen] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const submitNewsletter = (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNewsletterMessage(email ? 'Please enter a valid email address.' : 'Email address is required.');
      return;
    }
    localStorage.setItem('nexora-newsletter-email', email);
    setNewsletterMessage("You're on the list. Welcome to NEXORA.");
    setEmail('');
  };
  const groups = [
    { title: 'Shop', links: [['All products', '/shop'], ['New arrivals', '/shop?sort=newest'], ['Best sellers', '/shop?sort=rating'], ['Tech', '/category/tech'], ['Home', '/category/home'], ['Apparel', '/category/apparel'], ['Footwear', '/category/footwear'], ['Bags', '/category/bags']] },
    { title: 'Customer care', links: [['Contact', '/contact'], ['FAQ', '/faq'], ['Shipping', '/shipping'], ['Returns', '/returns'], ['Order tracking', '/account/orders']] },
    { title: 'Company', links: [['About NEXORA', '/about'], ['Journal', '/about']] },
    { title: 'Legal', links: [['Privacy policy', '/privacy'], ['Terms & conditions', '/terms'], ['Cookie policy', '/privacy']] }
  ];
  return <footer><div className="footer-brand"><div><Link className="logo footer-logo" to="/">NEXORA<span>.</span></Link><h2>Thoughtfully designed<br /><em>for modern living.</em></h2></div><p>We curate modern essentials that balance thoughtful design, everyday utility, and lasting quality.</p></div><div className="footer-grid">{groups.map(group => <div className={`footer-col ${open === group.title ? 'expanded' : ''}`} key={group.title}><button className="footer-group-toggle" onClick={() => setOpen(open === group.title ? '' : group.title)}><b>{group.title}</b><ChevronDown size={15} /></button><div className="footer-links">{group.links.map(([label, path]) => <Link to={path} key={label}>{label}</Link>)}</div></div>)}<div className="newsletter"><b>Stay in the know.</b><p>New arrivals, thoughtful notes, and 10% off your first order.</p><form className="email-input" onSubmit={submitNewsletter}><input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="Email address" aria-label="Email address" /><button aria-label="Subscribe"><ArrowRight size={18} /></button></form>{newsletterMessage && <small className={newsletterMessage.startsWith('You') ? 'newsletter-success' : 'newsletter-error'}>{newsletterMessage}</small>}</div></div><div className="footer-trust"><span><ShieldCheck size={16} /> Secure checkout</span><span><ArrowRight size={16} /> Easy returns</span><span><Truck size={16} /> Free shipping over $100</span></div><div className="footer-socials"><span>Follow the edit</span><span><Instagram size={17} /><Facebook size={17} /><span className="social-x">X</span><span className="social-p">P</span></span></div><div className="footer-bottom"><span className="footer-copyright">© 2026 NEXORA Studio</span><small className="footer-credit">Designed &amp; Developed by Masfiqul Islam Rasib</small><span className="footer-legal"><Link to="/privacy">Privacy</Link><span aria-hidden="true">·</span><Link to="/terms">Terms</Link></span></div></footer>;
}

function PromoBar() {
  const messages = ['Free shipping on orders over $100', 'New arrivals are here', '10% off your first order — welcome to NEXORA'];
  const [index, setIndex] = useState(0);
  useEffect(() => { const timer = setInterval(() => setIndex(current => (current + 1) % messages.length), 5000); return () => clearInterval(timer); }, []);
  return <div className="announcement"><span className="announcement-label">N / 2026 COLLECTION</span><span className="announcement-message" key={messages[index]}>{messages[index]}</span><Link to="/shop">Shop now <ArrowRight size={13} /></Link></div>;
}
function Shell({ children }) { return <><PromoBar /><RoutedHeader />{children}<RoutedFooter /></>; }

function ProductTile({ product }) {
  const navigate = useNavigate();
  const [wished, setWished] = useState(() => JSON.parse(localStorage.getItem('nexora-wishlist') || '[]').includes(product.id));
  const add = () => { const cart = readCart(); const found = cart.find(item => item.id === product.id); saveCart(found ? cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...cart, { ...product, qty: 1 }]); };
  const toggle = () => { const list = JSON.parse(localStorage.getItem('nexora-wishlist') || '[]'); const next = list.includes(product.id) ? list.filter(id => id !== product.id) : [...list, product.id]; localStorage.setItem('nexora-wishlist', JSON.stringify(next)); setWished(!wished); };
  return <article className="product-card"><div className="product-image" onClick={() => navigate(`/product/${product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}><img src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><button className={`wish ${wished ? 'wished' : ''}`} onClick={event => { event.stopPropagation(); toggle(); }}><Heart size={17} fill={wished ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={event => { event.stopPropagation(); add(); }}>Quick add <Plus size={15} /></button></div><div className="product-meta"><div><p>{product.category}</p><h3>{product.name}</h3></div><div className="rating"><Star size={12} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div></div><div className="price"><strong>${product.price}</strong><del>${product.compare}</del><span>-{Math.round((1 - product.price / product.compare) * 100)}%</span></div></article>;
}

function ListingPage({ forcedCategory }) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const selected = forcedCategory || params.get('category') || 'All';
  const sort = params.get('sort') || 'Featured';
  const categories = ['All', 'Tech', 'Apparel', 'Footwear', 'Home', 'Bags'];
  let items = products.filter(product => (selected === 'All' || product.category.toLowerCase() === selected.toLowerCase()) && `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()));
  if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
  if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
  const setFilter = (key, value) => { const next = new URLSearchParams(params); if (value === 'All' || !value) next.delete(key); else next.set(key, value); setParams(next); };
  return <Shell><main className="shop-page"><div className="shop-heading"><p className="eyebrow">THE COLLECTION</p><h1>{forcedCategory ? `${forcedCategory} objects` : query ? `Search results` : 'Shop all objects'}<span>.</span></h1><p>{query ? `Showing results for “${query}”.` : 'Useful things, beautifully considered. Find your next everyday essential.'}</p></div><div className="shop-toolbar"><div className="category-tabs">{categories.map(item => <button className={selected === item ? 'selected' : ''} onClick={() => setFilter('category', item)} key={item}>{item}</button>)}</div><div className="sort"><SlidersHorizontal size={16} /><span>{items.length} objects</span><select value={sort} onChange={event => setFilter('sort', event.target.value)}><option value="Featured">Featured</option><option value="newest">Newest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Highest Rated</option></select><ChevronDown size={15} /></div></div><div className="shop-grid">{items.map(product => <ProductTile key={product.id} product={product} />)}</div>{!items.length && <div className="empty"><Search size={30} /><h2>No objects found</h2><p>Try a different search or category.</p></div>}</main></Shell>;
}

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find(item => (item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')) === slug);
  const [image, setImage] = useState(product?.image);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState(product?.colors?.[0] || '#202020');
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('nexora-wishlist') || '[]').includes(product?.id));
  if (!product) return <NotFound />;
  const add = () => { const cart = readCart(); const key = `${product.id}-${color}`; const found = cart.find(item => item.key === key); saveCart(found ? cart.map(item => item.key === key ? { ...item, qty: item.qty + qty } : item) : [...cart, { ...product, key, qty, selectedColor: color }]); navigate('/cart'); };
  const toggleSaved = () => { const list = JSON.parse(localStorage.getItem('nexora-wishlist') || '[]'); const next = list.includes(product.id) ? list.filter(id => id !== product.id) : [...list, product.id]; localStorage.setItem('nexora-wishlist', JSON.stringify(next)); setSaved(!saved); };
  return <Shell><main className="detail-page"><div className="detail-gallery"><img className="detail-main-image" src={image} alt={product.name} /><div className="detail-thumbs"><button onClick={() => setImage(product.image)}><img src={product.image} alt="" /></button><button onClick={() => setImage(product.alt)}><img src={product.alt} alt="" /></button></div></div><div className="detail-copy"><p className="eyebrow">{product.category} / NEXORA EDIT</p><h1>{product.name}</h1><div className="detail-rating"><Star size={14} fill="currentColor" /> {product.rating} ({product.reviews} reviews)</div><div className="detail-price"><strong>${product.price}</strong><del>${product.compare}</del><span>Save {Math.round((1 - product.price / product.compare) * 100)}%</span></div><p className="detail-description">A considered everyday essential, made with honest materials and a quietly confident point of view. Designed to be used, loved, and kept.</p><div className="variant"><b>Color</b><div>{(product.colors || ['#202020', '#d2c4b1']).map(item => <button className={color === item ? 'color selected' : 'color'} style={{ background: item }} onClick={() => setColor(item)} key={item} />)}</div></div><div className="quantity-row"><div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={13} /></button><span>{qty}</span><button onClick={() => setQty(qty + 1)}><Plus size={13} /></button>  </div><button className="button dark" onClick={add}>Add to cart <ShoppingBag size={16} /></button><button className="button outline" onClick={toggleSaved}><Heart size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button></div><div className="detail-perks"><span><Truck size={17} /> Free shipping over $100</span><span><ShieldCheck size={17} /> 30-day returns</span></div><div className="detail-info"><details open><summary>Product details <Plus size={15} /></summary><p>Thoughtful proportions, durable construction, and the details that make everyday use feel better.</p></details><details><summary>Shipping & returns <Plus size={15} /></summary><p>Free standard delivery over $100. Return unused items within 30 days.</p></details></div></div></main><section className="section"><SectionHead eyebrow="YOU MAY ALSO LIKE" title="Related objects" /><div className="product-grid">{products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4).map(item => <ProductTile key={item.id} product={item} />)}</div></section></Shell>;
}

function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(readCart);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 100 || !subtotal ? 0 : 9;
  const tax = subtotal * .08;
  const total = subtotal - discount + shipping + tax;
  const update = (key, delta) => { const next = cart.map(item => (item.key || item.id) === key ? { ...item, qty: Math.max(1, item.qty + delta) } : item); setCart(next); saveCart(next); };
  const applyCoupon = () => { const rates = { WELCOME10: .1, SAVE20: .2, NEWUSER15: .15 }; const code = coupon.trim().toUpperCase(); const rate = rates[code]; if (!rate) { setDiscount(0); setCouponMessage('That coupon code is not valid.'); return; } if (discount > 0) { setCouponMessage('A coupon is already applied.'); return; } setDiscount(subtotal * rate); setCoupon(code); setCouponMessage(`${code} applied successfully.`); };
  return <Shell><main className="cart-page shop-page"><div className="shop-heading left"><p className="eyebrow">YOUR BAG</p><h1>Cart<span>.</span></h1></div>{cart.length ? <div className="cart-layout"><div>{cart.map(item => <div className="cart-line" key={item.key || item.id}><img src={item.image} alt={item.name} /><div><p>{item.category}</p><h3>{item.name}</h3>{item.selectedColor && <small>Color selected</small>}<div className="qty"><button onClick={() => update(item.id, -1)}><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => update(item.id, 1)}><Plus size={13} /></button><button className="remove" onClick={() => { const next = cart.filter(row => row.id !== item.id); setCart(next); saveCart(next); }}><Trash2 size={14} /></button></div></div><strong>${(item.price * item.qty).toFixed(2)}</strong></div>)}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div><div><span>Discount</span><b>-${discount.toFixed(2)}</b></div><div><span>Shipping</span><b>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</b></div><div><span>Tax</span><b>${tax.toFixed(2)}</b></div><hr /><div className="summary-total"><span>Total</span><b>${total.toFixed(2)}</b></div><div className="coupon"><input value={coupon} onChange={event => setCoupon(event.target.value)} placeholder="Coupon code" />  <button onClick={applyCoupon}>Apply</button></div>{couponMessage && <small className={couponMessage.includes('successfully') ? 'coupon-success' : 'coupon-error'}>{couponMessage}</small>}<button className="button dark full" onClick={() => navigate('/checkout')}>Proceed to checkout <ArrowRight size={16} /></button></aside></div> : <div className="empty"><ShoppingBag size={30} /><h2>Your bag is empty</h2><p>Find something good for your everyday.</p><button className="button dark" onClick={() => navigate('/shop')}>Explore products</button></div>}</main></Shell>;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', city: '', address: '', postal: '', delivery: 'Standard Delivery', payment: 'Cash on Delivery' });
  const cart = readCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = form.delivery === 'Express Delivery' ? 24 : (subtotal > 100 ? 0 : 9);
  const tax = subtotal * .08;
  const update = event => setForm({ ...form, [event.target.name]: event.target.value });
  const next = () => {
    if (step === 1 && (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !/^[+()\d\s-]{7,}$/.test(form.phone))) return setError('Enter your name, a valid email, and a valid phone number.');
    if (step === 2 && (!form.country.trim() || !form.city.trim() || form.address.trim().length < 8 || !form.postal.trim())) return setError('Complete every shipping field. Your address should be at least 8 characters.');
    setError('');
    setStep(Math.min(5, step + 1));
  };
  const place = () => { const id = `NX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.floor(10000 + Math.random() * 89999)}`; const order = { id, items: cart, customer: form, subtotal, shipping, tax, total: subtotal + shipping + tax, status: 'Processing', createdAt: new Date().toISOString() }; localStorage.setItem('nexora-orders', JSON.stringify([...readOrders(), order])); saveCart([]); navigate(`/order-success/${id}`); };
  if (!cart.length) return <Navigate to="/cart" replace />;
  return <Shell><main className="checkout-page"><div className="checkout-steps">{['Customer', 'Shipping', 'Delivery', 'Payment', 'Review'].map((label, index) => <span className={step >= index + 1 ? 'active' : ''} key={label}>{index + 1}. {label}</span>)}</div><div className="checkout-layout"><section className="checkout-form"><p className="eyebrow">SECURE DEMO CHECKOUT</p><h1>{['Your details', 'Shipping address', 'Delivery method', 'Payment method', 'Review order'][step - 1]}</h1>{step === 1 && <><input name="name" value={form.name} onChange={update} placeholder="Full name" /><input name="email" value={form.email} onChange={update} placeholder="Email address" type="email" /><input name="phone" value={form.phone} onChange={update} placeholder="Phone number" /></>}{step === 2 && <><input name="country" value={form.country} onChange={update} placeholder="Country" /><input name="city" value={form.city} onChange={update} placeholder="City" /><input name="address" value={form.address} onChange={update} placeholder="Street address" /><input name="postal" value={form.postal} onChange={update} placeholder="Postal code" /></>}{step === 3 && <div className="choice-list">{['Standard Delivery', 'Express Delivery'].map(item => <button className={form.delivery === item ? 'choice selected' : 'choice'} onClick={() => setForm({ ...form, delivery: item })} key={item}><span>{item}</span><b>{item === 'Standard Delivery' && subtotal > 100 ? 'Free' : item === 'Standard Delivery' ? '$9' : '$24'}</b></button>)}</div>}{step === 4 && <div className="choice-list">{['Credit / Debit Card', 'Cash on Delivery', 'Mobile Payment'].map(item => <button className={form.payment === item ? 'choice selected' : 'choice'} onClick={() => setForm({ ...form, payment: item })} key={item}><span>{item}</span><b>{item === 'Cash on Delivery' ? 'Recommended' : 'Demo'}</b></button>)}</div>}{step === 5 && <div className="review-box"><p>{form.name} · {form.email}</p><p>{form.address}, {form.city}, {form.country}</p><p>{form.delivery} · {form.payment}</p></div>}  {error && <p className="form-error" role="alert">{error}</p>}<button className="button dark" onClick={step === 5 ? place : next}>{step === 5 ? 'Place demo order' : 'Continue'} <ArrowRight size={16} /></button></section><aside className="summary"><h2>Your order</h2>{cart.map(item => <div className="mini-line" key={item.id}><span>{item.name} × {item.qty}</span><b>${(item.price * item.qty).toFixed(2)}</b></div>)}<hr /><div><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></div><div><span>Shipping</span><b>{shipping ? `$${shipping}` : 'Free'}</b></div><div><span>Tax</span><b>${tax.toFixed(2)}</b></div><div className="summary-total"><span>Total</span><b>${(subtotal + shipping + tax).toFixed(2)}</b></div></aside></div></main></Shell>;
}

function OrderPage({ success = false }) {
  const { orderId } = useParams();
  const order = readOrders().find(item => item.id === orderId) || readOrders()[0];
  if (!order) return <NotFound />;
  return <Shell><main className="success-page"><div className="success-icon"><Check size={30} /></div><p className="eyebrow">{success ? 'THANK YOU FOR YOUR PURCHASE' : 'ORDER DETAILS'}</p><h1>{success ? 'Order confirmed.' : `Order ${order.id}`}</h1><p className="hero-text">{success ? `Your order ${order.id} is being prepared with care.` : `Placed on ${new Date(order.createdAt).toLocaleDateString()}.`}</p><div className="order-card"><div className="timeline"><span className="active">Order placed</span><span className="active">Processing</span><span>Shipped</span><span>Delivered</span></div>{order.items.map(item => <div className="mini-line" key={item.id}><span>{item.name} × {item.qty}</span><b>${(item.price * item.qty).toFixed(2)}</b></div>)}<hr /><div className="summary-total"><span>Total</span><b>${order.total.toFixed(2)}</b></div><p>{order.customer.address}, {order.customer.city}, {order.customer.country}</p><p>Payment: {order.customer.payment}</p></div><div className="hero-actions"><Link className="button dark" to="/shop">Continue shopping <ArrowRight size={16} /></Link><Link className="text-button" to="/account/orders">View all orders</Link></div></main></Shell>;
}

function AccountPage() { const orders = readOrders(); return <Shell><main className="shop-page account-page"><div className="shop-heading left"><p className="eyebrow">YOUR SPACE</p><h1>Welcome back<span>.</span></h1><p>Everything you need, in one considered place.</p></div><div className="account-grid"><Link to="/account/orders"><b>Orders</b><span>{orders.length} orders to date</span><ArrowRight size={18} /></Link><Link to="/wishlist"><b>Wishlist</b><span>Saved objects</span><ArrowRight size={18} /></Link><Link to="/account/profile"><b>Profile</b><span>Personal information</span><ArrowRight size={18} /></Link><Link to="/account/addresses"><b>Addresses</b><span>Manage delivery details</span><ArrowRight size={18} /></Link></div></main></Shell>; }
function OrdersPage() { const orders = readOrders(); return <Shell><main className="shop-page"><div className="shop-heading left"><p className="eyebrow">YOUR HISTORY</p><h1>Orders<span>.</span></h1></div>{orders.length ? <div className="orders-list">{orders.map(order => <Link className="order-row" to={`/account/orders/${order.id}`} key={order.id}><div><b>{order.id}</b><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><div><span>{order.status}</span><strong>${order.total.toFixed(2)}</strong></div><ArrowRight size={18} /></Link>)}</div> : <div className="empty"><h2>No orders yet</h2><Link className="button dark" to="/shop">Start shopping</Link></div>}</main></Shell>; }
function SimplePage({ title, eyebrow = 'NEXORA' , children }) { return <Shell><main className="article-page"><p className="eyebrow">{eyebrow}</p><h1>{title}<span>.</span></h1>{children || <><p>We believe the everyday deserves better. NEXORA brings together enduring pieces with a point of view, designed to be used and kept.</p><h2>Thoughtful by default</h2><p>Every object is selected for its material, function, and ability to earn its place in your life. Questions? <Link to="/contact">We would love to hear from you.</Link></p></>}</main></Shell>; }
function FAQPage() { const questions = ['How long does shipping take?', 'What is your returns policy?', 'How do I track my order?', 'Do you ship internationally?', 'Are products sustainably sourced?']; return <SimplePage title="Frequently asked questions" eyebrow="HELP CENTER"><div className="faq-list">{questions.map(question => <details key={question}><summary>{question}<Plus size={17} /></summary><p>We will keep you updated every step of the way. Standard delivery takes 3–5 business days, and our support team is always happy to help with your order.</p></details>)}</div></SimplePage>; }
function ContactPage() { const [sent, setSent] = useState(false); return <SimplePage title="Let's talk" eyebrow="CONTACT"><p>Questions, ideas, or just want to say hello? Our small team is here.</p>{sent ? <div className="success-message"><Check size={20} /> Message sent successfully.</div> : <form className="contact-form" onSubmit={event => { event.preventDefault(); setSent(true); }}><input required placeholder="Your name" /><input required type="email" placeholder="Email address" /><input required placeholder="Subject" /><textarea required placeholder="How can we help?" rows="6" /><button className="button dark">Send message <ArrowRight size={16} /></button></form>}</SimplePage>; }
const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    sections: ['Introduction', 'Information We Collect', 'How We Use Information', 'Cookies & Similar Technologies', 'Analytics', 'Data Sharing', 'Data Security', 'Data Retention', 'Your Rights', "Children's Privacy", 'Third-Party Services', 'Changes to This Policy', 'Contact Us']
  },
  terms: {
    title: 'Terms & Conditions',
    sections: ['Introduction', 'About NEXORA', 'Using Our Website', 'Products & Availability', 'Pricing & Payments', 'Orders', 'Shipping', 'Returns & Refunds', 'Intellectual Property', 'User Responsibilities', 'Third-Party Services', 'Limitation of Liability', 'Changes to These Terms', 'Governing Terms', 'Contact']
  }
};
function LegalPage({ type }) {
  const content = legalContent[type];
  return <Shell><main className="legal-page"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>{content.title}</span></div><div className="legal-header"><p className="eyebrow">NEXORA / LEGAL</p><h1>{content.title}<span>.</span></h1><p>Last updated: October 27, 2026</p></div><div className="legal-layout"><nav className="legal-toc"><b>On this page</b>{content.sections.map((section, index) => <a href={`#legal-${index}`} key={section}>{index + 1}. {section}</a>)}</nav><article className="legal-content">{content.sections.map((section, index) => <section id={`legal-${index}`} key={section}><h2>{index + 1}. {section}</h2><p>{index === 0 ? 'This document explains how NEXORA handles information and the terms that apply when you use our website. We aim to be clear, practical, and respectful of your choices.' : `At NEXORA, we use information responsibly to provide a considered shopping experience, communicate clearly, and keep our services secure. We only collect what is reasonably needed for this purpose and retain it for as long as necessary.`}</p><p>By using our website, you agree to the practices described here. If you have a question about this section or your rights, please <Link to="/contact">contact our team</Link> and we will be glad to help.</p></section>)}</article></div></main></Shell>;
}
function NotFound() { return <Shell><main className="success-page"><p className="eyebrow">ERROR 404</p><h1>This page went missing<span>.</span></h1><p className="hero-text">The product or page you are looking for may have moved.</p><Link className="button dark" to="/">Back to home <ArrowRight size={16} /></Link></main></Shell>; }

function RoutedApp() {
  return <BrowserRouter><Routes><Route path="/" element={<App />} /><Route path="/shop" element={<ListingPage />} /><Route path="/category/:category" element={<CategoryRoute />} /><Route path="/search" element={<SearchRoute />} /><Route path="/product/:slug" element={<ProductPage />} /><Route path="/wishlist" element={<WishlistRoute />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<CheckoutPage />} /><Route path="/order-success/:orderId" element={<OrderPage success />} /><Route path="/account" element={<AccountPage />} /><Route path="/account/orders" element={<OrdersPage />} /><Route path="/account/orders/:orderId" element={<OrderPage />} /><Route path="/account/profile" element={<SimplePage title="Profile" />} /><Route path="/account/addresses" element={<SimplePage title="Saved addresses" />} /><Route path="/account/settings" element={<SimplePage title="Settings" />} /><Route path="/about" element={<SimplePage title="Less, but better." eyebrow="OUR POINT OF VIEW" />} /><Route path="/contact" element={<ContactPage />} /><Route path="/faq" element={<FAQPage />} /><Route path="/shipping" element={<SimplePage title="Shipping information" eyebrow="DELIVERY" />} /><Route path="/returns" element={<SimplePage title="Returns made simple" eyebrow="RETURNS" />} /><Route path="/privacy" element={<LegalPage type="privacy" />} /><Route path="/terms" element={<LegalPage type="terms" />} /><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
function CategoryRoute() { const { category } = useParams(); const match = { electronics: 'Tech', tech: 'Tech', apparel: 'Apparel', footwear: 'Footwear', home: 'Home', bags: 'Bags' }[category]; return match ? <ListingPage forcedCategory={match} /> : <NotFound />; }
function SearchRoute() { return <ListingPage />; }
function WishlistRoute() { const list = JSON.parse(localStorage.getItem('nexora-wishlist') || '[]'); return <Shell><main className="shop-page"><div className="shop-heading left"><p className="eyebrow">SAVED FOR LATER</p><h1>Your wishlist<span>.</span></h1></div>{list.length ? <div className="shop-grid">{products.filter(product => list.includes(product.id)).map(product => <ProductTile product={product} key={product.id} />)}</div> : <div className="empty"><Heart size={30} /><h2>Your wishlist is empty</h2><p>Save objects you love and find them here later.</p><Link className="button dark" to="/shop">Explore products</Link></div>}</main></Shell>; }

createRoot(document.getElementById('root')).render(<RoutedApp />);
