document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("huftCart")) || [];
    const orderSummary = document.getElementById("order-summary");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
  
    let total = 0;
  
    if (cart.length === 0) {
      orderSummary.innerHTML = "<p>Your cart is empty.</p>";
      document.getElementById("place-order").disabled = true;
      return;
    }
  
    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "order-item";
      row.innerHTML = `<span>${item.name} x${item.quantity}</span><span>₹${item.price * item.quantity}</span>`;
      orderSummary.appendChild(row);
      total += item.price * item.quantity;
    });
  
    subtotalEl.textContent = `₹${total}`;
    totalEl.textContent = `INR ₹${total}`;
  
    document.getElementById("place-order").addEventListener("click", () => {
      const formValid = document.querySelector("#shipping-form").checkValidity();
      if (!formValid) {
        document.querySelector("#shipping-form").reportValidity();
        return;
      }
  
      localStorage.removeItem("huftCart");
      alert("✅ Order placed successfully!");
      window.location.href = "index.html";
    });
  });


  document.addEventListener('DOMContentLoaded', () => {
    const billingRadios = document.querySelectorAll('input[name="billing"]');
    const billingForm = document.getElementById('billing-form');
  
    billingRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'different') {
          billingForm.classList.remove('hidden');
        } else if (radio.value === 'same') {
          billingForm.classList.add('hidden');
        }
      });
    });
  
    document.querySelector('.checkout-btn')?.addEventListener('click', () => {
      alert('✅ Order placed successfully!');
    });
  });
  
  
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const onlineDesc = document.getElementById('online-desc');
      if (radio.value === 'online') {
        onlineDesc.style.display = 'block';
      } else {
        onlineDesc.style.display = 'none';
      }
    });
  });
  


  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('order-summary-container');
    const cart = JSON.parse(localStorage.getItem('huftCart')) || [];
  
    container.innerHTML = ''; // clear existing
  
    cart.forEach(item => {
      const productEl = document.createElement('div');
      productEl.className = 'product';
  
      productEl.innerHTML = `
        <div class="product-img-wrapper">
          <img src="${item.image}" alt="${item.name}" class="product-img">
          <div class="product-qty-badge">${item.quantity}</div>
        </div>
        <div class="product-info">
          <p class="product-title">${item.name}</p>
        </div>
        <div class="product-price">₹${(item.price * item.quantity).toFixed(2)}</div>
      `;
  
      container.appendChild(productEl);
    });
  });
  

  function updateCheckoutTotals() {
    const cart = JSON.parse(localStorage.getItem("huftCart")) || [];
  
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
  
    const shipping = subtotal > 499 ? 0 : 79; // Free shipping over ₹499
    const total = subtotal + shipping;
  
    // Update HTML elements
    document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
    document.getElementById('checkout-total').textContent = `₹${total.toFixed(2)}`;
  }
  
  // Call on page load
  document.addEventListener('DOMContentLoaded', updateCheckoutTotals);
  

  function goBack() {
    window.history.back();
  }
  