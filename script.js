// array of the products
let products = [
    { id: 1, name: "Laptop", price: 3500000, stock: 5, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop" },
    { id: 2, name: "Mouse", price: 50000, stock: 10, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=150&fit=crop" },
    { id: 3, name: "Keyboard", price: 150000, stock: 8, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=150&fit=crop" },
    { id: 4, name: "Monitor", price: 800000, stock: 3, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=150&fit=crop" },
    { id: 5, name: "Headphones", price: 200000, stock: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop" },
    { id: 6, name: "Speaker", price: 250000, stock: 7, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=150&fit=crop" }
];

// SArray of the shoping cart
let cart = [];


let TAX_RATE = 0.10; // 10% tax
let CURRENCY_SYMBOL = "UGX";

let orderCounter = 1000;

// function to display products on the page
function displayProducts() {
    let productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    // looping through products array
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let card = document.createElement("div");
        card.className = "product-card";

        // Checkin if the product is in stock
        let buttonText = "Add to Cart";
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
    let product = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }

    if (product === null || product.stock <= 0) {
        alert("Product is not available!");
        return;
    }

    let existingItem = null;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            existingItem = cart[i];
            break;
        }
    }

    if (existingItem !== null) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
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
    let itemIndex = -1;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].productId === productId) {
            itemIndex = i;
            break;
        }
    }

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }

        displayCart();
    }
}

// function to display cart
function displayCart() {
    let cartItemsContainer = document.getElementById("cart-items");
    let emptyMessage = document.getElementById("empty-cart-message");
    let cartSummary = document.getElementById("cart-summary");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyMessage.classList.remove("hidden");
        cartSummary.classList.add("hidden");
        return;
    } emptyMessage.classList.add("hidden");
    cartSummary.classList.remove("hidden");

    // looping through the cart items
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let cartItem = document.createElement("div");
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
    let subtotal = 0;

    // looping through the cart items and sum up prices
    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
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
    let subtotal = calculateSubtotal();
    let tax = calculateTax(subtotal);
    let total = calculateTotal(subtotal, tax);

    // update the display
    document.getElementById("subtotal").textContent = "UGX " + subtotal.toLocaleString();
    document.getElementById("tax").textContent = "UGX " + tax.toLocaleString();
    document.getElementById("total").textContent = "UGX " + total.toLocaleString();
}

// function to generate the order ID
function generateOrderId() {
    orderCounter += 1;
    return "ORD-" + orderCounter;
}

// function to place order an order
function placeOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // calculating the final totals
    let subtotal = calculateSubtotal();
    let tax = calculateTax(subtotal);
    let total = calculateTotal(subtotal, tax);

    let orderId = generateOrderId();

    // Populate form fields
    document.getElementById("order-id-field").value = orderId;
    document.getElementById("order-total-field").value = total.toLocaleString();

    // Show the order form modal
    document.getElementById("order-form-modal").classList.remove("hidden");

    // Reset form
    document.getElementById("order-form").reset();
    clearFormValidation();

    // Hide previous success message if any
    document.getElementById("form-success-message").classList.add("hidden");
    document.getElementById("order-form").classList.remove("hidden");
}

function closeFormModal() {
    document.getElementById("order-form-modal").classList.add("hidden");
}

function clearFormValidation() {
    const formGroups = document.querySelectorAll(".form-group");
    formGroups.forEach(group => {
        group.classList.remove("error");
        const errorSpan = group.querySelector(".error-message");
        if (errorSpan) {
            errorSpan.textContent = "";
        }
    });
}

function validateForm() {
    let isValid = true;
    clearFormValidation();

    // Validate name
    const nameInput = document.getElementById("customer-name");
    const nameGroup = document.getElementById("name-group");
    if (!nameInput.value.trim()) {
        nameGroup.classList.add("error");
        document.getElementById("name-error").textContent = "Please enter your name";
        isValid = false;
    } else if (nameInput.value.trim().length < 2) {
        nameGroup.classList.add("error");
        document.getElementById("name-error").textContent = "Name must be at least 2 characters long";
        isValid = false;
    }

    // Validate phone
    const phoneInput = document.getElementById("customer-phone");
    const phoneGroup = document.getElementById("phone-group");
    if (!phoneInput.value.trim()) {
        phoneGroup.classList.add("error");
        document.getElementById("phone-error").textContent = "Please enter your phone number";
        isValid = false;
    } else if (!/^\d{10,}$/.test(phoneInput.value.trim())) {
        phoneGroup.classList.add("error");
        document.getElementById("phone-error").textContent = "Phone number must be at least 10 digits";
        isValid = false;
    }

    // Validate email
    const emailInput = document.getElementById("customer-email");
    const emailGroup = document.getElementById("email-group");
    if (!emailInput.value.trim()) {
        emailGroup.classList.add("error");
        document.getElementById("email-error").textContent = "Please enter your email address";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        emailGroup.classList.add("error");
        document.getElementById("email-error").textContent = "Please enter a valid email address";
        isValid = false;
    }

    // Validate location
    const locationInput = document.getElementById("customer-location");
    const locationGroup = document.getElementById("location-group");
    if (!locationInput.value.trim()) {
        locationGroup.classList.add("error");
        document.getElementById("location-error").textContent = "Please enter your delivery location";
        isValid = false;
    } else if (locationInput.value.trim().length < 5) {
        locationGroup.classList.add("error");
        document.getElementById("location-error").textContent = "Location must be at least 5 characters long";
        isValid = false;
    }

    return isValid;
}

function submitOrderToServer(formData) {
    return fetch("process_order.php", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then(data => {
        try {
            return JSON.parse(data);
        } catch (e) {
            // If response is not JSON, create a success response
            return { success: true, order_id: formData.get("order_id"), total: formData.get("total") };
        }
    })
    .catch(error => {
        console.error("Error:", error);
        // Even if PHP fails, we'll process the order client-side
        return { success: true, order_id: formData.get("order_id"), total: formData.get("total") };
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    // Remove empty cart items if any
    cart = cart.filter(item => item.quantity > 0);

    if (cart.length === 0) {
        alert("Your cart is empty!");
        closeFormModal();
        return;
    }

    if (!validateForm()) {
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    // Calculate final totals
    let subtotal = calculateSubtotal();
    let tax = calculateTax(subtotal);
    let total = calculateTotal(subtotal, tax);

    formData.set("total", total.toFixed(2));

    // Add cart items to form data
    formData.set("cart_items", JSON.stringify(cart));

    submitOrderToServer(formData).then(result => {
        if (result.success || result.success === undefined) {
            // Process the order client-side
            for (let i = 0; i < cart.length; i++) {
                let cartItem = cart[i];
                for (let j = 0; j < products.length; j++) {
                    if (products[j].id === cartItem.productId) {
                        products[j].stock -= cartItem.quantity;
                        break;
                    }
                }
            }

            // Show success message
            document.getElementById("final-order-id").textContent = result.order_id || formData.get("order_id");
            document.getElementById("final-order-total").textContent = "UGX " + parseInt(result.total || formData.get("total")).toLocaleString();

            // Hide form and show success
            document.getElementById("order-form").classList.add("hidden");
            document.getElementById("form-success-message").classList.remove("hidden");

            // Clear the cart
            cart = [];
            displayProducts();
            displayCart();
        } else {
            alert("Error placing order: " + (result.message || "Please try again"));
        }
    });
}

function closeModal() {
    document.getElementById("order-modal").classList.add("hidden");
}

function setupEventListeners() {
    document.getElementById("checkout-btn").addEventListener("click", placeOrder);

    // Order form modal event listeners
    document.getElementById("cancel-form-btn").addEventListener("click", closeFormModal);
    document.getElementById("close-success-btn").addEventListener("click", closeFormModal);

    // Close modal when clicking outside
    document.getElementById("order-form-modal").addEventListener("click", function(event) {
        if (event.target === document.getElementById("order-form-modal")) {
            closeFormModal();
        }
    });

    // Form submission
    document.getElementById("order-form").addEventListener("submit", handleFormSubmit);

    // Real-time validation on blur
    document.getElementById("customer-name").addEventListener("blur", function() {
        validateForm();
    });
    document.getElementById("customer-phone").addEventListener("blur", function() {
        validateForm();
    });
    document.getElementById("customer-email").addEventListener("blur", function() {
        validateForm();
    });
    document.getElementById("customer-location").addEventListener("blur", function() {
        validateForm();
    });
}
document.addEventListener("DOMContentLoaded", function() {
    displayProducts();
    setupEventListeners();
});