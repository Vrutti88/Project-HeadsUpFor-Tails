document.addEventListener('DOMContentLoaded', () => {
    // ----- Cart -----
    let cart = JSON.parse(localStorage.getItem("huftCart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("huftWishlist")) || [];

    function saveCart() {
        localStorage.setItem("huftCart", JSON.stringify(cart));
        updateCartCount();
        updateCartUI();
    }

    function updateCartCount() {
        const countEl = document.getElementById("cart-count");
        if (countEl) {
            countEl.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }
    }

    function updateCartUI() {
        const cartItemsList = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");
        const emptyContainer = document.querySelector(".empty-cart-container");

        cart = JSON.parse(localStorage.getItem("huftCart")) || [];
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyContainer.style.display = 'block';
        } else {
            emptyContainer.style.display = 'none';
        }

        const groupedCart = {};
        cart.forEach(item => {
            const key = `${item.name}__${item.price}`;
            if (!groupedCart[key]) {
                groupedCart[key] = { ...item };
            } else {
                groupedCart[key].quantity += item.quantity;
            }
        });

        Object.entries(groupedCart).forEach(([key, item]) => {
            total += item.price * item.quantity;
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
            <img src="${item.image}" class="cart-img" alt="${item.name}" />
            <div class="cart-details">
                <div class="item-title">${item.name}</div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQtyByName('${item.name}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQtyByName('${item.name}', 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeAllByName('${item.name}')">🗑️</button>
        `;
            cartItemsList.appendChild(li);
        });

        cartTotal.textContent = `Total: ₹${total}`;
        updateCartCount();

        const checkoutBtn = document.getElementById("checkout-btn");
        if (cart.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = 0.6;
            checkoutBtn.style.cursor = "not-allowed";
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = 1;
            checkoutBtn.style.cursor = "pointer";
        }
    }

    window.changeQtyByName = function (name, delta) {
        let found = false;
        for (let item of cart) {
            if (item.name === name) {
                item.quantity += delta;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.name !== name);
                }
                found = true;
                break;
            }
        }
        if (!found && delta > 0) {
            cart.push({ name: name, price: 0, quantity: delta });
        }
        saveCart();
    };

    window.removeAllByName = function (name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
    };

    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    cartIcon?.addEventListener('click', () => {
        cartDrawer?.classList.add('open');
        updateCartUI();
    });

    window.closeCart = function () {
        cartDrawer?.classList.remove('open');
    };

    // ----- Wishlist -----
    function saveWishlist() {
        localStorage.setItem("huftWishlist", JSON.stringify(wishlist));
        updateWishlistCount();
        updateWishlistUI();
    }

    function updateWishlistCount() {
        const countEl = document.getElementById("wishlist-count");
        if (countEl) {
            countEl.textContent = wishlist.length;
        }
    }

    function updateWishlistUI() {
        const wishlistList = document.getElementById("wishlist-items");
        const emptyContainer = document.querySelector("#wishlist-overlay .empty-cart-container");

        wishlist = JSON.parse(localStorage.getItem("huftWishlist")) || [];
        wishlistList.innerHTML = '';

        const isEmpty = wishlist.length === 0;
        emptyContainer.classList.toggle("hidden", !isEmpty);

        if (!isEmpty) {
            wishlist.forEach((item, index) => {
                const li = document.createElement("li");
                li.className = "cart-item";
                li.innerHTML = `
                <img src="${item.image}" class="cart-img" alt="${item.name}" />
                <div class="cart-details">
                    <div class="item-title">${item.name}</div>
                </div>
                <button class="qty-btn" onclick="moveToCart(${index})">+</button>
                <button class="remove-btn" onclick="removeFromWishlist(${index})">🗑️</button>
            `;
                wishlistList.appendChild(li);
            });
        }

        updateWishlistCount();
    }

    window.addToWishlist = function (button) {
        button.innerHTML = '♥ Wishlisted';
    };

    window.removeFromWishlist = function (index, button) {
        wishlist.splice(index, 1);
        saveWishlist();
    };


    window.moveToCart = function (index) {
        const item = wishlist[index];
        const existing = cart.find(i => i.name === item.name);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        wishlist.splice(index, 1);
        saveCart();
        saveWishlist();
        showModal(`🛒 ${item.name} moved to cart!`, item.image);
    };




    // Shared Product Card Events
    document.querySelectorAll('.items-container').forEach(container => {
        const name = container.querySelector('.scroll-txt p')?.innerText.trim() || "Unnamed";
        const priceText = container.querySelector('.price')?.innerText.trim() || "₹0";
        const price = parseFloat(priceText.replace(/[^\d]/g, '')) || 0;
        const image = container.querySelector('.img-scroll img')?.getAttribute('src') || 'placeholder.jpg';

        const buttons = container.querySelectorAll('.scroll-tag .view');
        buttons.forEach(btn => {
            if (!btn.dataset.listenerAttachedAll) {
                btn.dataset.listenerAttachedAll = "true";

                btn.addEventListener('click', () => {
                    const action = btn.innerText.toLowerCase();

                    if (action.includes('add to cart')) {
                        const existing = cart.find(item => item.name === name);
                        if (existing) {
                            existing.quantity += 1;
                        } else {
                            cart.push({ name, price, image, quantity: 1 });
                        }
                        showModal(`🛒 ${name} added to cart!`, image);
                        saveCart();
                    } else if (action.includes('wishlist') || action.includes('♡')) {
                        const alreadyExists = wishlist.some(item => item.name === name);
                        if (!alreadyExists) {
                            wishlist.push({ name, price, image });
                            showModal(`💖 ${name} added to wishlist!`, image);
                            saveWishlist();
                        } else {
                            showModal(`ℹ️ ${name} is already in your wishlist!`);
                        }
                    }
                });
            }
        });
    });

    // Wishlist UI Events
    const wishlistIcon = document.getElementById('wishlist-icon');
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    const wishlistOverlay = document.getElementById('wishlist-overlay');

    wishlistIcon?.addEventListener('click', () => {
        wishlistOverlay?.classList.add('show');
        wishlistDrawer?.classList.add('open');
        updateWishlistUI();
    });

    wishlistOverlay?.addEventListener('click', (e) => {
        if (e.target === wishlistOverlay) {
            wishlistOverlay.classList.remove('show');
            wishlistDrawer.classList.remove('open');
        }
    });

    window.closeWishlist = function () {
        wishlistDrawer?.classList.remove('open');
        wishlistOverlay?.classList.remove('show');
    };

    // ----- Modal -----
    function showModal(message, imageUrl = null) {
        const modal = document.getElementById('cart-modal');
        const msg = document.getElementById('modal-message');
        const image = document.getElementById('modal-product-image');

        msg.textContent = message;
        if (imageUrl) {
            image.src = imageUrl;
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }

        modal.classList.remove('hidden');
        modal.classList.add('show');

        setTimeout(() => {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }, 8000);
    }

    document.getElementById('close-modal-btn')?.addEventListener('click', () => {
        document.getElementById('cart-modal')?.classList.remove('show');
    });

    const cartOverlay = document.getElementById('cart-overlay');
    cartIcon?.addEventListener('click', () => {
        cartOverlay?.classList.add('show');
        cartDrawer?.classList.add('open');
    });

    cartOverlay?.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('show');
            cartDrawer.classList.remove('open');
        }
    });

    window.closeCart = function () {
        cartDrawer?.classList.remove('open');
        cartOverlay?.classList.remove('show');
    };

    document.getElementById("checkout-btn")?.addEventListener("click", () => {
        window.location.href = "checkout.html";
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close Cart Drawer
            document.getElementById('cart-drawer')?.classList.remove('open');
            document.getElementById('cart-overlay')?.classList.remove('show');
    
            // Close Wishlist Drawer
            document.getElementById('wishlist-drawer')?.classList.remove('open');
            document.getElementById('wishlist-overlay')?.classList.remove('show');
        }
    });
    

    // Init counts
    updateCartCount();
    updateCartUI();
    updateWishlistCount();
    updateWishlistUI();
});








