
// Mossewear Storefront – Vanilla JS
const $$ = (sel, parent=document) => parent.querySelector(sel);
const $$$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

const state = {
  products: [
    { id: 'c1', name: 'Cardigan Aurora', price: 279000, img: 'assets/img/cardigan-1.svg' },
    { id: 'c2', name: 'Cardigan Rose Luxe', price: 319000, img: 'assets/img/cardigan-2.svg' },
    { id: 'c3', name: 'Cardigan Sky Mist', price: 259000, img: 'assets/img/cardigan-3.svg' },
    { id: 'c4', name: 'Cardigan Slate', price: 299000, img: 'assets/img/cardigan-4.svg' },
    { id: 'c5', name: 'Cardigan Pearl', price: 239000, img: 'assets/img/cardigan-5.svg' },
  ],
  cart: JSON.parse(localStorage.getItem('mossewear_cart')||'[]'),
  testimonials: JSON.parse(localStorage.getItem('mossewear_testimonials')||'[{"name":"Lina","text":"Bahannya halus, dipakai adem. Pengiriman cepat!"},{"name":"Rafi","text":"Warnanya cakep banget dan cutting-nya rapi."},{"name":"Sari","text":"Suka banget sama modelnya, kekinian."}]'),
  feedbacks: JSON.parse(localStorage.getItem('mossewear_feedbacks')||'[]')
};

function formatRp(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n); }

function saveCart(){ localStorage.setItem('mossewear_cart', JSON.stringify(state.cart)); updateCartCount(); }
function updateCartCount(){ $$('.cart-count').textContent = state.cart.reduce((a,i)=>a+i.qty,0); }

function renderProducts(){
  const track = $$('.product-track');
  track.innerHTML = '';
  state.products.slice(0,5).forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-info">
        <div>
          <h3>${p.name}</h3>
          <div class="price">${formatRp(p.price)}</div>
        </div>
        <button class="btn secondary add-to-cart" data-id="${p.id}" aria-label="Tambahkan ${p.name} ke keranjang">+ Keranjang</button>
      </div>
    `;
    track.appendChild(card);
  });
  track.addEventListener('click', e=>{
    const btn = e.target.closest('.add-to-cart');
    if(!btn) return;
    const id = btn.dataset.id;
    const prod = state.products.find(p=>p.id===id);
    const item = state.cart.find(i=>i.id===id);
    if(item){ item.qty += 1; } else { state.cart.push({id, qty:1}); }
    saveCart();
    showNotice('Ditambahkan ke keranjang');
    renderCart();
  });
}

function renderCart(){
  const list = $$('.cart-items');
  const totalEl = $$('.cart-total .amount');
  list.innerHTML = '';

  let total = 0;
  state.cart.forEach(ci=>{
    const p = state.products.find(x=>x.id===ci.id);
    const subtotal = p.price * ci.qty;
    total += subtotal;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div>
        <div style="font-weight:700">${p.name}</div>
        <div>${formatRp(p.price)} × 
          <button class="btn ghost qty-dec" data-id="${ci.id}" aria-label="Kurangi jumlah">-</button>
          <span class="qty">${ci.qty}</span>
          <button class="btn ghost qty-inc" data-id="${ci.id}" aria-label="Tambah jumlah">+</button>
        </div>
      </div>
      <div style="font-weight:700">${formatRp(subtotal)}</div>
    `;
    list.appendChild(row);
  });

  if(state.cart.length===0){
    list.innerHTML = '<p>Keranjang masih kosong.</p>';
  }
  totalEl.textContent = formatRp(total);

  list.addEventListener('click', e=>{
    if(e.target.classList.contains('qty-inc') || e.target.classList.contains('qty-dec')){
      const id = e.target.dataset.id;
      const item = state.cart.find(i=>i.id===id);
      if(!item) return;
      if(e.target.classList.contains('qty-inc')) item.qty += 1;
      if(e.target.classList.contains('qty-dec')) item.qty = Math.max(0, item.qty-1);
      if(item.qty===0) state.cart = state.cart.filter(i=>i.id!==id);
      saveCart();
      renderCart();
    }
  }, {once:true});
}

function openCart(){ $$('.cart-drawer').classList.add('open'); }
function closeCart(){ $$('.cart-drawer').classList.remove('open'); }

function setupSlider(){
  const track = $$('.product-track');
  const prev = $$('.prev'); const next = $$('.next');
  const step = () => track.clientWidth * 0.88;
  prev.addEventListener('click', ()=>{ track.scrollBy({left:-step(),behavior:'smooth'}); });
  next.addEventListener('click', ()=>{ track.scrollBy({left: step(),behavior:'smooth'}); });
}

function renderTestimonials(){
  const grid = $$('.testimonials');
  grid.innerHTML = '';
  state.testimonials.forEach(t=>{
    const el = document.createElement('div');
    el.className='testimonial';
    el.innerHTML = `<div class="name">★ ${t.name}</div><p>${t.text}</p>`;
    grid.appendChild(el);
  });
}

function handleForms(){
  // Testimonial form
  $$('#testimonial-form').addEventListener('submit', e=>{
    e.preventDefault();
    const name = e.target.name.value.trim() || 'Anonim';
    const text = e.target.text.value.trim();
    if(!text){ showNotice('Isi ulasan terlebih dahulu.'); return; }
    state.testimonials.unshift({name, text});
    localStorage.setItem('mossewear_testimonials', JSON.stringify(state.testimonials));
    e.target.reset();
    renderTestimonials();
    showNotice('Terima kasih atas testimoninya!');
  });

  // Feedback form (kritik & saran)
  $$('#feedback-form').addEventListener('submit', e=>{
    e.preventDefault();
    const name = e.target.name.value.trim() || 'Anonim';
    const text = e.target.text.value.trim();
    if(!text){ showNotice('Tulis kritik & saran.'); return; }
    state.feedbacks.push({name, text, date: new Date().toISOString()});
    localStorage.setItem('mossewear_feedbacks', JSON.stringify(state.feedbacks));
    e.target.reset();
    showNotice('Kritik & saran tersimpan. Terima kasih!');
  });
}

function showNotice(msg){
  const n = $$('.notice'); n.textContent = msg; n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'), 1500);
}

function init(){
  renderProducts();
  setupSlider();
  renderCart();
  renderTestimonials();
  handleForms();
  updateCartCount();
  // open cart buttons
  $$$('.open-cart').forEach(b=>b.addEventListener('click', openCart));
  $$('.close-x').addEventListener('click', closeCart);
  // checkout
  $$('.checkout').addEventListener('click', ()=>{
    if(state.cart.length===0){ showNotice('Keranjang kosong.'); return; }
    const summary = state.cart.map(i=>{
      const p = state.products.find(x=>x.id===i.id);
      return `- ${p.name} x ${i.qty} = ${formatRp(p.price*i.qty)}`;
    }).join('\n');
    const total = $$('.cart-total .amount').textContent;
    alert(`Ringkasan Pesanan:\n${summary}\n\nTotal: ${total}\n\nCheckout demo: silakan DM @mossewear atau lanjutkan pembayaran manual.`);
  });
}

document.addEventListener('DOMContentLoaded', init);
