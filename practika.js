const products = [
  {
    id: 1,
    title: 'Black Jacket',
    price: 120,
    image: 'https://unsplash.com'
  },
  {
    id: 2,
    title: 'White Sneakers',
    price: 90,
    image: 'https://unsplash.com'
  },
  {
    id: 3,
    title: 'Luxury Watch',
    price: 200,
    image: 'https://unsplash.com'
  },
  {
    id: 4,
    title: 'Modern Hoodie',
    price: 85,
    image: 'https://unsplash.com'
  },
  {
    id: 5,
    title: 'Elegant Bag',
    price: 150,
    image: 'https://unsplash.com'
  },
  {
    id: 6,
    title: 'Streetwear T-shirt',
    price: 60,
    image: 'https://unsplash.com'
  }
];

const productsContainer = document.getElementById('productsContainer');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const themeBtn = document.getElementById('themeBtn');

const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const closeBtn = document.querySelector('.close');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
cartCount.innerText = cart.length;

function renderProducts(items) {
  productsContainer.innerHTML = '';

  items.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="card-body">
        <h3>${product.title}</h3>
        <p class="price">$${product.price}</p>
        <div class="card-buttons">
          <button class="add-btn">Add</button>
          <button class="view-btn">View</button>
        </div>
      </div>
    `;

    
    card.querySelector('.add-btn').addEventListener('click', () => addToCart(product.id));
    card.querySelector('.view-btn').addEventListener('click', () => openModal(product.id));

    productsContainer.append(card);
  });
}

renderProducts(products);

function addToCart(id) {
  const product = products.find(item => item.id === id);
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  cartCount.innerText = cart.length;
  alert(product.title + ' added to cart');
}

searchInput.addEventListener('input', e => {
  const value = e.target.value.toLowerCase();
  const filtered = products.filter(product =>
    product.title.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});

function openModal(id) {
  const product = products.find(item => item.id === id);
  modal.style.display = 'flex';
  modalImage.src = product.image;
  modalTitle.innerText = product.title;
  modalPrice.innerText = '$' + product.price;
}

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});