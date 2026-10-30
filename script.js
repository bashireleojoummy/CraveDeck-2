// ================================
// CRAVEDECK SHOPPING CART
// ================================

// Load saved cart items from localStorage.
let cart = JSON.parse(localStorage.getItem("craveDeckCart")) || [];

// Format prices in Nigerian Naira.
function formatPrice(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

// Save cart items so they remain available between pages.
function saveCart() {
    localStorage.setItem("craveDeckCart", JSON.stringify(cart));
}

// Add an item to the shopping cart.
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    displayCart();

    alert(name + " added to your cart!");
}

// Display the shopping cart when its elements exist.
function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    // Other pages may not contain a cart section.
    if (!cartItems || !cartTotal) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is waiting for something delicious.
            </p>
        `;

        cartTotal.textContent = formatPrice(0);
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>${formatPrice(item.price)} each</p>
                </div>

                <div class="cart-item-actions">
                    <button class="quantity-btn"
                        onclick="changeQuantity(${index}, -1)"
                        aria-label="Decrease quantity">−</button>

                    <span>${item.quantity}</span>

                    <button class="quantity-btn"
                        onclick="changeQuantity(${index}, 1)"
                        aria-label="Increase quantity">+</button>

                    <button class="remove-btn"
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = formatPrice(total);
}

// Change the quantity of an item.
function changeQuantity(index, amount) {
    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

// Remove an item from the cart.
function removeFromCart(index) {
    if (index < 0 || index >= cart.length) return;

    cart.splice(index, 1);

    saveCart();
    displayCart();
}

// Connect Add to Cart buttons on any page.
document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", function () {
        const name = this.dataset.name;
        const price = Number(this.dataset.price);

        addToCart(name, price);
    });
});

// Checkout demonstration, if the checkout button exists.
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty! Add some delicious food first.");
            return;
        }

        const total = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const confirmed = confirm(
            "Your total is " + formatPrice(total) +
            ". This is a demonstration checkout. No payment will be taken."
        );

        if (confirmed) {
            alert("Thank you for choosing CraveDeck!");

            cart = [];
            saveCart();
            displayCart();
        }
    });
}

// Automatically display the current year when the element exists.
const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Display the cart if the current page contains it.
displayCart();