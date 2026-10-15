import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  Flame,
  Info,
  Minus,
  Move3d,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { Link, useLocation, useRoute } from "wouter";
import { toast } from "sonner";

type Customization = { id: string; label: string; price: number; active: boolean };
type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  accent: string;
  tags: string[];
  available: boolean;
  dietaryVerified: boolean;
  allergensVerified: boolean;
  orderingReady: boolean;
  status: "MODEL_PARTIAL" | "IMAGE_FALLBACK" | "MODEL_UNAVAILABLE";
  ingredients: string[];
  componentImages: string[];
  customizations: Customization[];
};
type CartItem = { key: string; item: MenuItem; customizations: Customization[]; quantity: number };

const menu: MenuItem[] = [
  { id: "kfc", name: "Korean Fried Chicken", category: "Fried Chicken", description: "Crispy Korean fried chicken coated in signature seasonings and bold house flavors.", price: 24900, image: "https://koreyaki.co/images/menu/dish-1.jpg", accent: "#ff2027", tags: ["Best Seller"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "MODEL_PARTIAL", ingredients: ["Fried chicken pieces", "Crisp golden crust", "Signature seasoning layer", "House-flavor glaze", "Sesame-and-scallion garnish"], componentImages: ["/manus-storage/async-images/VuFDWd9UnWVjR42kwTkraa/image-1.webp"], customizations: [] },
  { id: "kimchi-fried-rice", name: "Kimchi Fried Rice", category: "Rice & Ramen", description: "Traditional kimchi fried rice packed with authentic Korean flavors and spices.", price: 29900, image: "https://koreyaki.co/images/menu/dish-2.jpg", accent: "#c83a2e", tags: ["Popular"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Steamed white rice base", "Fermented napa-cabbage kimchi", "Kimchi juice and chili seasoning", "Toasted sesame oil finish", "Green onion, sesame and seaweed garnish"], componentImages: ["/manus-storage/async-images/VuFDWd9UnWVjR42kwTkraa/image-2.webp"], customizations: [] },
  { id: "ramen", name: "Korean Ramen", category: "Rice & Ramen", description: "Rich Korean ramen served with flavorful broth and carefully selected toppings.", price: 34900, image: "https://koreyaki.co/images/menu/dish-3.jpg", accent: "#d7a84a", tags: ["Signature"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Curly Korean ramen noodles", "Rich seasoned broth", "Poached egg", "Kimchi and vegetables", "Scallion garnish"], componentImages: ["/manus-storage/async-images/VuFDWd9UnWVjR42kwTkraa/image-3.webp"], customizations: [] },
  { id: "bao-buns", name: "Bao Buns", category: "Bao Buns", description: "Soft steamed bao buns filled with delicious Korean-inspired fillings.", price: 29900, image: "https://koreyaki.co/images/menu/dish-4.jpg", accent: "#f0d4ba", tags: ["Chef's Pick"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Soft steamed bao wrapper", "Open folded bao pocket", "Korean-inspired filling", "Fluffy steamed finish"], componentImages: ["/manus-storage/async-images/VuFDWd9UnWVjR42kwTkraa/image-4.webp"], customizations: [] },
  { id: "tteokbokki", name: "Tteokbokki", category: "K-Sides", description: "Korean rice cakes cooked in a sweet and spicy gochujang sauce.", price: 24900, image: "https://koreyaki.co/images/menu/dish-5.jpg", accent: "#ff2027", tags: ["Popular"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Cylinder-shaped Korean rice cakes", "Sweet-and-spicy gochujang sauce", "Glossy red sauce coating", "Chopped green onion garnish", "Toasted sesame garnish"], componentImages: ["/manus-storage/async-images/BRePf25bkDtDNnWq1rD1Cq/image-1.webp"], customizations: [] },
  { id: "dumplings", name: "Dumplings", category: "K-Sides", description: "Steamed dumplings served with a savory dipping sauce.", price: 22000, image: "https://koreyaki.co/images/menu/dish-6.jpg", accent: "#a9b56b", tags: ["Best Seller"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Steamed dumpling wrapper", "Savory filling", "Pleated folded form", "Soft steam-cooked finish", "Savory dipping sauce"], componentImages: ["/manus-storage/async-images/BRePf25bkDtDNnWq1rD1Cq/image-2.webp"], customizations: [] },
  { id: "corn-dogs", name: "Corn Dogs", category: "K-Sides", description: "Golden Korean-style corn dogs with a crispy outer coating.", price: 22000, image: "https://koreyaki.co/images/menu/dish-7.jpg", accent: "#e0a14b", tags: ["Korean street food"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Wooden skewer", "Skewered savory core", "Thick batter shell", "Crispy panko-style crumb", "Golden fried finish"], componentImages: ["/manus-storage/async-images/BRePf25bkDtDNnWq1rD1Cq/image-3.webp"], customizations: [] },
  { id: "kimbap", name: "Kimbap", category: "K-Sides", description: "Fresh seaweed rice rolls filled with vegetables and signature ingredients.", price: 39900, image: "https://koreyaki.co/images/menu/dish-8.jpg", accent: "#6e9553", tags: ["Signature"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Fresh seaweed sheet wrap", "Rice layer", "Vegetable filling strips", "Signature-ingredient accents", "Rolled sliced kimbap pieces"], componentImages: ["/manus-storage/async-images/BRePf25bkDtDNnWq1rD1Cq/image-4.webp"], customizations: [] },
  { id: "katsu-ramen", name: "Katsu Ramen", category: "Rice & Ramen", description: "Hearty ramen topped with crispy katsu and rich Korean-style broth.", price: 41900, image: "https://koreyaki.co/images/menu/dish-9.jpg", accent: "#b95736", tags: ["Chef's Pick"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Rich Korean-style ramen broth", "Ramen wheat noodles", "Crispy katsu cutlet", "Green-onion garnish accent", "Soft-boiled egg accent"], componentImages: ["/manus-storage/async-images/FyhotMrqYUssNWZjb21gH7/image-1.webp"], customizations: [] },
  { id: "boba-tea", name: "Boba Tea", category: "Boba Tea", description: "Classic bubble tea available in a variety of refreshing flavors.", price: 22000, image: "https://koreyaki.co/images/menu/dish-10.jpg", accent: "#c78b67", tags: ["Refreshing"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Tea base", "Creamy body", "Refreshing flavor layer", "Chewy tapioca boba pearls", "Ice and wide boba straw"], componentImages: ["/manus-storage/async-images/FyhotMrqYUssNWZjb21gH7/image-2.webp"], customizations: [] },
  { id: "milkshake-boba", name: "Milkshake Boba", category: "Boba Tea", description: "Creamy milkshake blended with chewy boba pearls.", price: 23900, image: "https://koreyaki.co/images/menu/dish-11.jpg", accent: "#f0c4bc", tags: ["Popular"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Creamy blended milkshake base", "Chewy tapioca boba pearls", "Optional whipped-cream cap"], componentImages: ["/manus-storage/async-images/FyhotMrqYUssNWZjb21gH7/image-3.webp"], customizations: [] },
  { id: "fizzy-boba", name: "Fizzy Boba", category: "Boba Tea", description: "Sparkling fruit drink with refreshing boba pearls and vibrant flavors.", price: 18000, image: "https://koreyaki.co/images/menu/dish-12.jpg", accent: "#e4a74d", tags: ["Signature"], available: true, dietaryVerified: false, allergensVerified: false, orderingReady: false, status: "IMAGE_FALLBACK", ingredients: ["Sparkling fruit drink base", "Boba pearls", "Ice", "Vibrant fruit-flavor color", "Clear cup and wide boba straw"], componentImages: ["/manus-storage/async-images/FyhotMrqYUssNWZjb21gH7/image-4.webp"], customizations: [] },
];

const categories = ["All", "K-Sides", "Bao Buns", "Fried Chicken", "Rice & Ramen", "Boba Tea"];
const money = (minorUnits: number) => `₹${(minorUnits / 100).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

function BrandMark() {
  return <Link href="/" className="brand-mark" aria-label="Koreyaki home"><span className="brand-dot">◆</span><span>koreyaki</span></Link>;
}

function Dish3DCanvas({ item, builtCount, exploded, rotation, zoom, onRotate }: { item: MenuItem; builtCount: number; exploded: boolean; rotation: number; zoom: number; onRotate: (value: number) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<number | null>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight), 0.1, 100);
    camera.position.set(0, 1.35, 7.2 / zoom);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.replaceChildren(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xffd6c0, 0x160b0d, 2.1));
    const key = new THREE.DirectionalLight(0xff5a50, 3.2); key.position.set(3, 5, 4); key.castShadow = true; scene.add(key);
    const fill = new THREE.PointLight(0x8b1724, 2.4, 14); fill.position.set(-4, 1, 2); scene.add(fill);
    const dish = new THREE.Group(); dish.rotation.y = THREE.MathUtils.degToRad(rotation); scene.add(dish);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.35, 0.16, 64), new THREE.MeshStandardMaterial({ color: 0x171316, metalness: .5, roughness: .28 }));
    plate.position.y = -0.12; plate.receiveShadow = true; dish.add(plate);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.35, .075, 14, 64), new THREE.MeshStandardMaterial({ color: 0xa72b37, metalness: .7, roughness: .24 })); rim.position.y = -.02; dish.add(rim);
    const palette = [0xd44934, 0xe7a44a, 0xf0d6b5, 0x9aa85f, 0x6d1d26];
    const accent = new THREE.Color(item.accent);
    const makeMaterial = (index: number) => new THREE.MeshStandardMaterial({ color: index === 0 ? accent : palette[index % palette.length], roughness: .42, metalness: .08 });
    const makePart = (ingredient: string, index: number) => {
      const lower = ingredient.toLowerCase();
      const material = makeMaterial(index);
      let mesh: THREE.Object3D;
      if (/noodle|ramen/.test(lower)) mesh = new THREE.Mesh(new THREE.TorusGeometry(1.35, .18, 12, 40), material);
      else if (/boba|pearl/.test(lower)) { const group = new THREE.Group(); for (let i = 0; i < 9; i++) { const pearl = new THREE.Mesh(new THREE.SphereGeometry(.1, 16, 16), material); pearl.position.set((i % 3 - 1) * .35, Math.floor(i / 3) * .14, (i % 2) * .12); group.add(pearl); } mesh = group; }
      else if (/sauce|broth|tea|milkshake|drink|glaze|coating/.test(lower)) mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.55 - index * .12, 1.72 - index * .12, .26, 48), material);
      else if (/egg/.test(lower)) { mesh = new THREE.Mesh(new THREE.SphereGeometry(.6, 28, 20), material); mesh.scale.set(1.15, .22, 1.15); }
      else if (/garnish|sesame|scallion|onion|seaweed|straw/.test(lower)) { const group = new THREE.Group(); for (let i = 0; i < 7; i++) { const garnish = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 12), material); garnish.position.set((i - 3) * .33, (i % 2) * .12, (i % 3 - 1) * .22); group.add(garnish); } mesh = group; }
      else if (/bao|dumpling|cake|katsu|chicken|corn|rice/.test(lower)) { mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), material); mesh.scale.set(1.35, .34, .9); }
      else mesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, .28, 1.4), material);
      mesh.position.y = exploded ? .18 + index * .56 : .18 + index * .18;
      mesh.position.x = exploded ? Math.sin(index * 1.4) * .22 : 0;
      mesh.rotation.y = index * .32;
      mesh.castShadow = true;
      dish.add(mesh);
    };
    item.ingredients.slice(0, builtCount).forEach(makePart);
    const resize = () => { if (!mount) return; camera.aspect = Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight); camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); };
    window.addEventListener("resize", resize);
    let frame = 0; const render = () => { frame = requestAnimationFrame(render); renderer.render(scene, camera); }; render();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); renderer.dispose(); mount.replaceChildren(); };
  }, [item, builtCount, exploded, rotation, zoom]);
  return <div className="dish-3d-canvas" ref={mountRef} onPointerDown={event => { dragRef.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={event => { if (dragRef.current === null) return; const delta = event.clientX - dragRef.current; dragRef.current = event.clientX; onRotate(rotation + delta * .65); }} onPointerUp={() => { dragRef.current = null; }} onPointerLeave={() => { dragRef.current = null; }}><span className="webgl-badge"><Move3d size={12} /> 360° drag</span></div>;
}

function DishOrbit({ item, exploded, setExploded }: { item: MenuItem; exploded: boolean; setExploded: (v: boolean) => void }) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [builtCount, setBuiltCount] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const allBuilt = builtCount >= item.ingredients.length;
  const addNext = () => { if (!allBuilt) { setBuiltCount(count => count + 1); setAssembled(false); setExploded(true); } else { setAssembled(true); setExploded(false); } };
  const resetBuild = () => { setBuiltCount(0); setAssembled(false); setExploded(true); setRotation(0); setZoom(1); };
  return (
    <div className="dish-experience">
      <div className="dish-toolbar"><span className="eyebrow"><Move3d size={14} /> build view · {item.name}</span><span className="asset-state"><span className="status-dot" /> {builtCount}/{item.ingredients.length} components added</span></div>
      <div className="build-next"><span>{allBuilt ? "All components are in." : `Next component: ${item.ingredients[builtCount]}`}</span><button className="button button-primary" onClick={addNext}>{allBuilt ? "Assemble dish" : `Add ${item.ingredients[builtCount]}`} <Plus size={15} /></button></div>
      <div className="dish-stage"><Dish3DCanvas item={item} builtCount={builtCount} exploded={exploded} rotation={rotation} zoom={zoom} onRotate={setRotation} /><div className="stage-caption"><span>drag to rotate</span><span>•</span><span>{assembled ? "final plate" : builtCount === 0 ? "start with the first component" : "component added"}</span></div></div>
      <div className="dish-controls"><button onClick={() => setRotation(rotation - 18)} aria-label="Rotate left"><ChevronLeft size={18} /></button><button onClick={() => { setAssembled(false); setExploded(!exploded); }} className={exploded ? "active" : ""}>{exploded ? "Assemble" : "Explode dish"}</button><button onClick={() => setRotation(rotation + 18)} aria-label="Rotate right"><ChevronRight size={18} /></button><button onClick={() => setZoom(Math.min(1.2, zoom + 0.1))} aria-label="Zoom in"><Plus size={16} /></button><button onClick={() => setZoom(Math.max(.82, zoom - 0.1))} aria-label="Zoom out"><Minus size={16} /></button><button onClick={resetBuild} aria-label="Reset build"><RotateCcw size={16} /></button></div>
      <div className="burst-ingredients">{item.ingredients.map((ingredient, index) => <button className={index < builtCount ? "added" : ""} onClick={() => index === builtCount && addNext()} key={ingredient}><b>{String(index + 1).padStart(2, "0")}</b>{ingredient}{index < builtCount ? " ✓" : index === builtCount ? " +" : ""}</button>)}</div>
      <div className="dish-note"><Info size={15} /><span>Selecting a dish resets its build. Add components one by one to construct the selected dish, then assemble it when every layer is in place.</span></div>
    </div>
  );
}

function Configurator({ item, onClose, onAdd }: { item: MenuItem; onClose: () => void; onAdd: (item: MenuItem, customizations: Customization[], quantity: number) => void }) {
  const [selected, setSelected] = useState(item.customizations.map(c => ({ ...c })));
  const [quantity, setQuantity] = useState(1);
  const [exploded, setExploded] = useState(false);
  const total = item.price + selected.filter(c => c.active).reduce((sum, c) => sum + c.price, 0);
  const toggleOption = (id: string) => setSelected(selected.map(option => option.id === id ? { ...option, active: !option.active } : option));
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${item.name} configurator`}><div className="configurator"><button className="modal-close" onClick={onClose} aria-label="Close configurator"><X /></button><div className="config-visual"><img src={item.image} alt="" /><span className="preview-pill"><Sparkles size={13} /> Preview pricing</span></div><div className="config-copy"><span className="eyebrow">{item.category} / configure your plate</span><h2>{item.name}</h2><p>{item.description}</p><div className="ingredient-row">{item.ingredients.map(i => <span key={i}>{i}</span>)}</div><div className="config-section"><div className="section-label"><span>Make it yours</span><small>Available options</small></div>{selected.map(option => <button key={option.id} className={`option-row ${option.active ? "selected" : ""}`} onClick={() => toggleOption(option.id)}><span><span className="option-check">{option.active ? "✓" : ""}</span>{option.label}</span><span>{option.price ? `+${money(option.price)}` : "Included"}</span></button>)}</div><div className="price-summary"><span><small>Base</small>{money(item.price)}</span><span><small>Adjustments</small>{money(total - item.price)}</span><strong><small>Preview total</small>{money(total * quantity)}</strong></div><div className="config-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div><button className="button button-primary" disabled={!item.available} onClick={() => { if (!item.available) return; onAdd(item, selected, quantity); onClose(); }}>{item.available ? `Add to cart · ${money(total * quantity)}` : "Currently unavailable"}<ArrowUpRight size={16} /></button></div><button className="text-button" onClick={() => setSelected(item.customizations.map(c => ({ ...c, active: false })))}>Reset options <RotateCcw size={14} /></button><div className="config-footnote"><CircleHelp size={15} /> Final availability and pricing are confirmed by Koreyaki at order handoff.</div></div><div className="config-3d"><DishOrbit item={item} exploded={exploded} setExploded={setExploded} /></div></div></div>;
}

function Assistant({ onClose, onOpenDish }: { onClose: () => void; onOpenDish: (item: MenuItem) => void }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Annyeong — I can guide you through Koreyaki’s verified menu, flavors and customization options. What are you in the mood for?" }]);
  const [input, setInput] = useState("");
  const suggestions = ["What’s good for spice lovers?", "Show me a comforting bowl", "What can I customize?", "Where are you?", "What are your hours?"];
  const respond = (text: string) => { const lower = text.toLowerCase(); let reply = "I can help with the dishes, available options, and the Koreyaki visit experience. For allergy or cross-contact questions, please call the restaurant directly so the team can confirm safely."; if (lower.includes("spice")) reply = "For a bold, sweet-spicy direction, try Tteokbokki or Korean Fried Chicken. The menu preview currently lists an extra-spicy option for Tteokbokki; the restaurant should confirm the exact heat level."; if (lower.includes("bowl") || lower.includes("comfort")) reply = "Seoul Ramen is the warm, comforting bowl: noodles, broth, greens and a soft egg. You can add an extra egg or extra noodles in the configurator."; if (lower.includes("custom")) reply = "The current preview supports add-ons and ingredient adjustments on every listed dish. Open a dish to see the item-specific options and preview total."; if (lower.includes("hour") || lower.includes("open") || lower.includes("time")) reply = "Koreyaki is listed as open every day from 1:30 PM to 10:30 PM. The restaurant can confirm same-day availability at +91 95918 11065."; if (lower.includes("where") || lower.includes("location") || lower.includes("address")) reply = "Koreyaki is at 11th Main Road, HAL 2nd Stage, Appareddipalya, Indiranagar, Bengaluru, Karnataka 560008."; setMessages([...messages, { role: "user", text }, { role: "assistant", text: reply }]); setInput(""); };
  return <div className="assistant-panel"><div className="assistant-head"><div><span className="eyebrow"><Sparkles size={14} /> Koreyaki guide</span><h3>Ask about the menu</h3></div><button onClick={onClose} aria-label="Close assistant"><X /></button></div><div className="assistant-messages">{messages.map((message, i) => <div key={i} className={`assistant-message ${message.role}`}>{message.text}</div>)}</div><div className="assistant-suggestions">{suggestions.map(s => <button key={s} onClick={() => respond(s)}>{s}</button>)}</div><div className="assistant-input"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input.trim() && respond(input)} placeholder="Ask about a dish…" aria-label="Ask Koreyaki guide" /><button onClick={() => input.trim() && respond(input)} aria-label="Send"><Send size={17} /></button></div><button className="assistant-dish-link" onClick={() => onOpenDish(menu[0])}>Explore our signature dish <ArrowUpRight size={15} /></button></div>;
}

function Header({ cartCount, onAssistant }: { cartCount: number; onAssistant: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header"><div className="header-inner"><BrandMark /><nav className="desktop-nav"><Link href="/menu">Menu</Link><a href="/#experience">3D experience</a><a href="/#story">Our story</a><a href="/#visit">Visit us</a></nav><div className="header-actions"><button className="assistant-trigger" onClick={onAssistant}><Sparkles size={15} /> Ask Koreyaki</button><Link href="/cart" className="cart-link"><ShoppingBag size={17} /><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}</Link><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation"><ChevronDown size={18} /></button></div></div>{menuOpen && <nav className="mobile-nav"><Link href="/menu">Menu</Link><a href="/#experience">3D experience</a><a href="/#story">Our story</a><a href="/#visit">Visit us</a></nav>}</header>;
}

function Footer() { return <footer className="site-footer"><div><BrandMark /><p>Authentic Korean comfort, served with a little curiosity.</p></div><div className="footer-links"><div><span>Explore</span><Link href="/menu">Menu</Link><a href="/#experience">3D experience</a><a href="/#story">Our story</a></div><div><span>Visit</span><a href="tel:+919591811065">+91 95918 11065</a><a href="mailto:info@koreyaki.in">info@koreyaki.in</a><a href="https://wa.me/919591811065" target="_blank" rel="noreferrer">WhatsApp reservations</a><span>Daily · 1:30 PM — 10:30 PM</span></div></div><div className="footer-bottom"><span>© 2026 Koreyaki</span><span>Menu preview · restaurant confirmation at handoff</span></div></footer>; }

function AdminPanel() { return <main className="admin-page container"><span className="eyebrow">Staff workspace</span><h1>Keep the <em>layers</em> honest.</h1><p className="admin-lede">The operational dashboard is intentionally gated until Koreyaki’s menu source, ordering provider and staff authentication are connected. This page documents the readiness surface without exposing public admin actions.</p><div className="admin-grid">{[{ label: "Menu source", state: "Pending restaurant feed", icon: Search }, { label: "3D asset registry", state: "1 partial · 5 pending", icon: Move3d }, { label: "Ordering provider", state: "WhatsApp handoff", icon: ShoppingBag }, { label: "AI content", state: "Grounded preview", icon: Sparkles }].map(({ label, state, icon: Icon }) => <div className="admin-card" key={label}><Icon size={18} /><span>{label}</span><strong>{state}</strong></div>)}</div><div className="admin-callout"><Info size={16} /><span>Connect an authenticated staff account before enabling menu edits, asset uploads, order status changes or AI content management.</span></div></main>; }

function MenuCard({ item, onOpen }: { item: MenuItem; onOpen: (item: MenuItem) => void }) { const [quantity, setQuantity] = useState(1); return <article className="menu-card"><button className="menu-image" onClick={() => item.available && onOpen(item)} disabled={!item.available}><img src={item.image} alt={item.name} /><span className="card-arrow"><ArrowUpRight size={16} /></span></button><div className="menu-card-copy"><div className="card-meta"><span>{item.category}</span>{item.available ? <span className="available">Available</span> : <span>Unavailable</span>}</div><div className="card-title-row"><h3>{item.name}</h3><strong>{money(item.price)}</strong></div><p>{item.description}</p><span className="card-tag">{item.tags[0] || "KOREYAKI"}</span><div className="card-order-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={13} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={13} /></button></div><a className="whatsapp-button" href={item.available ? `https://wa.me/919591811065?text=${encodeURIComponent(`Hi Koreyaki, I would like to order ${quantity} x ${item.name}.`)}` : undefined} target="_blank" rel="noreferrer" aria-disabled={!item.available}><span>◔</span> Order on WhatsApp</a></div></div></article>; }

function CartAssembly({ line }: { line: CartItem }) {
  const [builtCount, setBuiltCount] = useState(0);
  const activeCustomizations = line.customizations.filter(customization => customization.active);
  useEffect(() => { setBuiltCount(0); const timer = window.setInterval(() => setBuiltCount(count => { if (count >= line.item.ingredients.length) { window.clearInterval(timer); return count; } return count + 1; }), 900); return () => window.clearInterval(timer); }, [line.key, line.item.ingredients.length]);
  const replay = () => { setBuiltCount(0); };
  const addNext = () => setBuiltCount(count => Math.min(line.item.ingredients.length, count + 1));
  return <div className="cart-assembly"><div className="cart-assembly-stage"><img src={line.item.image} alt="" />{builtCount > 0 ? <div className="cart-photo-stack">{line.item.componentImages.length === 1 ? <div className="cart-photo-layer cart-photo-layer-single"><img src={line.item.componentImages[0]} alt={`Cooked exploded ${line.item.name}`} /><span><b>{builtCount}/{line.item.ingredients.length}</b>{line.item.ingredients.slice(0, builtCount).join(" · ")}</span></div> : line.item.ingredients.slice(0, builtCount).map((ingredient, index) => <div className="cart-photo-layer" key={ingredient}><img src={line.item.componentImages[index % line.item.componentImages.length] || line.item.image} alt={`${ingredient} in ${line.item.name}`} /><span><b>{String(index + 1).padStart(2, "0")}</b>{ingredient}</span></div>)}</div> : <span className="cart-empty-build">Start assembly</span>}</div><div className="cart-build-status"><span><b>{builtCount}/{line.item.ingredients.length}</b> components assembled</span><div className="cart-build-actions"><button onClick={addNext} disabled={builtCount >= line.item.ingredients.length}>{builtCount >= line.item.ingredients.length ? "Dish complete" : `Add ${line.item.ingredients[builtCount]}`}</button><button onClick={replay}><RotateCcw size={12} /> Replay</button></div></div><div className="cart-component-list">{line.item.ingredients.map((ingredient, index) => <button className={index < builtCount ? "built" : "pending"} onClick={() => index === builtCount && addNext()} key={ingredient}><b>{String(index + 1).padStart(2, "0")}</b>{ingredient}{index < builtCount ? " ✓" : index === builtCount ? " +" : ""}</button>)}</div>{activeCustomizations.length > 0 && <div className="cart-customizations"><span className="eyebrow">Your custom build</span>{activeCustomizations.map(customization => <span key={customization.id}><Sparkles size={11} /> {customization.label}{customization.price ? ` · +${money(customization.price)}` : ""}</span>)}</div>}</div>;
}

function CartPanel({ cart, setCart, onBrowse }: { cart: CartItem[]; setCart: (items: CartItem[]) => void; onBrowse: () => void }) { const subtotal = cart.reduce((sum, line) => sum + (line.item.price + line.customizations.filter(c => c.active).reduce((s, c) => s + c.price, 0)) * line.quantity, 0); return <section className="cart-page container"><div className="section-kicker"><span className="eyebrow">Your dish, assembled</span><h1>Cart <span>{cart.length ? `(${cart.reduce((s, l) => s + l.quantity, 0)})` : ""}</span></h1><p className="cart-intro">Every order is rebuilt here component by component, including the changes you made in the burst view.</p></div>{cart.length === 0 ? <div className="empty-cart"><div className="empty-mark">✦</div><h2>Your cart is waiting for a good idea.</h2><p>Explore the menu, find your craving and build a plate that feels like yours.</p><button className="button button-primary" onClick={onBrowse}>Explore the menu <ArrowUpRight size={16} /></button></div> : <div className="cart-layout"><div className="cart-lines">{cart.map(line => { const linePrice = line.item.price + line.customizations.filter(c => c.active).reduce((s, c) => s + c.price, 0); return <div className="cart-line" key={line.key}><CartAssembly line={line} /><div className="cart-line-main"><span className="eyebrow">{line.item.category}</span><h3>{line.item.name}</h3><p>{line.item.description}</p><div className="cart-line-actions"><div className="quantity"><button onClick={() => setCart(cart.map(c => c.key === line.key ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c))}><Minus size={14} /></button><span>{line.quantity}</span><button onClick={() => setCart(cart.map(c => c.key === line.key ? { ...c, quantity: c.quantity + 1 } : c))}><Plus size={14} /></button></div><button className="remove" onClick={() => setCart(cart.filter(c => c.key !== line.key))}>Remove</button></div></div><strong>{money(linePrice * line.quantity)}</strong></div> })}</div><aside className="order-summary"><span className="eyebrow">Order summary</span><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Taxes & delivery</span><span className="muted">Confirmed at handoff</span></div><hr /><div className="summary-total"><span>Preview total</span><strong>{money(subtotal)}</strong></div><a className="button button-primary" href="https://wa.me/919591811065" target="_blank" rel="noreferrer">Continue with Koreyaki <ArrowUpRight size={16} /></a><p className="summary-note"><Info size={14} /> No payment is collected here. Koreyaki confirms availability, final pricing and the ordering method directly.</p></aside></div>}</section>; }

function Home() {
  const [location, navigate] = useLocation();
  const [, params] = useRoute("/dish/:id");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [assistant, setAssistant] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem("koreyaki-cart") || "[]"); } catch { return []; } });
  useEffect(() => localStorage.setItem("koreyaki-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => { if (params?.id) setSelected(menu.find(item => item.id === params.id) || null); }, [params?.id]);
  const filtered = useMemo(() => menu.filter(item => (category === "All" || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const addToCart = (item: MenuItem, customizations: Customization[], quantity: number) => { if (!item.available) { toast.info("Currently unavailable", { description: "This dish cannot be added until Koreyaki marks it available." }); return; } const key = `${item.id}-${customizations.filter(c => c.active).map(c => c.id).join("-") || "original"}`; if (cart.some(line => line.key === key)) setCart(cart.map(line => line.key === key ? { ...line, quantity: line.quantity + quantity } : line)); else setCart([...cart, { key, item, customizations, quantity }]); toast.success(`${item.name} added to your cart`, { description: "Preview pricing saved with your configuration." }); };
  const openDish = (item: MenuItem) => { setSelected(item); if (location !== "/") navigate(`/dish/${item.id}`); };
  const home = location === "/";
  const cartPage = location === "/cart";
  const adminPage = location === "/admin";
  const invalidDish = location.startsWith("/dish/") && !selected;
  return <div className="app-shell"><Header cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)} onAssistant={() => setAssistant(true)} />
    {cartPage ? <CartPanel cart={cart} setCart={setCart} onBrowse={() => navigate("/menu")} /> : adminPage ? <AdminPanel /> : invalidDish ? <main className="cart-page container"><div className="empty-cart"><div className="empty-mark"><CircleHelp /></div><h2>That dish is not in the menu.</h2><p>Return to the menu to explore the dishes Koreyaki has shared for this preview.</p><Link className="button button-primary" href="/menu">Back to menu <ArrowUpRight size={16} /></Link></div></main> : <>
      {home && <>
        <main>
          <section className="hero container"><div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line" /> korean restaurant · indiranagar</span><h1>Authentic<br /><em>Korean</em><br /><em>Flavours.</em></h1><p className="hero-lede">Experience the true taste of Korea at Koreyaki. From sizzling Korean BBQ and crispy Korean fried chicken to comforting ramen, bibimbap, dumplings, and refreshing bubble tea, every dish is prepared with authentic ingredients and bold flavors.</p><div className="hero-actions"><a className="button button-primary" href="https://wa.me/919591811065" target="_blank" rel="noreferrer">Reserve a table <ArrowUpRight size={16} /></a><Link className="button button-quiet" href="/menu">Explore menu <ArrowUpRight size={16} /></Link></div><div className="hero-proof"><span><strong>4.1★</strong> Google rating</span><span><strong>50+</strong> Korean dishes</span><span><strong>Daily</strong> 1:30 — 10:30</span></div></div><div className="hero-visual"><div className="hero-image-wrap"><img src="/manus-storage/async-images/1k6SdpZ89C8LbsKDI1kpLB/image-1.webp" alt="Korean fried chicken with bold gochujang glaze" /><div className="hero-image-label"><span>signature Korean cuisine</span><strong>Bold flavours, made fresh.</strong></div></div></div></section>
          <section className="ticker"><div>AUTHENTIC FLAVOURS</div><div>FRESHLY PREPARED</div><div>MADE TO SHARE</div><div>INDIRANAGAR, BENGALURU</div></section>
          <section className="featured-section container" id="experience"><div className="section-heading"><div><span className="eyebrow">The Koreyaki way</span><h2>See what you’re<br /><em>about to crave.</em></h2></div><p>Every dish has a story in its layers. Start with a close-up, then explore what goes into the bowl, the glaze and the bite.</p></div><div className="experience-grid"><div className="experience-copy"><span className="index-number">01</span><h3>Uncover the <em>composition.</em></h3><p>Our signature preview separates the dish into meaningful layers so you can see the balance of base, protein and garnish before you order.</p><button className="button button-dark" onClick={() => openDish(menu[0])}>Explore the dish <ArrowUpRight size={16} /></button><div className="experience-stats"><span><strong>01</strong> layered preview</span><span><strong>∞</strong> ways to make it yours</span></div></div><DishOrbit item={menu[0]} exploded={exploded} setExploded={setExploded} /></div></section>
          <section className="menu-preview container" id="menu"><div className="section-heading compact"><div><span className="eyebrow">From the menu</span><h2>A little <em>something</em><br />for every mood.</h2></div><Link className="text-link" href="/menu">View full menu <ArrowUpRight size={15} /></Link></div><div className="menu-grid">{menu.slice(0, 3).map(item => <MenuCard item={item} key={item.id} onOpen={openDish} />)}</div></section>
          <section className="story-section container" id="story"><div className="story-photo"><img src="/manus-storage/async-images/1k6SdpZ89C8LbsKDI1kpLB/image-3.webp" alt="Korean ramen in a dark stone bowl" /><span>02 / our story</span></div><div className="story-copy"><span className="eyebrow">Made in Indiranagar</span><h2>Tradition,<br /><em>without the fuss.</em></h2><p>Koreyaki brings the rich flavours and traditions of Korea to the heart of Indiranagar. From comforting street-food favourites to classic specialties, every plate is prepared with quality ingredients and a deep respect for the original.</p><p>Whether you’re discovering Korean food for the first time or you already know your go-to, there’s always another layer to find.</p><a href="#visit" className="text-link">Find your way to us <ArrowUpRight size={15} /></a></div></section>
        </main>
        <section className="visit-band" id="visit"><div className="container visit-inner"><div><span className="eyebrow">Come hungry</span><h2>Meet us in<br /><em>Indiranagar.</em></h2></div><div className="visit-details"><div><Clock3 size={17} /><span><strong>Open every day</strong>1:30 PM — 10:30 PM</span></div><div><Zap size={17} /><span><strong>HAL 2nd Stage</strong>11th Main Road, Bengaluru 560008</span></div><div><ShoppingBag size={17} /><span><strong>Reserve a table</strong><a href="tel:+919591811065">+91 95918 11065</a></span></div></div></div></section>
      </>}
      {location === "/menu" && <main className="menu-page container"><div className="menu-page-head"><div><span className="eyebrow">The full spread</span><h1>Choose your <em>craving.</em></h1><p>Browse the Koreyaki preview menu. Open any dish to explore its ingredients, options and live preview total.</p></div><div className="menu-note"><Info size={16} /> Prices and availability shown here are preview data pending a direct restaurant menu feed.</div></div><div className="menu-controls"><div className="search-box"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search dishes…" aria-label="Search dishes" /></div><div className="category-tabs">{categories.map(c => <button className={category === c ? "active" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}</div></div><div className="menu-grid full-menu">{filtered.map(item => <MenuCard key={item.id} item={item} onOpen={openDish} />)}</div>{filtered.length === 0 && <div className="empty-cart"><div className="empty-mark"><Search /></div><h2>No dish found.</h2><p>Try another search or return to all categories.</p><button className="button button-primary" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}</main>}
    </>}
    <Footer /><button className="floating-assistant" onClick={() => setAssistant(true)} aria-label="Open Koreyaki assistant"><Sparkles size={18} /><span>Ask Koreyaki</span></button>{assistant && <Assistant onClose={() => setAssistant(false)} onOpenDish={openDish} />}{selected && <Configurator item={selected} onClose={() => { setSelected(null); if (location.startsWith("/dish/")) navigate("/menu"); }} onAdd={addToCart} />}
  </div>;
}

export default Home;
