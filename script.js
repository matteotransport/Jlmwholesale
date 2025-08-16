// Tiny catalog with external images (keeps zip size small)
const PRODUCTS = [
  {id:"p1", title:"Wireless Headphones", price:49.99, img:"https://picsum.photos/seed/phones/600/400"},
  {id:"p2", title:"Desk Organizer", price:24.00, img:"https://picsum.photos/seed/desk/600/400"},
  {id:"p3", title:"Scented Candle", price:18.50, img:"https://picsum.photos/seed/candle/600/400"},
  {id:"p4", title:"Face Serum", price:32.00, img:"https://picsum.photos/seed/serum/600/400"},
  {id:"p5", title:"Smart Plug (2‑Pack)", price:19.99, img:"https://picsum.photos/seed/plug/600/400"},
  {id:"p6", title:"Office Chair", price:149.00, img:"https://picsum.photos/seed/chair/600/400"}
];

const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const fmt = (n)=>n.toLocaleString(undefined,{style:'currency',currency:'USD'});

const state = { cart: JSON.parse(localStorage.getItem('cart')||'{}') };

function save(){ localStorage.setItem('cart', JSON.stringify(state.cart)); $('#count').textContent = Object.values(state.cart).reduce((a,b)=>a+b,0); }

function renderProducts(){
  const grid = $('#grid'); grid.innerHTML = '';
  for (const p of PRODUCTS){
    const card = document.createElement('article');
    card.className='card';
    card.innerHTML = `
      <div class="img"><img src="${p.img}" alt="${p.title}"></div>
      <div class="body">
        <div class="title">${p.title}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="row">
          <button class="btn primary" data-add="${p.id}">Add</button>
          <button class="btn" data-det="${p.id}">Details</button>
        </div>
      </div>`;
    grid.appendChild(card);
  }
  $$('[data-add]').forEach(b => b.onclick = ()=>add(b.dataset.add));
  $$('[data-det]').forEach(b => b.onclick = ()=>alert('Details coming soon.'));
}

function add(id){ state.cart[id]=(state.cart[id]||0)+1; save(); openCart(); renderCart(); }
function change(id,d){ const q=(state.cart[id]||0)+d; if(q<=0) delete state.cart[id]; else state.cart[id]=q; save(); renderCart(); }

function renderCart(){
  const lines = $('#lines'); lines.innerHTML='';
  let sub = 0;
  for (const [id,qty] of Object.entries(state.cart)){
    const p = PRODUCTS.find(x=>x.id===id); if(!p) continue;
    sub += p.price*qty;
    const row = document.createElement('div');
    row.className='pline';
    row.innerHTML = `
      <img src="${p.img}" alt="">
      <div>
        <div class="title">${p.title}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="qty">
          <button data-m="${id}">-</button>
          <span>${qty}</span>
          <button data-p="${id}">+</button>
        </div>
      </div>
      <div><strong>${fmt(p.price*qty)}</strong></div>`;
    lines.appendChild(row);
  }
  $('#subtotal').textContent = fmt(sub);
  $$('[data-m]').forEach(b=>b.onclick=()=>change(b.dataset.m,-1));
  $$('[data-p]').forEach(b=>b.onclick=()=>change(b.dataset.p,+1));
}

function openCart(){ $('#drawer').classList.add('show'); }
function closeCart(){ $('#drawer').classList.remove('show'); }

window.addEventListener('DOMContentLoaded', ()=>{
  $('#year').textContent = new Date().getFullYear();
  renderProducts(); save(); renderCart();
  $('#cartBtn').onclick=openCart; $('#close').onclick=closeCart; $('#shade').onclick=closeCart;
  $('#clear').onclick=()=>{ state.cart={}; save(); renderCart(); };
  $('#checkout').onclick=()=>alert('Checkout can be added later (Stripe).');
});
