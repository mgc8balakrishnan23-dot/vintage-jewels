
const CART_KEY = "vintageJewelsCart";

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// PRICE FORMAT
function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// ADD PRODUCTS FROM SHOP PAGE
function setupShopButtons() {

    const cards = document.querySelectorAll(".product-container .card");

    cards.forEach(card => {

        const button = card.querySelector("button");
        const image = card.querySelector("img");
        const name = card.querySelector("h3");
        const price = card.querySelector("h4");

        if (!button || !image || !name || !price) return;

        button.addEventListener("click", function () {

            const product = {
                name: name.innerText.trim(),
                price: Number(price.innerText.replace(/[^\d]/g, "")),
                image: image.getAttribute("src"),
                quantity: 1
            };

            const existing = cart.find(
                item => item.name === product.name
            );

            if (existing) {
                existing.quantity++;
            } else {
                cart.push(product);
            }

            saveCart();

            alert(product.name + " Added to Cart Successfully! 💎");

        });

    });
}

// CART COUNT
function updateCartCount() {

    const count = document.getElementById("cart-count");

    if (count) {
        count.innerText = cart.reduce(
            (total, item) => total + item.quantity, 0
        );
    }
}

// DISPLAY CART
function displayCart() {

    const cartItems = document.getElementById("cart-items");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-gem"></i>
                <h2>Your Cart is Empty!</h2>
                <p>Discover our beautiful jewellery collection.</p>
                <a href="shop.html">Explore Jewellery</a>
            </div>
        `;

        updateTotal();
        return;
    }

    cart.forEach((item, index) => {

        cartItems.innerHTML += `
            <div class="cart-product">

                <img src="${item.image}" alt="${item.name}">

                <div class="product-details">

                    <h3>${item.name}</h3>

                    <p class="product-price">
                        ${formatPrice(item.price)}
                    </p>

                    <div class="quantity-box">

                        <button onclick="changeQuantity(${index}, -1)">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                    <button class="remove-btn"
                        onclick="removeProduct(${index})">

                        <i class="fa-solid fa-trash"></i>
                        Remove

                    </button>

                </div>

                <h3>${formatPrice(item.price * item.quantity)}</h3>

            </div>
        `;

    });

    updateTotal();
}

// CHANGE QUANTITY
function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    displayCart();
}

// REMOVE PRODUCT
function removeProduct(index) {

    cart.splice(index, 1);

    saveCart();
    displayCart();
}

// TOTAL CALCULATION
function updateTotal() {

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    // 20% discount for orders above ₹10,000
    const discount = subtotal > 10000 ? subtotal * 0.20 : 0;

    const total = subtotal - discount;

    document.getElementById("subtotal").innerText =
        formatPrice(subtotal);

    document.getElementById("discount").innerText =
        formatPrice(discount);

    document.getElementById("total").innerText =
        formatPrice(total);
}

// CHECKOUT
function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const discount = subtotal > 10000 ? subtotal * 0.20 : 0;

    const total = subtotal - discount;

    alert(
        "Thank you for choosing Vintage Jewels! 💎\n\n" +
        "Your Total Amount: " + formatPrice(total) +
        "\n\nCheckout and payment integration is the next step."
    );
}

// PAGE INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {

    setupShopButtons();

    updateCartCount();

    displayCart();

});
