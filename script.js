// Simple JS for Mossewear site: slider, cart, testimonials
document.addEventListener('DOMContentLoaded', () => {
  // Slider
  const slidesWrap = document.querySelector('.slides');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let idx = 0;
  const visible = Math.floor(document.querySelector('.slider').offsetWidth / 220) || 3;
  const total = slidesWrap.children.length;
  function updateSlider() {
    const w = slidesWrap.children[0].offsetWidth + parseInt(getComputedStyle(slidesWrap).gap || 12);
    slidesWrap.style.transform = `translateX(${-idx * w}px)`;
  }
  prev.addEventListener('click', () => { idx = Math.max(0, idx-1); updateSlider(); });
  next.addEventListener('click', () => { idx = Math.min(total-visible, idx+1); updateSlider(); });
  window.addEventListener('resize', updateSlider);
  updateSlider();

  // Cart
  const cart = {};
  const cartCount = document.getElementById('cartCount');
  const cartArea = document.getElementById('cartArea');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const clearCartBtn = document.getElementById('clearCart');

  function renderCart() {
    cartArea.innerHTML = '';
    const ids = Object.keys(cart);
    if (ids.length === 0) {
      cartArea.innerHTML = '<p class="muted">Keranjang kosong — tambahkan produk dari bagian "Produk Terlaris".</p>';
      cartCount.textContent = '0';
      checkoutBtn.disabled = true;
      return;
    }
    ids.forEach(id => {
      const item = cart[id];
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `<div class="cart-name">${item.name}</div>
                      <div class="cart-qty">x<span class="qty">${item.qty}</span></div>
                      <div class="cart-price">Rp ${formatNumber(item.price * item.qty)}</div>
                      <button class="remove-item" data-id="${id}">✕</button>`;
      cartArea.appendChild(el);
    });
    const total = ids.reduce((s,k)=> s + cart[k].price * cart[k].qty, 0);
    const totalEl = document.createElement('div');
    totalEl.style.marginTop = '10px';
    totalEl.innerHTML = `<strong>Total: Rp ${formatNumber(total)}</strong>`;
    cartArea.appendChild(totalEl);
    cartCount.textContent = ids.reduce((s,k)=> s + cart[k].qty, 0);
    checkoutBtn.disabled = false;
  }

  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const prod = e.target.closest('.product');
      const id = prod.dataset.id;
      const name = prod.dataset.name;
      const price = Number(prod.dataset.price);
      if (!cart[id]) cart[id] = {name, price, qty:0};
      cart[id].qty += 1;
      renderCart();
    });
  });

  cartArea.addEventListener('click', e => {
    if (e.target.matches('.remove-item')) {
      const id = e.target.dataset.id;
      delete cart[id];
      renderCart();
    }
  });

  clearCartBtn.addEventListener('click', () => {
    for (const k of Object.keys(cart)) delete cart[k];
    renderCart();
  });

  checkoutBtn.addEventListener('click', () => {
    const ids = Object.keys(cart);
    if (ids.length === 0) { alert('Keranjang kosong.'); return; }
    const lines = ids.map(k => `${cart[k].name} x${cart[k].qty} — Rp ${formatNumber(cart[k].price * cart[k].qty)}`);
    const total = ids.reduce((s,k)=> s + cart[k].price * cart[k].qty, 0);
    const summary = lines.join('\n') + `\n\nTotal: Rp ${formatNumber(total)}\nAlamat: Jl. Grand Galaxy, Bekasi`;
    // Simulate checkout flow
    if (confirm('Checkout sekarang?\n\n' + summary)) {
      alert('Terima kasih! Pesanan Anda berhasil dibuat (simulasi).');
      for (const k of Object.keys(cart)) delete cart[k];
      renderCart();
    }
  });

  function formatNumber(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); }

  // Testimonials
  const testiForm = document.getElementById('testiForm');
  const testiList = document.getElementById('testiList');
  testiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const msg = document.getElementById('messageInput').value.trim();
    if (!name || !msg) return;
    const bq = document.createElement('blockquote');
    bq.className = 'testi';
    bq.innerHTML = `<p>"${escapeHtml(msg)}"</p><cite>— ${escapeHtml(name)}</cite>`;
    testiList.prepend(bq);
    testiForm.reset();
  });

  function escapeHtml(s){ return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // initial render
  renderCart();
});
