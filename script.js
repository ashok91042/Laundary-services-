/* ---------- Responsive nav ---------- */
const nav = document.querySelector('.nav');
document.getElementById('burger').addEventListener('click', () => {
  nav.classList.toggle('open');
});

/* ---------- User Name (right side) ---------- */
// Replace "Ashok" with dynamic logic if needed.
const name = 'username';
document.getElementById('userName').textContent = name;

/* ---------- Services Data ---------- */
const services = [
  {id:'dry',   name:'Dry Cleaning',      price:200},
  {id:'wash',  name:'Wash & Fold',       price:100},
  {id:'iron',  name:'Ironing',           price:30},
  {id:'stain', name:'Stain Removal',     price:150},
  {id:'leather',name:'Leather & Suede Cleaning', price:999},
  {id:'wedding',name:'Wedding Dress Cleaning',   price:2800},
];

const servicesList = document.getElementById('servicesList');
const cartBody = document.getElementById('cartBody');
const totalCell = document.getElementById('totalCell');
const cart = []; // array of {id, name, price}

// Format numbers in INR
function rupees(n){ 
  return '₹' + n.toLocaleString('en-IN'); 
}

// Render list of services
function renderServices(){
  servicesList.innerHTML = '';
  services.forEach(s=>{
    const row = document.createElement('div');
    row.className = 'service-row';
    row.innerHTML = `
      <div><strong>${s.name}</strong></div>
      <div>${rupees(s.price)}</div>
      <div style="display:flex; gap:8px; justify-content:flex-end">
        <button class="btn btn-danger" data-remove="${s.id}">Remove Now</button>
        <button class="btn btn-primary" data-add="${s.id}">Add Item</button>
      </div>
    `;
    servicesList.appendChild(row);
  });
}

// Render cart table
function renderCart(){
  if(cart.length === 0){
    cartBody.innerHTML = '<tr><td colspan="3" style="color:#64748b">No items added yet.</td></tr>';
  } else {
    cartBody.innerHTML = cart.map((item, idx)=> `
      <tr class="cart-row">
        <td>${idx+1}</td>
        <td>${item.name}</td>
        <td>${rupees(item.price)}</td>
      </tr>
    `).join('');
  }
  const total = cart.reduce((sum,i)=>sum+i.price,0);
  totalCell.textContent = rupees(total);
}

// Handle Add/Remove button clicks
servicesList.addEventListener('click', (e)=>{
  const addId = e.target.getAttribute('data-add');
  const remId = e.target.getAttribute('data-remove');
  if(addId){
    const svc = services.find(s=>s.id===addId);
    cart.push({ ...svc });
    renderCart();
  }
  if(remId){
    const idx = [...cart].reverse().findIndex(i=>i.id===remId);
    if(idx > -1){
      cart.splice(cart.length-1-idx,1);
      renderCart();
    }
  }
});

// Initial rendering
renderServices(); 
renderCart();

/* ---------- Booking form + EmailJS ---------- */
const form = document.getElementById('bookForm');
const msg = document.getElementById('bookMsg');

try { emailjs.init({ publicKey: "YOUR_PUBLIC_KEY" }); } catch(e){ /* Ignore locally */ }

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(cart.length === 0){
    msg.textContent = "Please add at least one service to the cart before booking.";
    msg.style.color = "#b91c1c";
    return;
  }
  const data = {
    name: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    items: cart.map(i=>i.name).join(', '),
    total: totalCell.textContent
  };

  let sent = false;
  try{
    await emailjs.send("SERVICE_ID","TEMPLATE_ID", data);
    sent = true;
  }catch(_){ /* Fallback */ }

  msg.style.color = "#065f46";
  msg.textContent = "Thank you for booking the service. We will get back to you soon!" + 
    (sent ? " (Confirmation email sent.)" : "");
  form.reset();
  cart.length = 0; renderCart();
});

/* ---------- Newsletter ---------- */
document.getElementById('newsForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  document.getElementById('newsMsg').textContent = "Thanks for subscribing! Please check your inbox for a confirmation.";
  e.target.reset();
});

/* ---------- Footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();