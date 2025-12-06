document.addEventListener("DOMContentLoaded", () => {
    // --- Mock Product Data (Expanded) ---
    const products = [
        { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=60&w=800' },
        { id: 2, name: 'Smartwatch Series 7', price: 349.00, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=60&w=800' },
        { id: 3, name: 'DSLR Camera', price: 799.50, image: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&q=60&w=800' },
        { id: 4, name: 'Leather Backpack', price: 120.00, image: 'https://teakwoodleathers.com/cdn/shop/products/1_3c7fc997-fc0c-4a02-90ba-4d66bd130ce1_540x.jpg?v=1750933999' },
        { id: 5, name: 'Gaming Laptop', price: 1450.00, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=60&w=800' },
        { id: 6, name: 'Bluetooth Speaker', price: 75.00, image: 'https://plus.unsplash.com/premium_photo-1677159499898-b061fb5bd2d7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=464' },
        { id: 7, name: 'Modern Sunglasses', price: 45.99, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=60&w=800' },
        { id: 8, name: 'Espresso Machine', price: 299.00, image: 'https://i5.walmartimages.com/seo/Espresso-Coffee-Machine-Grinder-20-Bar-Semi-Automatic-Espresso-Maker-Milk-Frother-Steamer-Wand-PID-Temperature-Control-Commercial-Espresso-Machines_b9bf07b0-3bff-4e0b-99c9-459cb27abeec.1f416a66f0c6389b95a34ee6f4bf65f4.jpeg' }
    ];

    // --- (All other DOM elements and functions remain the same as before) ---
    // (Copy the rest of the JavaScript from the previous response)
    const productList = document.getElementById('product-list');
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    const modal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const saveCart = () => { localStorage.setItem('cart', JSON.stringify(cart)); };
    const renderProducts = () => { products.forEach(product => { const productCard = document.createElement('div'); productCard.className = 'product-card'; productCard.innerHTML = `<img src="${product.image}" alt="${product.name}"><div class="product-info"><h3>${product.name}</h3><p class="product-price">$${product.price.toFixed(2)}</p><button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button></div>`; productList.appendChild(productCard); }); };
    const renderCart = () => { cartItemsContainer.innerHTML = ''; if (cart.length === 0) { cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>'; } else { cart.forEach(item => { const cartItem = document.createElement('div'); cartItem.className = 'cart-item'; cartItem.innerHTML = `<img src="${item.image}" alt="${item.name}"><div class="cart-item-info"><h4>${item.name}</h4><p>$${item.price.toFixed(2)}</p></div><div class="quantity-controls"><button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button><span>${item.quantity}</span><button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button></div><button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>`; cartItemsContainer.appendChild(cartItem); }); } updateCartTotal(); };
    const updateCartTotal = () => { const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); cartTotal.textContent = total.toFixed(2); cartCount.textContent = totalItems; };
    const showToast = (message) => { const toast = document.getElementById('toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => { toast.classList.remove('show'); }, 3000); };
    const addToCart = (productId) => { const product = products.find(p => p.id === productId); const existingItem = cart.find(item => item.id === productId); if (existingItem) { existingItem.quantity++; } else { cart.push({ ...product, quantity: 1 }); } saveCart(); renderCart(); showToast(`${product.name} added to cart!`); };
    const updateQuantity = (productId, action) => { const item = cart.find(i => i.id === productId); if (item) { if (action === 'increase') { item.quantity++; } else if (action === 'decrease') { item.quantity--; if (item.quantity === 0) { removeFromCart(productId); return; } } saveCart(); renderCart(); } };
    const removeFromCart = (productId) => { cart = cart.filter(item => item.id !== productId); saveCart(); renderCart(); };
    productList.addEventListener('click', (e) => { if (e.target.classList.contains('add-to-cart-btn')) { const productId = parseInt(e.target.dataset.id); addToCart(productId); } });
    cartIcon.addEventListener('click', () => { modal.style.display = 'block'; });
    closeButton.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display = 'none'; } });
    cartItemsContainer.addEventListener('click', (e) => { const target = e.target.closest('button'); if (!target) return; const productId = parseInt(target.dataset.id); if (target.classList.contains('quantity-btn')) { const action = target.dataset.action; updateQuantity(productId, action); } else if (target.classList.contains('remove-item-btn')) { removeFromCart(productId); } });
    
    // --- NEW: Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activateNavLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 75) { // 75 is a slight offset
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', activateNavLink);

    // --- Initial Load ---
    renderProducts();
    renderCart();
});
