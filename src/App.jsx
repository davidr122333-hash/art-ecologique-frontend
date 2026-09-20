import React, { useEffect, useState, useMemo } from "react";
import {
  ShoppingCart, Search, Heart, User, Package, TrendingUp, DollarSign,
  Users, Store, AlertTriangle, CheckCircle2, Clock, Star, X, Plus, Minus,
  Trash2, ChevronDown, LayoutDashboard, BarChart3, Wallet, Leaf, TreePine,
  ArrowUpRight, ArrowDownRight, ShieldCheck, Ban, Play, PackageCheck,
  SlidersHorizontal, ChevronLeft, ChevronRight, MapPin, Mail, Camera
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

/* ---------------------------------- THEME ---------------------------------- */
const COLOR = {
  cream: "#F6F1E4",
  creamDeep: "#EFE7D3",
  ink: "#20241D",
  forest: "#243B22",
  forestDeep: "#182813",
  sage: "#7C9A6E",
  sageLight: "#A9C199",
  gold: "#C6A15B",
  goldDeep: "#A5813E",
  bark: "#5B4530",
  rust: "#B25A3B",
  line: "#DCD2B4",
};

const fmtN = (n) =>
  "₦" + Math.round(n).toLocaleString("en-NG");

const API_BASE = "https://art-ecologique-backend-production.up.railway.app";

const COMMISSION_RATE = 0.05;
const splitSale = (gross) => {
  const commission = Math.round(gross * COMMISSION_RATE);
  return { gross, commission, net: gross - commission };
};

/* ---------------------------------- SEED DATA ---------------------------------- */
const CATEGORIES = ["Sculpture", "Jewelry", "Furniture", "Wall Art", "Textile", "Home Decor"];

const STORES = [
  { id: "s1", name: "Lagos Loom Studio", owner: "Amaka Nwosu", city: "Lagos", rating: 4.9, joined: "2024", status: "active", bio: "Handwoven textile art from reclaimed fabric scraps and offcuts." },
  { id: "s2", name: "Kaduna Scrap Iron Works", owner: "Ibrahim Musa", city: "Kaduna", rating: 4.7, joined: "2023", status: "active", bio: "Welded sculpture from decommissioned machinery and scrap metal." },
  { id: "s3", name: "Ocean Reborn Abuja", owner: "Tari Preboye", city: "Abuja", rating: 4.8, joined: "2024", status: "active", bio: "Jewelry and decor cast from reclaimed ocean and river plastic." },
  { id: "s4", name: "Bronze & Bottle", owner: "Chidinma Eze", city: "Enugu", rating: 4.6, joined: "2025", status: "pending", bio: "Glassware and lighting fixtures from repurposed bottles." },
];

const seedProducts = () => [
  { id: "p1", storeId: "s1", name: "Indigo Offcut Wall Tapestry", category: "Textile", price: 42000, stock: 6, sold: 21, rating: 4.9, img: "https://picsum.photos/seed/indigo-tapestry/600/600", desc: "Hand-loomed from indigo-dyed fabric offcuts salvaged from Lagos tailoring workshops. Each panel is one-of-one." },
  { id: "p2", storeId: "s2", name: "Gearwork Falcon Sculpture", category: "Sculpture", price: 78000, stock: 3, sold: 14, rating: 4.8, img: "https://picsum.photos/seed/gearwork-falcon/600/600", desc: "A falcon in flight, welded entirely from decommissioned bicycle gears and engine parts." },
  { id: "p3", storeId: "s3", name: "Tideglass Pendant Set", category: "Jewelry", price: 15500, stock: 24, sold: 63, rating: 4.9, img: "https://picsum.photos/seed/tideglass-pendant/600/600", desc: "Pendants cast from ocean plastic collected along the Niger Delta coastline, polished to a sea-glass finish." },
  { id: "p4", storeId: "s2", name: "Reclaimed Rebar Side Table", category: "Furniture", price: 96000, stock: 2, sold: 9, rating: 4.7, img: "https://picsum.photos/seed/rebar-table/600/600", desc: "Bent construction rebar forms the base for a hand-finished salvaged-timber tabletop." },
  { id: "p5", storeId: "s1", name: "Ankara Scrap Cushion Pair", category: "Home Decor", price: 18000, stock: 15, sold: 40, rating: 4.6, img: "https://picsum.photos/seed/ankara-cushion/600/600", desc: "Patchworked from Ankara fabric remnants too small for garment production." },
  { id: "p6", storeId: "s3", name: "Driftnet Wall Hanging", category: "Wall Art", price: 27000, stock: 8, sold: 17, rating: 4.5, img: "https://picsum.photos/seed/driftnet-wall/600/600", desc: "Woven from abandoned fishing net recovered during Delta coastline cleanups." },
  { id: "p7", storeId: "s2", name: "Bottle-cap Mosaic Mirror", category: "Home Decor", price: 33000, stock: 5, sold: 11, rating: 4.8, img: "https://picsum.photos/seed/bottlecap-mirror/600/600", desc: "Thousands of sorted bottle caps set in resin around a full-length mirror frame." },
  { id: "p8", storeId: "s1", name: "Denim Remnant Floor Rug", category: "Home Decor", price: 51000, stock: 4, sold: 8, rating: 4.9, img: "https://picsum.photos/seed/denim-rug/600/600", desc: "Braided from post-industrial denim offcuts, hand-stitched into a durable floor rug." },
  { id: "p9", storeId: "s3", name: "Current Ring Trio", category: "Jewelry", price: 9800, stock: 30, sold: 88, rating: 4.7, img: "https://picsum.photos/seed/current-ring/600/600", desc: "Three stacking rings machined from recovered aluminium can stock." },
  { id: "p10", storeId: "s2", name: "Exhaust Pipe Floor Lamp", category: "Furniture", price: 62000, stock: 6, sold: 13, rating: 4.6, img: "https://picsum.photos/seed/exhaust-lamp/600/600", desc: "A standing lamp built from a decommissioned exhaust manifold and brass fittings." },
];

const seedOrders = (products) => {
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const buyers = ["Femi Adebayo", "Grace Okon", "Uche Okafor", "Halima Bello", "Segun Adeyemi", "Ifeoma Chukwu"];
  const rows = [];
  for (let i = 0; i < 26; i++) {
    const p = products[i % products.length];
    const qty = 1 + (i % 3);
    const gross = p.price * qty;
    rows.push({
      id: "ORD-" + (1000 + i),
      buyer: buyers[i % buyers.length],
      productId: p.id,
      productName: p.name,
      storeId: p.storeId,
      qty,
      ...splitSale(gross),
      status: statuses[i % statuses.length],
      date: `2026-08-${String((i % 17) + 1).padStart(2, "0")}`,
      payout: i % 4 === 0 ? "pending" : "paid",
    });
  }
  return rows;
};

const seedUsers = () => {
  const names = ["Femi Adebayo", "Grace Okon", "Uche Okafor", "Halima Bello", "Segun Adeyemi", "Ifeoma Chukwu", "Tunde Bakare", "Ngozi Umeh"];
  return names.map((n, i) => ({
    id: "U-" + (200 + i),
    name: n,
    email: n.toLowerCase().replace(" ", ".") + "@mail.com",
    role: "consumer",
    orders: 2 + (i % 5),
    joined: "2025",
    status: i === 5 ? "suspended" : "active",
  }));
};

const salesSeries = [
  { day: "Mon", sales: 210000 }, { day: "Tue", sales: 265000 }, { day: "Wed", sales: 198000 },
  { day: "Thu", sales: 302000 }, { day: "Fri", sales: 341000 }, { day: "Sat", sales: 415000 },
  { day: "Sun", sales: 289000 },
];

const monthSeries = [
  { m: "Mar", gross: 2100000 }, { m: "Apr", gross: 2450000 }, { m: "May", gross: 2380000 },
  { m: "Jun", gross: 2900000 }, { m: "Jul", gross: 3150000 }, { m: "Aug", gross: 3420000 },
];

const PIE_COLORS = [COLOR.forest, COLOR.sage, COLOR.gold, COLOR.rust];

/* ---------------------------------- SMALL UI PARTS ---------------------------------- */

function GrowthRing({ size = 44, value = 0.7, color = COLOR.gold }) {
  const r = size / 2 - 4;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLOR.line} strokeWidth="3" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function Pill({ active, children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
      style={{
        background: active ? COLOR.forest : "transparent",
        color: active ? COLOR.cream : COLOR.forest,
        border: `1px solid ${active ? COLOR.forest : COLOR.line}`,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, trend, icon: Icon, accent = COLOR.forest }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: accent + "1a" }}>
          <Icon size={16} color={accent} />
        </div>
        {trend !== undefined && (
          <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: trend >= 0 ? COLOR.forest : COLOR.rust }}>
            {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "'Fraunces', serif", color: COLOR.ink }}>{value}</div>
        <div className="text-xs mt-0.5" style={{ color: COLOR.bark }}>{label}</div>
      </div>
      {sub && <div className="text-[11px]" style={{ color: COLOR.sage }}>{sub}</div>}
    </div>
  );
}

function StatusTag({ status }) {
  const map = {
    active: [COLOR.forest, "Active"], suspended: [COLOR.rust, "Suspended"], pending: [COLOR.gold, "Pending"],
    processing: [COLOR.gold, "Processing"], shipped: [COLOR.sage, "Shipped"], delivered: [COLOR.forest, "Delivered"],
    paid: [COLOR.forest, "Paid"],
  };
  const [c, label] = map[status] || [COLOR.bark, status];
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ color: c, background: c + "1a" }}>
      {label}
    </span>
  );
}

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="text-xs font-semibold tracking-[0.18em] uppercase mb-1.5" style={{ color: COLOR.gold }}>{eyebrow}</div>}
      <h2 style={{ fontFamily: "'Fraunces', serif", color: COLOR.ink }} className="text-2xl md:text-3xl font-medium">{title}</h2>
      {sub && <p className="text-sm mt-1" style={{ color: COLOR.bark }}>{sub}</p>}
    </div>
  );
}

/* ---------------------------------- CONSUMER ---------------------------------- */

function ConsumerApp({ products, stores, authUser, setAuthMode }) {
  const [view, setView] = useState("browse");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState({
  line1: "",
  city: "",
  state: "",
  phone: "",
});
  const [favorites, setFavorites] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(0);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "popular") list = [...list].sort((a, b) => b.sold - a.sold);
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, query, category, sort]);

  const addToCart = (p, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === p.id);
      if (existing) return c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock) } : i));
      return [...c, { ...p, qty }];
    });
    setCartOpen(true);
  };
  const updateQty = (id, delta) => setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(i.qty + delta, i.stock)) } : i)).filter(Boolean));
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const toggleFav = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const storeOf = (id) => stores.find((s) => s.id === id);

  const placeOrder = async () => {
  if (!authUser) {
    setAuthMode("login");
    return;
  }

  if (!shipping.line1 || !shipping.city || !shipping.state || !shipping.phone) {
    alert("Please enter your shipping information.");
    return;
  }

  try {
    const token = localStorage.getItem("art_ecologique_token");

    const response = await fetch(`${API_BASE}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        })),
        shipping,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to create order");
    }

   if (data.cashierUrl) {
  window.location.href = data.cashierUrl;
} else {
  throw new Error("OPay checkout URL was not returned.");
}
  } catch (error) {
    alert(error.message);
  }
};
  
  return (
    <div>
      {/* nav */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Pill active={view === "browse"} onClick={() => setView("browse")}>Browse</Pill>
          <Pill active={view === "orders"} onClick={() => setView("orders")} icon={Package}>My Orders</Pill>
          <Pill active={view === "favorites"} onClick={() => setView("favorites")} icon={Heart}>Favorites</Pill>
          <Pill active={view === "profile"} onClick={() => setView("profile")} icon={User}>Profile</Pill>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{ background: COLOR.forest, color: COLOR.cream }}
        >
          <ShoppingCart size={15} /> Cart
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold"
              style={{ background: COLOR.gold, color: COLOR.forestDeep }}>
              {cart.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </button>
      </div>

      {view === "browse" && (
        <>
          {/* hero */}
          <div className="rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${COLOR.forest}, ${COLOR.forestDeep})` }}>
            <div className="absolute -right-10 -bottom-16 opacity-20"><TreePine size={220} color={COLOR.sageLight} /></div>
            <div className="relative max-w-xl">
              <div className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: COLOR.gold }}>Turning waste into art, and art into hope</div>
              <h1 style={{ fontFamily: "'Fraunces', serif" }} className="text-3xl md:text-4xl font-medium mb-3" >
                <span style={{ color: COLOR.cream }}>Objects with a former life,</span><br/>
                <span style={{ color: COLOR.sageLight }}>reborn by hand.</span>
              </h1>
              <p className="text-sm mb-5" style={{ color: COLOR.creamDeep }}>Every piece on Art Écologique is made from something that was thrown away — sourced, verified, and handcrafted by independent Nigerian makers.</p>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 max-w-md">
                <Search size={16} color={COLOR.bark} />
                <input
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search reclaimed sculpture, textile, jewelry…"
                  className="flex-1 outline-none text-sm" style={{ color: COLOR.ink }}
                />
              </div>
            </div>
          </div>

          {/* filters */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div className="flex gap-2 flex-wrap">
              <Pill active={category === "All"} onClick={() => setCategory("All")}>All</Pill>
              {CATEGORIES.map((c) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: COLOR.bark }}>
              <SlidersHorizontal size={14} />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none font-medium" style={{ color: COLOR.ink }}>
                <option value="popular">Most popular</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-2xl overflow-hidden group cursor-pointer" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
                <div className="relative aspect-square overflow-hidden" onClick={() => setActiveProduct(p)}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center bg-white/90"
                  >
                    <Heart size={14} fill={favorites.includes(p.id) ? COLOR.rust : "none"} color={favorites.includes(p.id) ? COLOR.rust : COLOR.bark} />
                  </button>
                  {p.stock <= 3 && (
                    <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: COLOR.rust, color: "#fff" }}>Only {p.stock} left</span>
                  )}
                </div>
                <div className="p-3.5" onClick={() => setActiveProduct(p)}>
                  <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: COLOR.sage }}>{p.category}</div>
                  <div className="text-sm font-medium mb-1.5 leading-snug" style={{ color: COLOR.ink }}>{p.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm" style={{ fontFamily: "'Fraunces', serif", color: COLOR.forest }}>{fmtN(p.price)}</span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: COLOR.bark }}><Star size={11} fill={COLOR.gold} color={COLOR.gold} />{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "orders" && (
        <div>
          <SectionHeader eyebrow="Purchases" title="Order history" />
          {orders.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" text="Items you buy will appear here with live status updates." />
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl p-4 flex-wrap gap-2" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: COLOR.ink }}>{o.productName} × {o.qty}</div>
                    <div className="text-xs" style={{ color: COLOR.bark }}>{o.id} · {o.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold" style={{ color: COLOR.forest }}>{fmtN(o.gross)}</span>
                    <StatusTag status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "favorites" && (
        <div>
          <SectionHeader eyebrow="Saved" title="Your favorites" />
          {favorites.length === 0 ? (
            <EmptyState icon={Heart} title="Nothing saved yet" text="Tap the heart on any piece to save it here." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.filter((p) => favorites.includes(p.id)).map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }} onClick={() => setActiveProduct(p)}>
                  <img src={p.img} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <div className="text-sm font-medium" style={{ color: COLOR.ink }}>{p.name}</div>
                    <div className="text-sm font-semibold" style={{ color: COLOR.forest }}>{fmtN(p.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === "profile" && (
        <div className="max-w-lg">
          <SectionHeader eyebrow="Account" title="Your profile" />
          <div className="rounded-2xl p-6 space-y-4" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
            <Field label="Full name" value="Chioma Adeyemi" />
            <Field label="Email" value="chioma.a@mail.com" />
            <Field label="Delivery address" value="14 Freedom Way, Lekki Phase 1, Lagos" />
            <Field label="Payment method" value="OPay •••• wallet linked" />
          </div>
        </div>
      )}

      {/* product detail modal */}
      {activeProduct && (
        <Modal onClose={() => setActiveProduct(null)}>
          <ProductDetail product={activeProduct} store={storeOf(activeProduct.storeId)} onAdd={addToCart} />
        </Modal>
      )}

      {/* cart drawer */}
      {cartOpen && (
        <Drawer onClose={() => { setCartOpen(false); setCheckoutStep(0); }}>
          {checkoutStep === 0 && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-medium" >Your cart</h3>
                <button onClick={() => setCartOpen(false)}><X size={18} /></button>
              </div>
              {cart.length === 0 ? (
                <EmptyState icon={ShoppingCart} title="Your cart is empty" text="Add a piece to get started." />
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((i) => (
                      <div key={i.id} className="flex gap-3">
                        <img src={i.img} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="text-sm font-medium" style={{ color: COLOR.ink }}>{i.name}</div>
                          <div className="text-xs mb-1.5" style={{ color: COLOR.bark }}>{fmtN(i.price)}</div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(i.id, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: COLOR.line }}><Minus size={11} /></button>
                            <span className="text-xs w-4 text-center">{i.qty}</span>
                            <button onClick={() => updateQty(i.id, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: COLOR.line }}><Plus size={11} /></button>
                            <button onClick={() => removeFromCart(i.id)} className="ml-2"><Trash2 size={13} color={COLOR.rust} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4" style={{ borderColor: COLOR.line }}>
                    <div className="flex justify-between text-sm mb-4"><span style={{ color: COLOR.bark }}>Subtotal</span><span className="font-semibold" style={{ color: COLOR.ink }}>{fmtN(cartTotal)}</span></div>
                    <button onClick={() => setCheckoutStep(1)} className="w-full py-3 rounded-full text-sm font-semibold" style={{ background: COLOR.forest, color: COLOR.cream }}>Checkout</button>
                  </div>
                </>
              )}
            </>
          )}

          {checkoutStep === 1 && (
            <>
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-medium mb-5">Confirm & pay</h3>
              <div className="space-y-3 mb-5">
  <input
    placeholder="Address"
    value={shipping.line1}
    onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border text-sm"
  />
  <input
    placeholder="City"
    value={shipping.city}
    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border text-sm"
  />
  <input
    placeholder="State"
    value={shipping.state}
    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border text-sm"
  />
  <input
    placeholder="Phone"
    value={shipping.phone}
    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
    className="w-full px-4 py-3 rounded-xl border text-sm"
  />
</div>
              <div className="space-y-3 mb-5">
                {cart.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm"><span style={{ color: COLOR.bark }}>{i.name} × {i.qty}</span><span style={{ color: COLOR.ink }}>{fmtN(i.price * i.qty)}</span></div>
                ))}
              </div>
              <div className="rounded-xl p-4 mb-5 flex items-center justify-between" style={{ background: COLOR.creamDeep }}>
                <span className="text-sm font-medium" style={{ color: COLOR.ink }}>Pay with OPay</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: COLOR.forest, color: COLOR.cream }}>Linked</span>
              </div>
              <div className="flex justify-between text-base font-semibold mb-6"><span>Total</span><span style={{ color: COLOR.forest }}>{fmtN(cartTotal)}</span></div>
              <button onClick={placeOrder} className="w-full py-3 rounded-full text-sm font-semibold" style={{ background: COLOR.gold, color: COLOR.forestDeep }}>Pay {fmtN(cartTotal)}</button>
            </>
          )}

          {checkoutStep === 2 && (
            <div className="flex flex-col items-center text-center py-10">
              <CheckCircle2 size={48} color={COLOR.forest} className="mb-4" />
              <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-xl font-medium mb-2">Order placed</h3>
              <p className="text-sm mb-6" style={{ color: COLOR.bark }}>The maker has been notified and will begin preparing your piece.</p>
              <button onClick={() => { setCartOpen(false); setCheckoutStep(0); setView("orders"); }} className="px-6 py-2.5 rounded-full text-sm font-semibold" style={{ background: COLOR.forest, color: COLOR.cream }}>View orders</button>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs mb-1" style={{ color: COLOR.sage }}>{label}</div>
      <div className="text-sm" style={{ color: COLOR.ink }}>{value}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col items-center text-center py-16 rounded-2xl" style={{ background: "#fff", border: `1px dashed ${COLOR.line}` }}>
      <Icon size={30} color={COLOR.sage} className="mb-3" />
      <div className="text-sm font-medium mb-1" style={{ color: COLOR.ink }}>{title}</div>
      <div className="text-xs max-w-xs" style={{ color: COLOR.bark }}>{text}</div>
    </div>
  );
}

function ProductDetail({ product, store, onAdd }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img src={product.img} className="w-full aspect-square object-cover rounded-2xl" />
      <div>
        <div className="text-xs uppercase tracking-wide mb-2" style={{ color: COLOR.sage }}>{product.category}</div>
        <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-medium mb-2" >{product.name}</h3>
        <div className="flex items-center gap-1 mb-4 text-sm" style={{ color: COLOR.bark }}><Star size={13} fill={COLOR.gold} color={COLOR.gold} />{product.rating} · {product.sold} sold</div>
        <p className="text-sm mb-5 leading-relaxed" style={{ color: COLOR.bark }}>{product.desc}</p>
        {store && (
          <div className="flex items-center gap-2 mb-5 rounded-xl p-3" style={{ background: COLOR.creamDeep }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLOR.forest }}><Store size={14} color={COLOR.cream} /></div>
            <div>
              <div className="text-xs font-medium" style={{ color: COLOR.ink }}>{store.name}</div>
              <div className="text-[11px]" style={{ color: COLOR.bark }}>{store.city} · {store.rating}★ seller</div>
            </div>
          </div>
        )}
        <div className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Fraunces', serif", color: COLOR.forest }}>{fmtN(product.price)}</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border rounded-full px-3 py-1.5" style={{ borderColor: COLOR.line }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={13} /></button>
            <span className="text-sm w-4 text-center">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><Plus size={13} /></button>
          </div>
          <button onClick={() => onAdd(product, qty)} className="flex-1 py-2.5 rounded-full text-sm font-semibold" style={{ background: COLOR.forest, color: COLOR.cream }}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(24,29,19,0.55)" }} onClick={onClose}>
      <div className="rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto" style={{ background: COLOR.cream }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Drawer({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(24,29,19,0.5)" }} onClick={onClose}>
      <div className="w-full max-w-sm h-full p-6 overflow-y-auto" style={{ background: COLOR.cream }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------- SELLER ---------------------------------- */

function SellerApp({ products, setProducts, orders, storeId, stores }) {
  const [section, setSection] = useState("overview");
  const [sellerOverview, setSellerOverview] = useState(null);
  const [sellerPayouts, setSellerPayouts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
    const [payoutDetails, setPayoutDetails] = useState({
    payoutMethod: "OPAY",
    payoutAccountName: "",
    payoutAccountNumber: "",
    payoutBankCode: "",
  });
  const [savingPayoutDetails, setSavingPayoutDetails] = useState(false);
  useEffect(() => {
  const token = localStorage.getItem("art_ecologique_token");
    fetch(`${API_BASE}/seller/payout-details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Payout details failed (${res.status})`);
      }

      setPayoutDetails({
        payoutMethod: data.payoutMethod || "OPAY",
        payoutAccountName: data.payoutAccountName || "",
        payoutAccountNumber: data.payoutAccountNumber || "",
        payoutBankCode: data.payoutBankCode || "",
      });
    })
    .catch((error) => {
      console.error("Could not load payout details:", error);
    });

  fetch(`${API_BASE}/seller/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Seller overview failed (${res.status})`);
      return res.json();
    })
    .then((data) => setSellerOverview(data))
    .catch((error) => console.error("Could not load seller overview:", error));
    fetch(`${API_BASE}/seller/orders`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => {
    if (!res.ok) throw new Error(`Seller orders failed (${res.status})`);
    return res.json();
  })
  .then((data) => {
    setSellerOrders(
      data.map((item) => ({
        id: item.id,
        name: item.product?.name || "Order",
        buyer: item.order?.buyer?.name || "Customer",
        status: item.fulfillmentStatus?.toLowerCase() || "processing",
        gross: (item.grossAmountKobo || 0) / 100,
        commission: (item.commissionKobo || 0) / 100,
        net: (item.netAmountKobo || 0) / 100,
        payout: item.payoutId ? "paid" : "pending",
        storeId: item.storeId,
      }))
    );
  })
  .catch((error) => {
    console.error("Could not load seller orders:", error);
  });
  fetch(`${API_BASE}/seller/payouts`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => {
    if (!res.ok) throw new Error(`Seller payouts failed (${res.status})`);
    return res.json();
  })
  .then((data) => {
    setSellerPayouts(data);
  })
  .catch((error) => {
    console.error("Could not load seller payouts:", error);
  });
}, []);
  const myStore = stores.find((s) => s.id === storeId);
  const myProducts = products.filter((p) => p.storeId === storeId);
  const myOrders = sellerOrders;

  const totalSales = myOrders.reduce((s, o) => s + o.gross, 0);
  const netEarnings = myOrders.reduce((s, o) => s + o.net, 0);
  const commissionPaid = myOrders.reduce((s, o) => s + o.commission, 0);
  const pending = myOrders.filter((o) => o.status === "pending" || o.status === "processing").length;
 const chartSales = myOrders.length > 0
  ? myOrders.map((o, index) => ({
      day: `Order ${index + 1}`,
      sales: o.gross,
    }))
  : [{ day: "No orders", sales: 0 }];
  const lowStock = myProducts.filter((p) => p.stock <= 4).length;
  const pendingPayout = myOrders
  .filter((o) => o.payout === "pending" && o.status === "delivered")
  .reduce((s, o) => s + o.net, 0);

  const [newProduct, setNewProduct] = useState({ name: "", category: CATEGORIES[0], price: "", stock: "" });
  const [newPhotos, setNewPhotos] = useState([]); // { file, previewUrl }

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6 - newPhotos.length);
    const withPreviews = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewPhotos((p) => [...p, ...withPreviews]);
    e.target.value = ""; // allow selecting the same file again after removing it
  };
  const removeNewPhoto = (previewUrl) => setNewPhotos((p) => {
    const target = p.find((x) => x.previewUrl === previewUrl);
    if (target) URL.revokeObjectURL(target.previewUrl);
    return p.filter((x) => x.previewUrl !== previewUrl);
  });

  const addProduct = async () => {
  if (!newProduct.name || !newProduct.price) return;

  try {
    const token = localStorage.getItem("art_ecologique_token");

    const res = await fetch(`${API_BASE}/seller/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock) || 1,
        description: "Newly listed piece.",
        images: [],
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `Product creation failed (${res.status})`);
    }

    let created = await res.json();

    // Upload selected photos to the real backend
    if (newPhotos.length > 0) {
      const formData = new FormData();

      newPhotos.forEach((photo) => {
        formData.append("photos", photo.file);
      });

      const imageRes = await fetch(
        `${API_BASE}/seller/products/${created.id}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!imageRes.ok) {
        const error = await imageRes.json().catch(() => ({}));
        throw new Error(error.error || `Photo upload failed (${imageRes.status})`);
      }

      created = await imageRes.json();
    }

    setProducts((ps) => [
      ...ps,
      {
        id: created.id,
        storeId: created.storeId,
        name: created.name,
        category: created.category,
        price: Math.round((created.priceKobo || 0) / 100),
        stock: created.stock,
        sold: 0,
        rating: 5,
        img:
          created.images?.[0]?.url ||
          "https://picsum.photos/seed/art-ecologique/600/600",
        gallery: created.images || [],
        desc: created.description || "",
      },
    ]);

    setNewProduct({
      name: "",
      category: CATEGORIES[0],
      price: "",
      stock: "",
    });

    setNewPhotos([]);
  } catch (error) {
    console.error("Could not create product:", error);
    alert(error.message);
  }
};

  const removeProduct = async (id) => {
  const token = localStorage.getItem("art_ecologique_token");

  const res = await fetch(`${API_BASE}/seller/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Delete product failed (${res.status})`);
  }

  setProducts((ps) => ps.filter((p) => p.id !== id));
};
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        <Pill active={section === "overview"} onClick={() => setSection("overview")} icon={LayoutDashboard}>Overview</Pill>
        <Pill active={section === "products"} onClick={() => setSection("products")} icon={Package}>Products</Pill>
        <Pill active={section === "orders"} onClick={() => setSection("orders")} icon={ShoppingCart}>Orders</Pill>
        <Pill active={section === "payouts"} onClick={() => setSection("payouts")} icon={Wallet}>Payouts</Pill>
      </div>

      {section === "overview" && (
        <div>
          <SectionHeader eyebrow={sellerOverview?.store?.name || myStore?.name || "Your store"} title="Store overview" sub="Last 30 days performance across your storefront." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Gross sales" value={fmtN((sellerOverview?.grossKobo || 0) / 100)} icon={DollarSign} />
            <StatCard
  label="Net earnings"
  value={fmtN((sellerOverview?.netKobo || 0) / 100)}
  icon={Wallet}
  accent={COLOR.gold}
  sub="after 5% commission"
/>
            <StatCard
  label="Orders"
  value={sellerOverview?.totalOrders || 0}
  icon={ShoppingCart}
  accent={COLOR.sage}
/>
            <StatCard
  label="Pending orders"
  value={sellerOverview?.pendingOrders || 0}
  icon={Clock}
  accent={COLOR.rust}
/>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
              <div className="text-sm font-medium mb-4" style={{ color: COLOR.ink }}>Weekly sales</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartSales}>
                  <defs>
                    <linearGradient id="sellerArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLOR.forest} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={COLOR.forest} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLOR.line} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: COLOR.bark }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLOR.bark }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => fmtN(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${COLOR.line}` }} />
                  <Area type="monotone" dataKey="sales" stroke={COLOR.forest} strokeWidth={2} fill="url(#sellerArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
              <GrowthRing size={90} value={myOrders.length > 0 ? 1 : 0} />
              <div className="text-center">
                <div className="text-xl font-semibold" style={{ fontFamily: "'Fraunces', serif", color: COLOR.ink }}>{lowStock}</div>
                <div className="text-xs" style={{ color: COLOR.bark }}>products below 5 units</div>
              </div>
              <button onClick={() => setSection("products")} className="text-xs font-semibold px-4 py-2 rounded-full" style={{ background: COLOR.creamDeep, color: COLOR.forest }}>Restock now</button>
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ background: COLOR.forest }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs uppercase tracking-wide mb-1" style={{ color: COLOR.sageLight }}>Commission deducted this period</div>
                <div className="text-xl font-semibold" style={{ fontFamily: "'Fraunces', serif", color: COLOR.cream }}>{fmtN(commissionPaid)}</div>
              </div>
              <div className="text-xs text-right" style={{ color: COLOR.creamDeep }}>Gross {fmtN(totalSales)} → 5% platform fee → Net {fmtN(netEarnings)}</div>
            </div>
          </div>
        </div>
      )}

      {section === "products" && (
        <div>
          <SectionHeader eyebrow="Inventory" title="Manage products" />
          <div className="rounded-2xl p-5 mb-6" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
            <div className="grid md:grid-cols-5 gap-3 mb-4">
              <input placeholder="Product name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ border: `1px solid ${COLOR.line}` }} />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ border: `1px solid ${COLOR.line}` }}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input placeholder="Price (₦)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ border: `1px solid ${COLOR.line}` }} />
              <input placeholder="Stock qty" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="rounded-lg px-3 py-2 text-sm outline-none" style={{ border: `1px solid ${COLOR.line}` }} />
              <button onClick={addProduct} className="rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5" style={{ background: COLOR.forest, color: COLOR.cream }}><Plus size={14} />Add product</button>
            </div>

            {/* photo picker */}
            <div className="text-xs font-medium mb-2" style={{ color: COLOR.bark }}>Product photos ({newPhotos.length}/6)</div>
            <div className="flex flex-wrap gap-3">
              {newPhotos.map((p) => (
                <div key={p.previewUrl} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                  <img src={p.previewUrl} className="w-full h-full object-cover" />
                  <button onClick={() => removeNewPhoto(p.previewUrl)} className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center bg-black/60">
                    <X size={11} color="#fff" />
                  </button>
                </div>
              ))}
              {newPhotos.length < 6 && (
                <label className="w-20 h-20 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer" style={{ border: `1.5px dashed ${COLOR.line}`, color: COLOR.sage }}>
                  <Camera size={16} />
                  <span className="text-[10px] font-medium">Upload</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handlePhotoSelect} />
                </label>
              )}
            </div>
            <div className="text-[11px] mt-2" style={{ color: COLOR.sage }}>JPG, PNG, or WEBP · up to 8MB each · first photo becomes the cover image</div>
          </div>
          <div className="space-y-2">
            {myProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl p-3 flex-wrap" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
                <img src={p.img} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-[140px]">
                  <div className="text-sm font-medium" style={{ color: COLOR.ink }}>{p.name}</div>
                  <div className="text-xs" style={{ color: COLOR.bark }}>{p.category}</div>
                </div>
                <div className="text-sm font-semibold" style={{ color: COLOR.forest }}>{fmtN(p.price)}</div>
                <div className="text-xs px-2 py-1 rounded-full" style={{ background: p.stock <= 4 ? COLOR.rust + "1a" : COLOR.sage + "1a", color: p.stock <= 4 ? COLOR.rust : COLOR.sage }}>{p.stock} in stock</div>
                <button onClick={() => removeProduct(p.id)}><Trash2 size={15} color={COLOR.rust} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "orders" && (
        <div>
          <SectionHeader eyebrow="Fulfillment" title="Incoming orders" />
          <OrdersTable orders={myOrders} showBuyer editableStatus />
        </div>
      )}

      {section === "payouts" && (
        <div>
          <SectionHeader eyebrow="Earnings" title="Payouts" />
<div
  className="rounded-2xl p-5 mb-6"
  style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}
>
  <div className="mb-4">
    <div
      className="text-sm font-semibold"
      style={{ color: COLOR.ink }}
    >
      Payout account
    </div>

    <div
      className="text-xs mt-1"
      style={{ color: COLOR.bark }}
    >
      Enter the account where your seller earnings should be sent.
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <div>
      <label
        className="block text-xs font-medium mb-1"
        style={{ color: COLOR.bark }}
      >
        Payout method
      </label>

      <select
        value={payoutDetails.payoutMethod}
        onChange={(e) =>
          setPayoutDetails((current) => ({
            ...current,
            payoutMethod: e.target.value,
          }))
        }
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
        style={{
          border: `1px solid ${COLOR.line}`,
          color: COLOR.ink,
          background: "#fff",
        }}
      >
        <option value="OPAY">OPay</option>
        <option value="BANK">Bank account</option>
      </select>
    </div>

    <div>
      <label
        className="block text-xs font-medium mb-1"
        style={{ color: COLOR.bark }}
      >
        Account name
      </label>

      <input
        type="text"
        value={payoutDetails.payoutAccountName}
        onChange={(e) =>
          setPayoutDetails((current) => ({
            ...current,
            payoutAccountName: e.target.value,
          }))
        }
        placeholder="Account holder name"
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
        style={{
          border: `1px solid ${COLOR.line}`,
          color: COLOR.ink,
        }}
      />
    </div>

    <div>
      <label
        className="block text-xs font-medium mb-1"
        style={{ color: COLOR.bark }}
      >
        Account number
      </label>

      <input
        type="text"
        inputMode="numeric"
        value={payoutDetails.payoutAccountNumber}
        onChange={(e) =>
          setPayoutDetails((current) => ({
            ...current,
            payoutAccountNumber: e.target.value.replace(/\D/g, ""),
          }))
        }
        placeholder="Account number"
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
        style={{
          border: `1px solid ${COLOR.line}`,
          color: COLOR.ink,
        }}
      />
    </div>

    {payoutDetails.payoutMethod === "BANK" && (
      <div>
        <label
          className="block text-xs font-medium mb-1"
          style={{ color: COLOR.bark }}
        >
          Bank code
        </label>

        <input
          type="text"
          value={payoutDetails.payoutBankCode}
          onChange={(e) =>
            setPayoutDetails((current) => ({
              ...current,
              payoutBankCode: e.target.value.replace(/\D/g, ""),
            }))
          }
          placeholder="Bank code"
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{
            border: `1px solid ${COLOR.line}`,
            color: COLOR.ink,
          }}
        />
      </div>
    )}
  </div>

  <div className="mt-4">
    <button
      disabled={savingPayoutDetails}
      className="px-5 py-2.5 rounded-full text-sm font-semibold"
      style={{
        background: savingPayoutDetails ? COLOR.line : COLOR.gold,
        color: COLOR.forestDeep,
      }}
      onClick={async () => {
        const token = localStorage.getItem("art_ecologique_token");

        if (
          !payoutDetails.payoutAccountName ||
          !payoutDetails.payoutAccountNumber
        ) {
          alert("Please enter the account name and account number.");
          return;
        }

        if (
          payoutDetails.payoutMethod === "BANK" &&
          !payoutDetails.payoutBankCode
        ) {
          alert("Please enter the bank code.");
          return;
        }

        setSavingPayoutDetails(true);

        try {
          const res = await fetch(`${API_BASE}/seller/payout-details`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payoutDetails),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(
              data.error || `Could not save payout details (${res.status})`
            );
          }

          setPayoutDetails({
            payoutMethod: data.payoutMethod || "OPAY",
            payoutAccountName: data.payoutAccountName || "",
            payoutAccountNumber: data.payoutAccountNumber || "",
            payoutBankCode: data.payoutBankCode || "",
          });

          alert("Payout details saved successfully.");
        } catch (error) {
          console.error("Could not save payout details:", error);
          alert(error.message);
        } finally {
          setSavingPayoutDetails(false);
        }
      }}
    >
      {savingPayoutDetails ? "Saving..." : "Save payout details"}
    </button>
  </div>
</div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <StatCard label="Available for payout" value={fmtN(pendingPayout)} icon={Wallet} accent={COLOR.gold} />
            <StatCard label="Total paid out"value={fmtN(
  sellerPayouts
    .filter((p) => p.status?.toLowerCase() === "paid")
    .reduce((sum, p) => sum + (p.amountKobo || 0), 0) / 100
)} icon={CheckCircle2} accent={COLOR.forest} />
            <StatCard label="Lifetime commission paid" value={fmtN(commissionPaid)} icon={TrendingUp} accent={COLOR.sage} />
          </div>
          <div className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
            <div>
              <div className="text-sm font-medium" style={{ color: COLOR.ink }}>Request withdrawal to OPay</div>
              <div className="text-xs" style={{ color: COLOR.bark }}>Payouts settle within 1–2 business days.</div>
            </div>
           <button
  className="px-5 py-2.5 rounded-full text-sm font-semibold"
  style={{ background: COLOR.gold, color: COLOR.forestDeep }}
  onClick={async () => {
    const token = localStorage.getItem("art_ecologique_token");

    try {
      const res = await fetch(`${API_BASE}/seller/payouts/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Payout request failed (${res.status})`);
      }

      setSellerPayouts((payouts) => [data, ...payouts]);
      alert("Payout request created successfully.");
    } catch (error) {
      console.error("Could not request payout:", error);
      alert(error.message);
    }
  }}
>
  Withdraw {fmtN(pendingPayout)}
</button>
          </div>
          <div className="mt-6 space-y-2">
  {sellerPayouts.slice(0, 6).map((p) => (
    <div
      key={p.id}
      className="flex items-center justify-between text-sm rounded-xl p-3"
      style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}
    >
      <span style={{ color: COLOR.bark }}>
        {p.id} · {p.requestedAt ? new Date(p.requestedAt).toLocaleDateString() : ""}
      </span>
      <span className="font-medium" style={{ color: COLOR.ink }}>
        {fmtN((p.amountKobo || 0) / 100)}
      </span>
      <StatusTag status={p.status?.toLowerCase() || "pending"} />
    </div>
  ))}
</div>
        </div>
      )}
    </div>
  );
}

function OrdersTable({ orders, showBuyer, showStore, editableStatus }) {
  const [localStatus, setLocalStatus] = useState({});
  const cycle = {
    pending: "processing",
    processing: "shipped",
    shipped: "delivered",
    delivered: "delivered",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: COLOR.creamDeep }}>
            <th
              className="text-left px-4 py-3 font-medium"
              style={{ color: COLOR.bark }}
            >
              Order
            </th>

            <th
              className="text-left px-4 py-3 font-medium"
              style={{ color: COLOR.bark }}
            >
              Item
            </th>

            {showBuyer && (
              <th
                className="text-left px-4 py-3 font-medium"
                style={{ color: COLOR.bark }}
              >
                Buyer
              </th>
            )}

            <th
              className="text-left px-4 py-3 font-medium"
              style={{ color: COLOR.bark }}
            >
              Gross
            </th>

            <th
              className="text-left px-4 py-3 font-medium"
              style={{ color: COLOR.bark }}
            >
              Status
            </th>

            {editableStatus && <th className="px-4 py-3"></th>}
          </tr>
        </thead>

        <tbody>
          {orders.slice(0, 12).map((o) => {
            const status = localStatus[o.id] || o.status;

            return (
              <tr
                key={o.id}
                className="border-t"
                style={{ borderColor: COLOR.line }}
              >
                <td
                  className="px-4 py-3"
                  style={{ color: COLOR.ink }}
                >
                  {o.id}
                </td>

                <td
                  className="px-4 py-3"
                  style={{ color: COLOR.bark }}
                >
                  {o.productName} × {o.qty}
                </td>

                {showBuyer && (
                  <td
                    className="px-4 py-3"
                    style={{ color: COLOR.bark }}
                  >
                    {o.buyer?.name || o.buyer?.email || ""}
                  </td>
                )}

                <td
                  className="px-4 py-3 font-medium"
                  style={{ color: COLOR.forest }}
                >
                  {fmtN(o.gross)}
                </td>

                <td className="px-4 py-3">
                  <StatusTag status={status} />
                </td>

                {editableStatus && (
                  <td className="px-4 py-3">
                    {status !== "delivered" && (
                      <button
                        onClick={async () => {
                          const nextStatus = cycle[status];
                          const token = localStorage.getItem(
                            "art_ecologique_token"
                          );

                          try {
                            const res = await fetch(
                              `${API_BASE}/seller/orders/${o.id}/status`,
                              {
                                method: "PATCH",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  status: nextStatus.toUpperCase(),
                                }),
                              }
                            );

                            if (!res.ok) {
                              throw new Error(
                                `Status update failed (${res.status})`
                              );
                            }

                            setLocalStatus((s) => ({
                              ...s,
                              [o.id]: nextStatus,
                            }));
                          } catch (error) {
                            console.error(
                              "Could not update order status:",
                              error
                            );
                          }
                        }}
                        className="text-xs font-semibold flex items-center gap-1"
                        style={{ color: COLOR.forest }}
                      >
                        <Play size={11} /> Advance
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------------- ADMIN ---------------------------------- */

function AdminApp({ products, orders, users, setUsers, stores, setStores }) {
  const [section, setSection] = useState("overview");
  const [adminPayouts, setAdminPayouts] = useState([]);
  const [platformCommission, setPlatformCommission] = useState({
  totalCommissionKobo: 0,
  paidKobo: 0,
  pendingKobo: 0,
  availableKobo: 0,
});

const [adminFinancials, setAdminFinancials] = useState({
  grossKobo: 0,
  commissionKobo: 0,
  netKobo: 0,
});

const [platformPayouts, setPlatformPayouts] = useState([]);
  const grossRevenue = orders.reduce((s, o) => s + o.gross, 0);
  const commission = orders.reduce((s, o) => s + o.commission, 0);
  const payouts = orders.reduce((s, o) => s + o.net, 0);
  const pendingPayouts = orders.filter((o) => o.payout === "pending").reduce((s, o) => s + o.net, 0);
  const activeSellers = stores.filter((s) => s.status === "active").length;

  const orderStatusData = ["pending", "processing", "shipped", "delivered"].map((s) => ({
    name: s, value: orders.filter((o) => o.status === s).length,
  }));

  const toggleUser = (id) => setUsers((us) => us.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
 const toggleStore = async (id) => {
  const store = stores.find((s) => s.id === id);
  if (!store) return;

  const newStatus = store.status === "active" ? "SUSPENDED" : "ACTIVE";
  const token = localStorage.getItem("art_ecologique_token");

  try {
    const res = await fetch(`${API_BASE}/admin/sellers/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to update store status.");
      return;
    }

    setStores((ss) =>
      ss.map((s) =>
        s.id === id
          ? { ...s, status: newStatus.toLowerCase() }
          : s
      )
    );
  } catch (error) {
    console.error("Could not update store status:", error);
    alert("Could not connect to the backend.");
  }
};

  useEffect(() => {
    const token = localStorage.getItem("art_ecologique_token");
fetch(`${API_BASE}/admin/overview`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => {
    if (!res.ok) {
      throw new Error(`Admin overview failed (${res.status})`);
    }
    return res.json();
  })
  .then((data) => {
    setAdminFinancials({
      grossKobo: data.grossKobo || 0,
      commissionKobo: data.commissionKobo || 0,
      netKobo: data.netKobo || 0,
    });
  })
  .catch((error) => {
    console.error("Could not load admin financials:", error);
  });
    fetch(`${API_BASE}/admin/payouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Admin payouts failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setAdminPayouts(data);
      })
            .catch((error) => {
        console.error("Could not load admin payouts:", error);
      });

    fetch(`${API_BASE}/admin/platform-commission`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Platform commission failed (${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        setPlatformCommission(data);
      })
      .catch((error) => {
        console.error(
          "Could not load platform commission:",
          error
        );
      });

    fetch(`${API_BASE}/admin/platform-payouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Platform payouts failed (${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        setPlatformPayouts(data);
      })
      .catch((error) => {
        console.error(
          "Could not load platform payouts:",
          error
        );
      });
  }, []);

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-6">
        <Pill active={section === "overview"} onClick={() => setSection("overview")} icon={LayoutDashboard}>Overview</Pill>
        <Pill active={section === "users"} onClick={() => setSection("users")} icon={Users}>Users</Pill>
        <Pill active={section === "sellers"} onClick={() => setSection("sellers")} icon={Store}>Sellers</Pill>
        <Pill active={section === "products"} onClick={() => setSection("products")} icon={Package}>Products</Pill>
        <Pill active={section === "orders"} onClick={() => setSection("orders")} icon={ShoppingCart}>Orders</Pill>
        <Pill active={section === "payouts"} onClick={() => setSection("payouts")} icon={Wallet}>Payouts</Pill>
        <Pill active={section === "financial"} onClick={() => setSection("financial")} icon={DollarSign}>Financial</Pill>
      </div>

      {section === "overview" && (
        <div>
          <SectionHeader eyebrow="Platform" title="Marketplace overview" sub="Snapshot across all consumers, sellers, and listings." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total users" value={users.length + 12} icon={Users} trend={6} />
            <StatCard label="Active sellers" value={activeSellers} icon={Store} accent={COLOR.sage} trend={4} />
            <StatCard label="Total products" value={products.length} icon={Package} accent={COLOR.gold} />
            <StatCard label="Total orders" value={orders.length} icon={ShoppingCart} accent={COLOR.rust} trend={11} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
              <div className="text-sm font-medium mb-4" style={{ color: COLOR.ink }}>Gross marketplace sales — 6 months</div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={monthSeries}>
                  <CartesianGrid stroke={COLOR.line} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: COLOR.bark }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLOR.bark }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                  <Tooltip formatter={(v) => fmtN(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${COLOR.line}` }} />
                  <Bar dataKey="gross" fill={COLOR.forest} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
              <div className="text-sm font-medium mb-4" style={{ color: COLOR.ink }}>Order status mix</div>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={orderStatusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                    {orderStatusData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {orderStatusData.map((e, i) => (
                  <span key={e.name} className="text-[10px] flex items-center gap-1" style={{ color: COLOR.bark }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />{e.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {section === "users" && (
        <div>
          <SectionHeader eyebrow="Access control" title="User management" />
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
            <table className="w-full text-sm">
              <thead><tr style={{ background: COLOR.creamDeep }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Name</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Email</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Orders</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Status</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t" style={{ borderColor: COLOR.line }}>
                    <td className="px-4 py-3" style={{ color: COLOR.ink }}>{u.name}</td>
                    <td className="px-4 py-3" style={{ color: COLOR.bark }}>{u.email}</td>
                    <td className="px-4 py-3" style={{ color: COLOR.bark }}>{u.orders}</td>
                    <td className="px-4 py-3"><StatusTag status={u.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleUser(u.id)} className="text-xs font-semibold flex items-center gap-1" style={{ color: u.status === "active" ? COLOR.rust : COLOR.forest }}>
                        {u.status === "active" ? <><Ban size={12} />Suspend</> : <><ShieldCheck size={12} />Reactivate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === "sellers" && (
        <div>
          <SectionHeader eyebrow="Marketplace partners" title="Seller management" />
          <div className="grid md:grid-cols-2 gap-4">
            {stores.map((s) => {
              const sOrders = orders.filter((o) => o.storeId === s.id);
              const sGross = sOrders.reduce((a, o) => a + o.gross, 0);
              return (
                <div key={s.id} className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold" style={{ color: COLOR.ink }}>{s.name}</div>
                      <div className="text-xs" style={{ color: COLOR.bark }}>{s.owner} · {s.city}</div>
                    </div>
                    <StatusTag status={s.status} />
                  </div>
                  <p className="text-xs mb-3" style={{ color: COLOR.bark }}>{s.bio}</p>
                  <div className="flex items-center justify-between text-xs mb-3" style={{ color: COLOR.bark }}>
                    <span>{sOrders.length} orders</span><span>{fmtN(sGross)} gross</span><span className="flex items-center gap-0.5"><Star size={11} fill={COLOR.gold} color={COLOR.gold}/>{s.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    {s.status === "pending" && <button onClick={() => approveStore(s.id)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: COLOR.forest, color: COLOR.cream }}>Approve</button>}
                    {s.status !== "pending" && (
                      <button onClick={() => toggleStore(s.id)} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: s.status === "active" ? COLOR.rust + "1a" : COLOR.forest + "1a", color: s.status === "active" ? COLOR.rust : COLOR.forest }}>
                        {s.status === "active" ? "Suspend" : "Reactivate"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {section === "products" && (
        <div>
          <SectionHeader eyebrow="Catalog" title="Product moderation" />
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
            <table className="w-full text-sm">
              <thead><tr style={{ background: COLOR.creamDeep }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Product</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Category</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Price</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Stock</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: COLOR.bark }}>Store</th>
              </tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: COLOR.line }}>
                    <td className="px-4 py-3 flex items-center gap-2" style={{ color: COLOR.ink }}><img src={p.img} className="w-8 h-8 rounded object-cover"/>{p.name}</td>
                    <td className="px-4 py-3" style={{ color: COLOR.bark }}>{p.category}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: COLOR.forest }}>{fmtN(p.price)}</td>
                    <td className="px-4 py-3" style={{ color: COLOR.bark }}>{p.stock}</td>
                    <td className="px-4 py-3" style={{ color: COLOR.bark }}>{stores.find((s) => s.id === p.storeId)?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === "orders" && (
        <div>
          <SectionHeader eyebrow="Transactions" title="All orders" />
          <OrdersTable orders={orders} showBuyer />
        </div>
      )}

{section === "payouts" && (
  <div>
    <SectionHeader
      eyebrow="Seller earnings"
      title="Payout requests"
      sub="Review and manage seller payout requests."
    />

    <div className="space-y-3">
      {adminPayouts.length === 0 ? (
        <p style={{ color: COLOR.bark }}>No payout requests yet.</p>
      ) : (
        adminPayouts.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3"
            style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}
          >
            <div>
              <div className="font-medium" style={{ color: COLOR.ink }}>
                {p.store?.name || "Seller store"}
              </div>
              <div className="text-xs" style={{ color: COLOR.bark }}>
                {p.id} · {p.status}
              </div>
            </div>

            <div className="font-semibold" style={{ color: COLOR.ink }}>
              {fmtN((p.amountKobo || 0) / 100)}
            </div>

            <StatusTag status={p.status?.toLowerCase() || "pending"} />

{p.status === "PENDING" && (
  <div className="flex gap-2">
    <button
      className="px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: COLOR.sage, color: COLOR.forestDeep }}
      onClick={async () => {
        const token = localStorage.getItem("art_ecologique_token");

        try {
          const res = await fetch(
            `${API_BASE}/admin/payouts/${p.id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: "PAID" }),
            }
          );

          if (!res.ok) throw new Error("Failed to approve payout.");

          setAdminPayouts((ps) =>
            ps.map((item) =>
              item.id === p.id ? { ...item, status: "PAID" } : item
            )
          );
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      }}
    >
      Approve
    </button>

    <button
      className="px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: COLOR.rust, color: "#fff" }}
      onClick={async () => {
        const token = localStorage.getItem("art_ecologique_token");

        try {
          const res = await fetch(
            `${API_BASE}/admin/payouts/${p.id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: "REJECTED" }),
            }
          );

          if (!res.ok) throw new Error("Failed to reject payout.");

          setAdminPayouts((ps) =>
            ps.map((item) =>
              item.id === p.id ? { ...item, status: "REJECTED" } : item
            )
          );
        } catch (error) {
          console.error(error);
          alert(error.message);
        }
      }}
    >
      Reject
    </button>
  </div>
)}
          </div>
        ))
      )}
    </div>
  </div>
)}
      {section === "financial" && (
        <div>
          <SectionHeader eyebrow="Revenue" title="Financial dashboard" sub="Platform takes a 5% commission on every completed sale, calculated and stored server-side." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
  label="Gross marketplace sales"
  value={fmtN((adminFinancials.grossKobo || 0) / 100)}
  icon={DollarSign}
/>

<StatCard
  label="Platform commission (5%)"
  value={fmtN((adminFinancials.commissionKobo || 0) / 100)}
  icon={TrendingUp}
  accent={COLOR.gold}
/>

<StatCard
  label="Seller net earnings"
  value={fmtN((adminFinancials.netKobo || 0) / 100)}
  icon={Wallet}
  accent={COLOR.sage}
/>

<StatCard
  label="Pending payouts"
 value={fmtN((adminFinancials.pendingPayoutKobo || 0) / 100)}
  icon={Clock}
  accent={COLOR.rust}
/>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total commission earned"
              value={fmtN((platformCommission.totalCommissionKobo || 0) / 100)}
              icon={TrendingUp}
              accent={COLOR.gold}
            />
            <StatCard
              label="Commission withdrawn"
              value={fmtN((platformCommission.paidKobo || 0) / 100)}
              icon={Wallet}
              accent={COLOR.sage}
            />
            <StatCard
              label="Pending withdrawal"
              value={fmtN((platformCommission.pendingKobo || 0) / 100)}
              icon={Clock}
              accent={COLOR.rust}
            />
            <StatCard
              label="Available to withdraw"
              value={fmtN((platformCommission.availableKobo || 0) / 100)}
              icon={DollarSign}
              accent={COLOR.forest}
            />
          </div>
          <div
            className="rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4"
            style={{
              background: "#fff",
              border: `1px solid ${COLOR.line}`,
            }}
          >
            <div>
              <div
                className="text-sm font-medium mb-1"
                style={{ color: COLOR.ink }}
              >
                Platform commission available
              </div>
              <div
                className="text-2xl font-semibold"
                style={{ color: COLOR.forest }}
              >
                {fmtN((platformCommission.availableKobo || 0) / 100)}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: COLOR.bark }}
              >
                This is the commission currently available for admin withdrawal.
              </div>
            </div>

            <button
              disabled={(platformCommission.availableKobo || 0) <= 0}
              onClick={async () => {
                const token = localStorage.getItem("art_ecologique_token");

                try {
                  const res = await fetch(
                    `${API_BASE}/admin/platform-payouts/request`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const data = await res.json().catch(() => ({}));

                  if (!res.ok) {
                    alert(
                      data.error ||
                        `Withdrawal request failed (${res.status})`
                    );
                    return;
                  }

                  alert(
                    `Withdrawal request created for ${fmtN(
                      (data.amountKobo || 0) / 100
                    )}.`
                  );

                  setPlatformPayouts((current) => [
                    data,
                    ...current,
                  ]);

                  setPlatformCommission((current) => ({
                    ...current,
                    pendingKobo:
                      current.pendingKobo + (data.amountKobo || 0),
                    availableKobo:
                      current.availableKobo - (data.amountKobo || 0),
                  }));
                } catch (error) {
                  console.error(
                    "Could not request platform withdrawal:",
                    error
                  );
                  alert("Could not connect to the backend.");
                }
              }}
              className="px-5 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: COLOR.forest,
                color: "#fff",
              }}
            >
              Withdraw Commission
            </button>
                    </div>

          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "#fff",
              border: `1px solid ${COLOR.line}`,
            }}
          >
            <div
              className="text-sm font-medium mb-4"
              style={{ color: COLOR.ink }}
            >
              Platform payout history
            </div>

            {platformPayouts.length === 0 ? (
              <div
                className="text-sm py-4"
                style={{ color: COLOR.bark }}
              >
                No platform withdrawals have been requested yet.
              </div>
            ) : (
              <div className="space-y-3">
                {platformPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap"
                    style={{
                      background: COLOR.cream,
                      border: `1px solid ${COLOR.line}`,
                    }}
                  >
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: COLOR.ink }}
                      >
                        {fmtN((payout.amountKobo || 0) / 100)}
                      </div>

                      <div
                        className="text-xs mt-1"
                        style={{ color: COLOR.bark }}
                      >
                        Requested{" "}
                        {payout.requestedAt
                          ? new Date(
                              payout.requestedAt
                            ).toLocaleString()
                          : "—"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background:
                            payout.status === "PAID"
                              ? COLOR.sageLight
                              : payout.status === "REJECTED"
                              ? "#FDECEC"
                              : "#FFF4D6",
                          color:
                            payout.status === "PAID"
                              ? COLOR.forest
                              : payout.status === "REJECTED"
                              ? COLOR.rust
                              : COLOR.bark,
                        }}
                      >
                        {payout.status}
                      </span>

                      {payout.status === "PENDING" && (
                        <>
                          <button
                            onClick={async () => {
                              const token =
                                localStorage.getItem(
                                  "art_ecologique_token"
                                );

                              try {
                                const res = await fetch(
                                  `${API_BASE}/admin/platform-payouts/${payout.id}/status`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type":
                                        "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                      status: "PAID",
                                    }),
                                  }
                                );

                                const data =
                                  await res
                                    .json()
                                    .catch(() => ({}));

                                if (!res.ok) {
                                  alert(
                                    data.error ||
                                      `Could not mark payout as paid (${res.status})`
                                  );
                                  return;
                                }

                                setPlatformPayouts(
                                  (current) =>
                                    current.map((item) =>
                                      item.id === data.id
                                        ? data
                                        : item
                                    )
                                );

                                setPlatformCommission(
                                  (current) => ({
                                    ...current,
                                    paidKobo:
                                      current.paidKobo +
                                      (data.amountKobo || 0),
                                    pendingKobo:
                                      current.pendingKobo -
                                      (data.amountKobo || 0),
                                  })
                                );
                              } catch (error) {
                                console.error(
                                  "Could not update platform payout:",
                                  error
                                );
                                alert(
                                  "Could not connect to the backend."
                                );
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-medium"
                            style={{
                              background: COLOR.forest,
                              color: "#fff",
                            }}
                          >
                            Mark Paid
                          </button>

                          <button
                            onClick={async () => {
                              const token =
                                localStorage.getItem(
                                  "art_ecologique_token"
                                );

                              try {
                                const res = await fetch(
                                  `${API_BASE}/admin/platform-payouts/${payout.id}/status`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type":
                                        "application/json",
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({
                                      status: "REJECTED",
                                    }),
                                  }
                                );

                                const data =
                                  await res
                                    .json()
                                    .catch(() => ({}));

                                if (!res.ok) {
                                  alert(
                                    data.error ||
                                      `Could not reject payout (${res.status})`
                                  );
                                  return;
                                }

                                setPlatformPayouts(
                                  (current) =>
                                    current.map((item) =>
                                      item.id === data.id
                                        ? data
                                        : item
                                    )
                                );

                                setPlatformCommission(
                                  (current) => ({
                                    ...current,
                                    pendingKobo:
                                      current.pendingKobo -
                                      (data.amountKobo || 0),
                                    availableKobo:
                                      current.availableKobo +
                                      (data.amountKobo || 0),
                                  })
                                );
                              } catch (error) {
                                console.error(
                                  "Could not reject platform payout:",
                                  error
                                );
                                alert(
                                  "Could not connect to the backend."
                                );
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-medium"
                            style={{
                              background: "#FDECEC",
                              color: COLOR.rust,
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4" style={{ background: COLOR.forest }}>
            <FlowStep label="Gross sale" value={fmtN(grossRevenue)} />
            <ChevronRight color={COLOR.sageLight} />
            <FlowStep label="5% platform commission" value={fmtN(commission)} accent={COLOR.gold} />
            <ChevronRight color={COLOR.sageLight} />
            <FlowStep label="Seller net earnings" value={fmtN(payouts)} accent={COLOR.sageLight} />
          </div>

          <div className="rounded-2xl p-5" style={{ background: "#fff", border: `1px solid ${COLOR.line}` }}>
            <div className="text-sm font-medium mb-4" style={{ color: COLOR.ink }}>Commission revenue trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthSeries.map((m) => ({ ...m, commission: Math.round(m.gross * 0.05) }))}>
                <CartesianGrid stroke={COLOR.line} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: COLOR.bark }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLOR.bark }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => fmtN(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${COLOR.line}` }} />
                <Line type="monotone" dataKey="commission" stroke={COLOR.gold} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function FlowStep({ label, value, accent = "#fff" }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: COLOR.creamDeep }}>{label}</div>
      <div className="text-lg font-semibold" style={{ fontFamily: "'Fraunces', serif", color: accent }}>{value}</div>
    </div>
  );
}

/* ---------------------------------- AUTH ---------------------------------- */

function AuthModal({ mode, onClose, onSuccess }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupRole, setSignupRole] = useState("CONSUMER");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = currentMode === "signup" ? "/auth/signup" : "/auth/login";
     const body = currentMode === "signup"
  ? { name, email, password, role: signupRole }
  : { email, password };
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Authentication failed");
      localStorage.setItem("art_ecologique_token", data.token);
      localStorage.setItem("art_ecologique_user", JSON.stringify(data.user));
      onSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="max-w-md">
        <div className="text-xs font-semibold tracking-[0.18em] uppercase mb-1.5" style={{ color: COLOR.gold }}>
          Art Écologique account
         <h3 style={{ fontFamily: "'Fraunces', serif" }} className="text-2xl font-medium mb-5">
  {currentMode === "signup" ? "Create your account" : "Welcome back"}
</h3>
</div>

<form onSubmit={submit} className="space-y-4">

  {currentMode === "signup" && (
    <label className="block">
      <span className="text-xs" style={{ color: COLOR.bark }}>Full name</span>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        className="w-full mt-1 px-3 py-2.5 rounded-xl border outline-none"
        style={{ borderColor: COLOR.line }}
      />
    </label>
  )}

  {currentMode === "signup" && (
    <div>
      <span className="text-xs" style={{ color: COLOR.bark }}>
        Account type
      </span>

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={() => setSignupRole("CONSUMER")}
          className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
        >
          Consumer
        </button>

        <button
          type="button"
          onClick={() => setSignupRole("SELLER")}
          className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
        >
          Seller
        </button>
      </div>
    </div>
  )}

          <label className="block">
            <span className="text-xs" style={{ color: COLOR.bark }}>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full mt-1 px-3 py-2.5 rounded-xl border outline-none" style={{ borderColor: COLOR.line }} />
          </label>
          <label className="block">
            <span className="text-xs" style={{ color: COLOR.bark }}>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full mt-1 px-3 py-2.5 rounded-xl border outline-none" style={{ borderColor: COLOR.line }} />
          </label>
          {error && <div className="text-sm rounded-xl p-3" style={{ background: COLOR.rust + "1a", color: COLOR.rust }}>{error}</div>}
          <button disabled={loading} className="w-full py-3 rounded-full text-sm font-semibold disabled:opacity-60" style={{ background: COLOR.forest, color: COLOR.cream }}>
            {loading ? "Please wait…" : currentMode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
        <button onClick={() => { setCurrentMode(currentMode === "signup" ? "login" : "signup"); setError(""); }}
          className="w-full mt-4 text-sm font-medium" style={{ color: COLOR.forest }}>
          {currentMode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
        </button>
      </div>
    </Modal>
  );
}

/* ---------------------------------- ROOT ---------------------------------- */

export default function ArtEcologique() {

  const [products, setProducts] = useState(seedProducts());
 const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(seedUsers());
 const [stores, setStores] = useState([]);
  const [apiStatus, setApiStatus] = useState("loading");
  const [authUser, setAuthUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("art_ecologique_user")) || null; } catch { return null; }
  });
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Products request failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        const apiProducts = data.map((p) => {
         const demo = {};
          return {
            ...demo,
            id: p.id,
            storeId: p.storeId,
            name: p.name,
            category: p.category,
            price: Math.round((p.priceKobo || 0) / 100),
            stock: p.stock,
           img:
  typeof p.images?.[0] === "string"
    ? p.images[0]
    : p.images?.[0]?.url || demo.img || "https://picsum.photos/seed/art-ecologique/600/600",
            desc: p.description || demo.desc || "",
          };
        });

        setProducts(apiProducts);
        setApiStatus("online");
      })
      .catch((error) => {
        console.error("Could not load products from Railway:", error);
        if (!cancelled) setApiStatus("offline");
      });
       const token = localStorage.getItem("art_ecologique_token");

    if (authUser?.role === "ADMIN") {
      fetch(`${API_BASE}/admin/sellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Sellers request failed (${res.status})`);
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;

          const apiStores = data.map((s) => ({
            id: s.id,
            name: s.name,
            owner: s.owner?.name || "",
            city: s.city || "",
            rating: s.rating || 0,
            joined: s.createdAt
              ? new Date(s.createdAt).getFullYear().toString()
              : "",
            status: s.status.toLowerCase(),
            bio: s.bio || "",
          }));

          setStores(apiStores);
        })
        .catch((error) => {
          console.error("Could not load sellers from Railway:", error);
        });

      fetch(`${API_BASE}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Orders request failed (${res.status})`);
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;

          setOrders(
            data.map((o) => {
              const gross = o.items.reduce(
                (sum, item) => sum + (item.grossAmountKobo || 0),
                0
              );

              const commission = o.items.reduce(
                (sum, item) => sum + (item.commissionKobo || 0),
                0
              );

              const net = o.items.reduce(
                (sum, item) => sum + (item.netAmountKobo || 0),
                0
              );

              return {
                ...o,
                gross: gross / 100,
                commission: commission / 100,
                net: net / 100,
                storeId: o.items[0]?.storeId || null,
                payout: o.items[0]?.payoutId ? "paid" : "pending",
                status:
                  o.status === "PENDING_PAYMENT"
                    ? "pending"
                    : o.status === "PROCESSING"
                    ? "processing"
                    : o.status === "SHIPPED"
                    ? "shipped"
                    : o.status === "DELIVERED"
                    ? "delivered"
                    : o.status.toLowerCase(),
              };
            })
          );
        })
        .catch((error) => {
          console.error("Could not load orders from Railway:", error);
        });

       
      fetch(`${API_BASE}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Users request failed (${res.status})`);
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;

          setUsers(
            data.map((u) => ({
              ...u,
              status: u.status.toLowerCase(),
              orders: 0,
            }))
          );
        })
        .catch((error) => {
          console.error("Could not load users from Railway:", error);
        });
    }

    return () => {
      cancelled = true;
    };
  }, [authUser]);



  return (
    <div style={{ background: COLOR.cream, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        table { border-collapse: collapse; }
      `}</style>

      {/* top bar */}
      <div className="sticky top-0 z-40 backdrop-blur" style={{ background: COLOR.cream + "e6", borderBottom: `1px solid ${COLOR.line}` }}>
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLOR.forest }}>
              <Leaf size={17} color={COLOR.sageLight} />
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", color: COLOR.ink }} className="text-base font-medium leading-none">Art Écologique</div>
              <div className="text-[10px] tracking-wide" style={{ color: COLOR.sage }}>Waste into art, art into hope</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            
            {authUser ? (
              <button onClick={() => { localStorage.removeItem("art_ecologique_token"); localStorage.removeItem("art_ecologique_user"); setAuthUser(null); }}
                className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: COLOR.creamDeep, color: COLOR.forest }}>
                Log out
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setAuthMode("login")} className="px-4 py-2 rounded-full text-xs font-semibold" style={{ border: `1px solid ${COLOR.line}`, color: COLOR.forest }}>Log in</button>
                <button onClick={() => setAuthMode("signup")} className="px-4 py-2 rounded-full text-xs font-semibold" style={{ background: COLOR.gold, color: COLOR.forestDeep }}>Sign up</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
      {(!authUser || authUser.role === "CONSUMER") && (
  <ConsumerApp
    products={products}
    stores={stores}
    authUser={authUser}
    setAuthMode={setAuthMode}
  />
)}
        {authUser?.role === "SELLER" && authUser?.storeStatus === "ACTIVE" && (
          <SellerApp
            products={products}
            setProducts={setProducts}
            orders={orders}
            storeId={authUser?.storeId}
          stores={stores}
          />
        )}
        {authUser?.role === "SELLER" && authUser?.storeStatus !== "ACTIVE" && (
  <div className="flex items-center justify-center min-h-[500px] px-6">
    <div className="max-w-md text-center">
      <div
        className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center text-2xl"
        style={{ background: COLOR.cream, color: COLOR.gold }}
      >
        ⏳
      </div>

      <h2
        style={{ fontFamily: "'Fraunces', serif", color: COLOR.ink }}
        className="text-3xl font-medium mb-3"
      >
        Seller account pending
      </h2>

      <p style={{ color: COLOR.bark }} className="text-sm leading-6">
        Your seller account has been created successfully and is waiting for
        admin approval. You will be able to access your Seller Dashboard once
        your store is approved.
      </p>
    </div>
  </div>
)}

        {authUser?.role === "ADMIN" && (
          <AdminApp
            products={products}
            orders={orders}
            users={users}
            setUsers={setUsers}
            stores={stores}
            setStores={setStores}
          />
        )}
      </div>

      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSuccess={setAuthUser} />}

      <div className="text-center py-6 text-[11px]" style={{ color: COLOR.sage }}>
        {apiStatus === "online"
          ? "Connected to the Art Écologique backend · live product catalogue."
          : apiStatus === "loading"
            ? "Connecting to the Art Écologique backend…"
            : "Backend unavailable · showing local demo products."}
      </div>
    </div>
  );
}
