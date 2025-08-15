// mossewear — main app
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Data produk (maks 5 untuk slider)
const PRODUCTS = [
  { id:'mw-top-01', name:'Mosse Knit Top', price: 219000, img:'assets/img/prod-top.svg' },
  { id:'mw-dress-01', name:'Soft A-Line Dress', price: 349000, img:'assets/img/prod-dress.svg' },
  { id:'mw-pants-01', name:'Pastel Straight Pants', price: 279000, img:'assets/img/prod-pants.svg' },
  { id:'mw-cardigan-01', name:'Ivory Flow Cardigan', price: 299000, img:'assets/img/prod-cardigan.svg' },
  { id:'mw-bag-01', name:'Mini Sling Bag', price: 199000, img:'assets/img/prod-bag.svg' },
];

// Currency formatter
const rupiah = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n);

// Nav menu (mobile)
(() => {
  const btn = $('#navToggle');
  const menu = $('#navMenu');
  if(!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.style.display === 'flex';
    menu.style.display = open ? 'none' : 'flex';
    btn.setAttribute('aria-expanded', String(!open));
  });
})();

// Render slider
(() => {
  const track = $('#sliderTrack');
  if(!track) return;
  PRODUCTS.slice(0,5).forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media"><img src="${p.img}" alt="${p.name}" width="220" height="165"></div>
      <h3 class="product-title">${p.name}</h3>
      <p class="product-price">${rupiah(p.price)}</p>
      <div class="qty-row">
        <input type="number" min="1" value="1" aria-label="Jumlah" />
        <button class="btn btn-secondary add-btn" data-id="${p.id}">Tambahkan ke Keranjang</button>
      </div>
    `;
    track.appendChild(card);
  });

  let index = 0;
  const prev = $('#sliderPrev');
  const next = $('#sliderNext');
  const scrollToIndex = () => {
    const card = track.children[0];
    if(!card) return;
    const width = card.getBoundingClientRect().width + 16; // gap
    track.scrollTo({ left: index * width, behavior:'smooth' });
  };
  prev.addEventListener('click', () => { index = Math.max(0, index - 1); scrollToIndex(); });
  next.addEventListener('click', () => { index = Math.min(track.children.length-1, index + 1); scrollToIndex(); });

  track.addEventListener('wheel', (e) => { if (Math.abs(e.deltaY) > 0) { e.preventDefault(); track.scrollLeft += e.deltaY; }}, { passive:false });
})();

// CART
const CART_KEY = 'mw_cart_v1';
const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));
const updateCartCount = () => {
  const count = loadCart().reduce((a, it) => a + it.qty, 0);
  $('#cartCount').textContent = count;
};

const addToCart = (id, qty=1) => {
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  const items = loadCart();
  const existing = items.find(x => x.id === id);
  if(existing) existing.qty += qty;
  else items.push({ id:p.id, name:p.name, price:p.price, img:p.img, qty });
  saveCart(items);
  updateCartCount();
  renderCartItems();
};

const removeFromCart = (id) => {
  let items = loadCart().filter(x => x.id !== id);
  saveCart(items);
  updateCartCount();
  renderCartItems();
};

const clearCart = () => { saveCart([]); updateCartCount(); renderCartItems(); };

const renderCartItems = () => {
  const list = $('#cartItems');
  const items = loadCart();
  list.innerHTML = '';
  let total = 0;
  items.forEach(it => {
    total += it.price * it.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div>
        <div class="cart-item-title">${it.name}</div>
        <div class="cart-item-qty">${it.qty} x ${rupiah(it.price)}</div>
      </div>
      <button class="icon-btn" aria-label="Hapus" data-remove="${it.id}">🗑️</button>
    `;
    list.appendChild(li);
  });
  $('#cartTotal').textContent = rupiah(total);
  // sync checkout draft for checkout.html
  localStorage.setItem('mw_checkout_draft', JSON.stringify({ items, total }));
};

document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.add-btn');
  if(addBtn){
    const id = addBtn.dataset.id;
    const card = addBtn.closest('.product-card');
    const qtyInput = card.querySelector('input[type="number"]');
    const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
    addToCart(id, qty);
  }
  const removeBtn = e.target.closest('[data-remove]');
  if(removeBtn){
    removeFromCart(removeBtn.dataset.remove);
  }
});

// Cart drawer open/close
(() => {
  const drawer = $('#cartDrawer');
  const openBtn = $('#openCart');
  const closeBtn = $('#closeCart');
  const backdrop = $('#cartBackdrop');
  const clearBtn = $('#clearCart');

  const open = () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); };
  const close = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  clearBtn.addEventListener('click', clearCart);
})();

// Testimonials
const TESTI_KEY = 'mw_testi_v1';
const presetTesti = [
  { name:'Nadia', rating:5, text:'Bahan adem & potongan rapi. Suka banget!' },
  { name:'Ira', rating:4, text:'Warnanya lembut, cocok buat daily wear.' },
  { name:'Vina', rating:5, text:'Service cepat, packing rapi, recommended.' },
];
const loadTesti = () => {
  let data = JSON.parse(localStorage.getItem(TESTI_KEY) || 'null');
  if(!data){ data = presetTesti; localStorage.setItem(TESTI_KEY, JSON.stringify(data)); }
  return data;
};
const saveTesti = (d) => localStorage.setItem(TESTI_KEY, JSON.stringify(d));
const renderTesti = () => {
  const list = $('#testiList');
  list.innerHTML = '';
  loadTesti().forEach(t => {
    const li = document.createElement('li');
    li.className = 'testi-item';
    li.innerHTML = `
      <div class="stars">${'⭐️'.repeat(t.rating)}</div>
      <p class="testi-text">“${t.text}”</p>
      <p class="testi-name">— ${t.name}</p>
    `;
    list.appendChild(li);
  });
};

$('#testiForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#testiName').value.trim();
  const rating = parseInt($('#testiRating').value, 10);
  const text = $('#testiText').value.trim();
  if(!name || !text) return;
  const next = [...loadTesti(), { name, rating, text }];
  saveTesti(next);
  renderTesti();
  e.target.reset();
  alert('Terima kasih! Testimoni Anda sudah ditambahkan ✨');
});

// Kritik & Saran
const SARAN_KEY = 'mw_saran_v1';
const loadSaran = () => JSON.parse(localStorage.getItem(SARAN_KEY) || '[]');
const saveSaran = (d) => localStorage.setItem(SARAN_KEY, JSON.stringify(d));
const renderSaran = () => {
  const list = $('#saranList');
  list.innerHTML = '';
  loadSaran().forEach(s => {
    const li = document.createElement('li');
    li.className = 'saran-item';
    li.innerHTML = `
      <div class="saran-meta">${new Date(s.date).toLocaleString('id-ID')} ${s.name ? ' • ' + s.name : ''} ${s.email ? ' • ' + s.email : ''}</div>
      <div>${s.text}</div>
    `;
    list.appendChild(li);
  });
};

$('#saranForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#saranNama').value.trim();
  const email = $('#saranEmail').value.trim();
  const text = $('#saranIsi').value.trim();
  if(!text) return;
  const next = [...loadSaran(), { name, email, text, date: Date.now() }];
  saveSaran(next);
  renderSaran();
  e.target.reset();
  alert('Terima kasih atas masukannya! 💌');
});

// Footer year
$('#year').textContent = new Date().getFullYear();

// Initial renders
updateCartCount();
renderCartItems();
renderTesti();
renderSaran();
