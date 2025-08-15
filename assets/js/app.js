// Mossewear Storefront - Vanilla JS
const products = [
  {id:'mw-01', name:'Cardigan Aurora', price:349000, image:'assets/img/product-1.svg', tag:'Best Seller'},
  {id:'mw-02', name:'Sweater Nova', price:329000, image:'assets/img/product-2.svg', tag:'New'},
  {id:'mw-03', name:'Cardigan Ivory', price:379000, image:'assets/img/product-3.svg', tag:'Limited'},
  {id:'mw-04', name:'Sweater Cloud', price:299000, image:'assets/img/product-4.svg', tag:'Fav'},
  {id:'mw-05', name:'Cardigan Rose', price:359000, image:'assets/img/product-5.svg', tag:'Hot'},
];

// Helpers
const rupiah = n => new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0}).format(n);
const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];

// Cart (localStorage)
const CART_KEY = 'mossewear_cart_v1';
const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

function addToCart(id){
  const list = loadCart();
  const found = list.find(i => i.id === id);
  if(found){ found.qty += 1; } else {
    const p = products.find(p => p.id === id);
    list.push({id:p.id, name:p.name, price:p.price, image:p.image, qty:1});
  }
  saveCart(list);
  renderCart();
}

function removeFromCart(id){
  let list = loadCart().filter(i => i.id !== id);
  saveCart(list);
  renderCart();
}

function updateQty(id, delta){
  let list = loadCart().map(i => i.id === id ? {...i, qty: Math.max(1, i.qty + delta)} : i);
  saveCart(list);
  renderCart();
}

function renderCart(){
  const list = loadCart();
  const count = list.reduce((a,b)=>a+b.qty,0);
  const subtotal = list.reduce((a,b)=>a+b.price*b.qty,0);
  qs('#cart-count').textContent = count;
  const wrap = qs('#cart-items');
  if(!wrap) return;

  wrap.innerHTML = '';
  list.forEach(item => {
    const row = document.createElement('div');
    row.className='cart-item';
    row.innerHTML = \`
      <img src="\${item.image}" width="56" height="56" alt="\${item.name}"/>
      <div style="flex:1">
        <div style="font-weight:700">\${item.name}</div>
        <div class="muted">\${rupiah(item.price)}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px">
          <button class="btn outline" aria-label="decrease" onclick="updateQty('\${item.id}', -1)">-</button>
          <span>\${item.qty}</span>
          <button class="btn outline" aria-label="increase" onclick="updateQty('\${item.id}', 1)">+</button>
          <button class="btn" style="margin-left:auto" onclick="removeFromCart('\${item.id}')">Hapus</button>
        </div>
      </div>
    \`;
    wrap.appendChild(row);
  });
  qs('#cart-subtotal').textContent = rupiah(subtotal);
}

function checkout(){
  const list = loadCart();
  if(list.length === 0){ alert('Keranjang masih kosong 😅'); return; }
  const lines = list.map(i => \`• \${i.name} x\${i.qty} = \${rupiah(i.price*i.qty)}\`).join('%0A');
  const total = rupiah(list.reduce((a,b)=>a+b.price*b.qty,0));
  const msg = \`Halo Mossewear, saya ingin checkout:%0A\${lines}%0A%0ATotal: \${total}\`;
  const wa = 'https://wa.me/?text=' + msg; // ganti nomor WA toko nanti
  window.open(wa, '_blank');
}

// Render products slider
function renderSlider(){
  const track = qs('.track');
  track.innerHTML = '';
  products.slice(0,5).forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = \`
      <img src="\${p.image}" alt="\${p.name}">
      <div class="body">
        <span class="badge">\${p.tag}</span>
        <h3>\${p.name}</h3>
        <div class="price">\${rupiah(p.price)}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn rose" onclick="addToCart('\${p.id}')">+ Keranjang</button>
          <button class="btn outline" onclick="addToCart('\${p.id}'); checkout()">Checkout</button>
        </div>
      </div>
    \`;
    track.appendChild(card);
  });
  let index = 0;
  const prev = qs('#prev'), next = qs('#next');
  const update = () => track.style.transform = \`translateX(-\${index * (track.children[0].offsetWidth + 28)}px)\`;
  prev.onclick = () => { index = Math.max(0, index-1); update(); };
  next.onclick = () => { index = Math.min(products.length-1, index+1); update(); };
  window.addEventListener('resize', update);
}

// Testimonials (localStorage)
const T_KEY = 'mossewear_testimonials_v1';
const loadT = () => JSON.parse(localStorage.getItem(T_KEY) || '[]');
const saveT = (t) => localStorage.setItem(T_KEY, JSON.stringify(t));

function renderTestimonials(){
  const list = loadT();
  const wrap = qs('#testimonials');
  wrap.innerHTML = '';
  if(list.length === 0){
    wrap.innerHTML = '<p class="muted">Belum ada testimoni. Jadilah yang pertama ✨</p>';
    return;
  }
  list.forEach(t => {
    const el = document.createElement('div');
    el.className = 'testimonial';
    el.innerHTML = \`
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--ivory);display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--blue)">
          \${t.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style="font-weight:700">\${t.name || 'Customer'}</div>
      </div>
      <blockquote>"\${t.message}"</blockquote>
    \`;
    wrap.appendChild(el);
  });
}

function handleTestimonialSubmit(e){
  e.preventDefault();
  const name = qs('#t-name').value.trim();
  const message = qs('#t-message').value.trim();
  if(!message){ alert('Tulis testimoninya dulu ya 🙂'); return; }
  const list = loadT();
  list.unshift({name, message, date: Date.now()});
  saveT(list);
  e.target.reset();
  renderTestimonials();
}

function handleFeedbackSubmit(e){
  e.preventDefault();
  const name = qs('#f-name').value.trim();
  const message = qs('#f-message').value.trim();
  const msg = encodeURIComponent(\`Kritik & saran dari \${name || 'Anon'}: \n\${message}\`);
  const wa = 'https://wa.me/?text=' + msg; // ganti nomor WA toko nanti
  window.open(wa, '_blank');
  e.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
  renderSlider();
  renderCart();
  renderTestimonials();
  qs('#testimonial-form').addEventListener('submit', handleTestimonialSubmit);
  qs('#feedback-form').addEventListener('submit', handleFeedbackSubmit);

  // Cart panel toggle
  const fab = qs('#cart-fab');
  const panel = qs('#cart-panel');
  fab.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  });
});