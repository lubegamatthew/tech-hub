// array of the products
var products = [
    { id: 1, name: "Laptop", price: 3500000, stock: 5, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop" },
    { id: 2, name: "Mouse", price: 50000, stock: 10, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=150&fit=crop" },
    { id: 3, name: "Keyboard", price: 150000, stock: 8, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=150&fit=crop" },
    { id: 4, name: "Monitor", price: 800000, stock: 3, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=150&fit=crop" },
    { id: 5, name: "Headphones", price: 200000, stock: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop" },
    { id: 6, name: "Speaker", price: 250000, stock: 7, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=150&fit=crop" }
];

// SArray of the shoping cart
var cart = [];


var TAX_RATE = 0.10; // 10% tax
var CURRENCY_SYMBOL = "UGX";

var orderCounter = 1000;

// function to display products on the page
function displayProducts() {
    var productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    // looping through products array
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var card = document.createElement("div");
        card.className = "product-card";

        // Checkin if the product is in stock
        var buttonText = "Add to Cart";
        if (product.stock <= 0) {
            buttonText = "Out of Stock";
        }

        // constructing the job card with the image
        card.innerHTML = "<img src='" + product.image + "' alt='" + product.name + "' class='product-image'>" +
            "<h3>" + product.name + "</h3>" +
            "<p class='price'>UGX " + product.price.toLocaleString() + "</p>" +
            "<p class='stock'>In Stock: " + product.stock + "</p>" +
            "<button onclick='addToCart(" + product.id + ")' " + (product.stock <= 0 ? "disabled" : "") + ">" +
            buttonText + "</button>";

        productsContainer.appendChild(card);
    }
}

// function to add product to cart
function addToCart(productId) {
    var product = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }

    if (product === null || product.stock <= 0) {
        alert("Product is not available!");
        return;
    }

    var existingItem = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            existingItem = cart[i];
            break;
        }
    }

    if (existingItem !== null) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity = existingItem.quantity + 1;
        } else {
            alert("Cannot add more than available stock!");
            return;
        }
    } else {
        // adding another item to the cart
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    displayCart();
}

// function to remove product from cart
function removeFromCart(productId) {
    var itemIndex = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            itemIndex = i;
            break;
        }
    }

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity = cart[itemIndex].quantity - 1;
        } else {
            cart.splice(itemIndex, 1);
        }

        displayCart();
    }
}

// function to display cart
function displayCart() {
    var cartItemsContainer = document.getElementById("cart-items");
    var emptyMessage = document.getElementById("empty-cart-message");
    var cartSummary = document.getElementById("cart-summary");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyMessage.classList.remove("hidden");
        cartSummary.classList.add("hidden");
        return;
    } emptyMessage.classList.add("hidden");
    cartSummary.classList.remove("hidden");

    // looping through the cart items
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = "<div class='cart-item-info'>" +
            "<div class='cart-item-name'>" + item.name + "</div>" +
            "<div class='cart-item-price'>UGX " + item.price.toLocaleString() + " each</div>" +
            "</div>" +
            "<div class='cart-item-quantity'>" +
            "<button onclick='removeFromCart(" + item.productId + ")'>-</button>" +
            "<span>" + item.quantity + "</span>" +
            "<button onclick='addToCart(" + item.productId + ")'>+</button>" +
            "</div>";

        cartItemsContainer.appendChild(cartItem);
    }

    // calculate and display totals
    updateCartSummary();
}

// function to calculate subtotal
function calculateSubtotal() {
    var subtotal = 0;

    // looping through the cart items and sum up prices
    for (var i = 0; i < cart.length; i++) {
        subtotal = subtotal + (cart[i].price * cart[i].quantity);
    }

    return subtotal;
}
// function to calculate the tax
function calculateTax(subtotal) {
    return subtotal * TAX_RATE;
}

// function to calculate the total
function calculateTotal(subtotal, tax) {
    return subtotal + tax;
}


function updateCartSummary() {
    var subtotal = calculateSubtotal();
    var tax = calculateTax(subtotal);
    var total = calculateTotal(subtotal, tax);

    // update the display
    document.getElementById("subtotal").textContent = "UGX " + subtotal.toLocaleString();
    document.getElementById("tax").textContent = "UGX " + tax.toLocaleString();
    document.getElementById("total").textContent = "UGX " + total.toLocaleString();
}

// function to generate the order ID
function generateOrderId() {
    orderCounter = orderCounter + 1;
    return "ORD-" + orderCounter;
}

// function to place order an order
function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // calculating the final totals
    var subtotal = calculateSubtotal();
    var tax = calculateTax(subtotal);
    var total = calculateTotal(subtotal, tax);

    var orderId = generateOrderId();

    for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];
        for (var j = 0; j < products.length; j++) {
            if (products[j].id === cartItem.productId) {
                products[j].stock = products[j].stock - cartItem.quantity;
                break;
            }
        }
    }

    document.getElementById("order-id").textContent = orderId;
    document.getElementById("order-total").textContent = "UGX " + total.toLocaleString();
    document.getElementById("order-modal").classList.remove("hidden");

    cart = [];

    displayProducts();
    displayCart();
}

function closeModal() {
    document.getElementById("order-modal").classList.add("hidden");
}

function setupEventListeners() {
    document.getElementById("checkout-btn").addEventListener("click", placeOrder);

    document.getElementById("close-modal-btn").addEventListener("click", closeModal); document.getElementById("order-modal").addEventListener("click", function(event) {
        if (event.target === document.getElementById("order-modal")) {
            closeModal();
        }
    });
}
document.addEventListener("DOMContentLoaded", function() {
    displayProducts();
    setupEventListeners();
});