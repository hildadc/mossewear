// Mossewear — app.js
const PRODUCTS = [
  {id:1,name:"Cardigan Cozy Blue",price:179000, img:"assets/svg/product-1.svg", bestseller: true},
  {id:2,name:"Sweater Rib Rose",price:199000, img:"assets/svg/product-2.svg", bestseller: true},
  {id:3,name:"Cardigan Ivory Knit",price:159000, img:"assets/svg/product-3.svg", bestseller: false},
  {id:4,name:"Oversized Hoodie Blue",price:219000, img:"assets/svg/product-4.svg", bestseller: true},
  {id:5,name:"Slim Fit Sweater",price:189000, img:"assets/svg/product-5.svg", bestseller: true},
  {id:6,name:"Basic Cardigan",price:129000, img:"assets/svg/product-6.svg", bestseller: false},
];

const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

// Utilities
function rupiah(v){ return "Rp"+v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
function saveTestimonials(list){ localStorage.setItem('mosse_testimonials', JSON.stringify(list)); }
function loadTestimonials(){ return JSON.parse(localStorage.getItem('mosse_testimonials')||'[]'); }
function saveCart(cart){ localStorage.setItem('mosse_cart', JSON.stringify(cart)); }
function loadCart(){ return JSON.parse(localStorage.getItem('mosse_cart')||'[]'); }

// Render products grid
function renderProducts(){
  const grid = qs('#products-grid');
  grid.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'product card';
    el.innerHTML = `
      <img src="\${p.img}" alt="\${p.name}">
      <div><strong>\${p.name}</strong></div>
      <div class="price">\${rupiah(p.price)}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="add-to-cart" data-id="\${p.id}">Tambah Keranjang</button>
        <button class="buy-now primary" data-id="\${p.id}">Checkout</button>
      </div>
    `;
    grid.appendChild(el);
  });
  qsa('.add-to-cart').forEach(btn=> btn.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    addToCart(id,1);
  }));
  qsa('.buy-now').forEach(btn=> btn.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    addToCart(id,1);
    openCart();
    qs('#checkout-btn').click();
  }));
}

// Slider best sellers (max 5)
function renderSlider(){
  const slider = qs('#best-seller-slider');
  const sellers = PRODUCTS.filter(p=>p.bestseller).slice(0,5);
  let idx = 0;
  const holder = document.createElement('div');
  holder.className = 'slides';
  function show(i){
    holder.innerHTML = '';
    const p = sellers[i];
    const s = document.createElement('div');
    s.className = 'slide';
    s.innerHTML = `<img src="\${p.img}" alt="\${p.name}"><div><h4>\${p.name}</h4><p class="price">\${rupiah(p.price)}</p><button class="add-to-cart" data-id="\${p.id}">Tambah Keranjang</button></div>`;
    holder.appendChild(s);
    qsa('.add-to-cart').forEach(btn=> btn.addEventListener('click', e=>{
      const id = Number(e.currentTarget.dataset.id);
      addToCart(id,1);
    }));
  }
  slider.prepend(holder);
  show(idx);
  qs('.prev').addEventListener('click', ()=> { idx = (idx-1 + sellers.length)%sellers.length; show(idx); });
  qs('.next').addEventListener('click', ()=> { idx = (idx+1) % sellers.length; show(idx); });
}

// Cart functions
function updateCartCount(){
  const cart = loadCart();
  qs('#cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
}
function addToCart(id,qty){
  const cart = loadCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty += qty; else cart.push({id, qty});
  saveCart(cart);
  updateCartCount();
}
function openCart(){ qs('#cart-modal').setAttribute('aria-hidden','false'); renderCartItems(); }
function closeCart(){ qs('#cart-modal').setAttribute('aria-hidden','true'); }

function renderCartItems(){
  const itemsEl = qs('#cart-items');
  itemsEl.innerHTML = '';
  const cart = loadCart();
  if(cart.length===0){ itemsEl.innerHTML = '<p>Keranjang kosong.</p>'; qs('#cart-subtotal').textContent = rupiah(0); return; }
  let subtotal = 0;
  cart.forEach(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.style.display='flex'; row.style.justifyContent='space-between'; row.style.gap='8px'; row.style.marginBottom='8px';
    row.innerHTML = `<div><strong>\${p.name}</strong><div>Harga: \${rupiah(p.price)} × <input type="number" min="1" value="\${ci.qty}" data-id="\${ci.id}" class="qty-input" style="width:64px"></div></div><div>\${rupiah(p.price * ci.qty)}<div><button class="remove" data-id="\${ci.id}">Hapus</button></div></div>`;
    itemsEl.appendChild(row);
    subtotal += p.price * ci.qty;
  });
  qs('#cart-subtotal').textContent = rupiah(subtotal);
  qsa('.remove').forEach(b=> b.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id);
    let cart = loadCart();
    cart = cart.filter(i=>i.id!==id);
    saveCart(cart); renderCartItems(); updateCartCount();
  }));
  qsa('.qty-input').forEach(inp=> inp.addEventListener('change', e=>{
    const id = Number(e.currentTarget.dataset.id);
    const val = Math.max(1, Number(e.currentTarget.value));
    const cart = loadCart();
    const it = cart.find(i=>i.id===id); if(it){ it.qty = val; saveCart(cart); renderCartItems(); updateCartCount(); }
  }));
}

// Checkout simulation
function simulateCheckout(){
  const cart = loadCart();
  if(cart.length===0){ alert('Keranjang kosong!'); return; }
  // For this static demo we just clear cart and show a message
  const subtotal = cart.reduce((s,i)=> s + (PRODUCTS.find(p=>p.id===i.id).price * i.qty), 0);
  alert('Checkout berhasil! Total: ' + rupiah(subtotal) + '\n(Terima kasih, ini demo statis tanpa pembayaran.)');
  localStorage.removeItem('mosse_cart');
  updateCartCount();
  renderCartItems();
  closeCart();
}

// Testimonials render & form
function renderTestimonials(){
  const list = loadTestimonials();
  const el = qs('#testimonials');
  if(list.length===0) el.innerHTML = '<p>Belum ada testimoni. Jadilah yang pertama!</p>';
  else el.innerHTML = list.map(t=> `<div class="testimonial"><strong>\${t.name}</strong> — <em>\${'★'.repeat(t.rating)}</em><p>\${t.message}</p></div>`).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{
  qs('#year').textContent = new Date().getFullYear();
  renderProducts();
  renderSlider();
  renderTestimonials();
  updateCartCount();

  qs('#cart-btn').addEventListener('click', openCart);
  qs('#close-cart').addEventListener('click', closeCart);
  qs('#checkout-btn').addEventListener('click', simulateCheckout);

  qs('#testimonial-form').addEventListener('submit', e=>{
    e.preventDefault();
    const name = qs('#t-name').value || 'Anonim';
    const rating = Math.min(5, Math.max(1, Number(qs('#t-rating').value || 5)));
    const message = qs('#t-message').value;
    const list = loadTestimonials();
    list.unshift({name, rating, message, date: new Date().toISOString()});
    saveTestimonials(list);
    renderTestimonials();
    qs('#t-name').value=''; qs('#t-rating').value=''; qs('#t-message').value='';
  });

  qs('#feedback-form').addEventListener('submit', e=>{
    e.preventDefault();
    const name = qs('#f-name').value || 'Anonim';
    const email = qs('#f-email').value || '-';
    const message = qs('#f-message').value;
    // store feedback locally (demo)
    const feedbacks = JSON.parse(localStorage.getItem('mosse_feedbacks')||'[]');
    feedbacks.unshift({name,email,message,date:new Date().toISOString()});
    localStorage.setItem('mosse_feedbacks', JSON.stringify(feedbacks));
    alert('Terima kasih! Kritik dan saran Anda sudah terkirim (disimpan secara lokal pada demo).');
    qs('#f-name').value=''; qs('#f-email').value=''; qs('#f-message').value='';
  });

  qs('#shop-now').addEventListener('click', ()=> window.scrollTo({top:800, behavior:'smooth'}));
});
