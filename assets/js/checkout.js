// checkout page logic — reads draft from localStorage
const rupiah = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n);

const draft = JSON.parse(localStorage.getItem('mw_checkout_draft') || '{"items":[],"total":0}');

const list = document.getElementById('checkoutItems');
let total = 0;

draft.items.forEach(it => {
  const li = document.createElement('li');
  li.className = 'cart-item';
  li.innerHTML = `
    <img src="${it.img}" alt="${it.name}">
    <div>
      <div class="cart-item-title">${it.name}</div>
      <div class="cart-item-qty">${it.qty} x ${rupiah(it.price)}</div>
    </div>
  `;
  total += it.qty * it.price;
  list.appendChild(li);
});

document.getElementById('checkoutTotal').textContent = rupiah(total);
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('payNow').addEventListener('click', () => {
  alert('Simulasi pembayaran berhasil. Terima kasih sudah berbelanja di mossewear!');
});
