// ====================
// 1. DATA AND STATE
// ====================
const games = [
    { id: '1', title: 'Adopt Me!', price: 299, image: 'https://placehold.co/400x300/e9d5ff/4b5563?text=Adopt+Me!' },
    { id: '2', title: 'Brookhaven', price: 199, image: 'https://placehold.co/400x300/d1d5db/374151?text=Brookhaven' },
    { id: '3', title: 'Murder Mystery 2', price: 349, image: 'https://placehold.co/400x300/fecaca/991b1b?text=Murder+Mystery+2' },
    { id: '4', title: 'Tower of Hell', price: 249, image: 'https://placehold.co/400x300/a5f3fc/083344?text=Tower+of+Hell' },
    { id: '5', title: 'Piggy', price: 179, image: 'https://placehold.co/400x300/fca5a5/7f1d1d?text=Piggy' },
    { id: '6', title: 'Jailbreak', price: 299, image: 'https://placehold.co/400x300/bfdbfe/1e3a8a?text=Jailbreak' },
    { id: '7', title: 'Royale High', price: 219, image: 'https://placehold.co/400x300/dbeafe/1e40af?text=Royale+High' },
    { id: '8', title: 'Welcome to Bloxburg', price: 399, image: 'https://placehold.co/400x300/d1fae5/065f46?text=Welcome+to+Bloxburg' },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const DISCOUNT_CODE = 'GAMER20';
const DISCOUNT_PERCENTAGE = 20;
let discountApplied = false;

// ====================
// 2. DOM ELEMENTS
// ====================
const gamesGrid = document.getElementById('games-grid');
const cartIcon = document.getElementById('cart-icon');
const cartCountSpan = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartModalContent = document.getElementById('cart-modal-content');
const closeCartModalBtn = document.getElementById('close-cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalSpan = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutModalContent = document.getElementById('checkout-modal-content');
const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const discountCodeInput = document.getElementById('discount-code-input');
const applyDiscountBtn = document.getElementById('apply-discount-btn');
const discountMessage = document.getElementById('discount-message');
const checkoutSubtotalSpan = document.getElementById('checkout-subtotal');
const checkoutDiscountSpan = document.getElementById('checkout-discount');
const checkoutTotalSpan = document.getElementById('checkout-total');
const gcashDetails = document.getElementById('gcash-details');
const bpiDetails = document.getElementById('bpi-details');
const paypalDetails = document.getElementById('paypal-details');
const googleDriveEmailInput = document.getElementById('google-drive-email');
const payNowBtn = document.getElementById('pay-now-btn');
const paymentStatusMessage = document.getElementById('payment-status-message');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmationModalContent = document.getElementById('confirmation-modal-content');
const confirmedDriveEmailSpan = document.getElementById('confirmed-drive-email');
const closeConfirmationModalBtn = document.getElementById('close-confirmation-modal');
const supportForm = document.getElementById('support-form');
const supportMessageStatus = document.getElementById('support-message-status');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const userAvatar = document.getElementById('user-avatar');
const mainContent = document.getElementById('main-content');
const loginModal = document.getElementById('login-modal');
const loginModalContent = document.getElementById('login-modal-content');
const closeLoginModalBtn = document.getElementById('close-login-modal');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const signupModal = document.getElementById('signup-modal');
const signupModalContent = document.getElementById('signup-modal-content');
const closeSignupModalBtn = document.getElementById('close-signup-modal');
const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');
const switchToSignupLink = document.getElementById('switch-to-signup');
const switchToLoginLink = document.getElementById('switch-to-login');

// ====================
// 3. CORE FUNCTIONS
// ====================

/**
 * Toggles the visibility of a modal.
 * @param {HTMLElement} modal - The modal element.
 * @param {boolean} show - Whether to show or hide the modal.
 */
function toggleModal(modal, show) {
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show');
            modal.querySelector('.modal-content-transition').classList.remove('scale-95', 'opacity-0');
        }, 10);
    } else {
        modal.querySelector('.modal-content-transition').classList.add('scale-95', 'opacity-0');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

/**
 * Renders the games on the main page.
 */
function displayProducts() {
    gamesGrid.innerHTML = '';
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'bg-white rounded-xl shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl flex flex-col';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="w-full h-48 object-cover">
            <div class="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">${game.title}</h3>
                    <p class="text-lg text-gray-600 font-medium">₱${game.price.toFixed(2)}</p>
                </div>
                <button class="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 add-to-cart-btn" data-id="${game.id}">
                    Add to Cart
                </button>
            </div>
        `;
        gamesGrid.appendChild(gameCard);
    });
}

/**
 * Updates the shopping cart display in the modal.
 */
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        emptyCartMessage.classList.add('hidden');
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        cart.forEach(item => {
            const game = games.find(g => g.id === item.id);
            if (game) {
                const itemTotal = game.price * item.quantity;
                subtotal += itemTotal;
                const cartItem = document.createElement('div');
                cartItem.className = 'flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm';
                cartItem.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <img src="${game.image}" alt="${game.title}" class="w-16 h-16 rounded-lg object-cover">
                        <div>
                            <h4 class="font-bold text-lg">${game.title}</h4>
                            <p class="text-gray-600">₱${game.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="font-bold text-lg text-blue-700">₱${itemTotal.toFixed(2)}</span>
                        <button class="remove-from-cart-btn text-red-500 hover:text-red-700 transition-colors" data-id="${game.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            }
        });
    }

    cartSubtotalSpan.textContent = `₱${subtotal.toFixed(2)}`;
    cartCountSpan.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Updates the checkout summary with correct totals and discounts.
 */
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => {
        const game = games.find(g => g.id === item.id);
        return sum + (game.price * item.quantity);
    }, 0);

    const discountAmount = discountApplied ? (subtotal * (DISCOUNT_PERCENTAGE / 100)) : 0;
    const total = subtotal - discountAmount;

    checkoutSubtotalSpan.textContent = `₱${subtotal.toFixed(2)}`;
    checkoutDiscountSpan.textContent = `-₱${discountAmount.toFixed(2)}`;
    checkoutTotalSpan.textContent = `₱${total.toFixed(2)}`;
}

/**
 * Displays GCash payment details.
 */
function displayGcashDetails() {
    const total = cart.reduce((sum, item) => {
        const game = games.find(g => g.id === item.id);
        return sum + (game.price * item.quantity);
    }, 0);
    const amountDue = discountApplied ? (total * (1 - DISCOUNT_PERCENTAGE / 100)) : total;

    const qrContainer = document.getElementById('gcash-qr-code-container');
    qrContainer.innerHTML = ''; // Clear previous QR code

    new QRCode(qrContainer, {
        text: `GCash|${amountDue.toFixed(2)}|0969-XXX-XXXX`,
        width: 180,
        height: 180
    });
}

/**
 * Displays PayPal payment details.
 */
function displayPaypalDetails() {
    const total = cart.reduce((sum, item) => {
        const game = games.find(g => g.id === item.id);
        return sum + (game.price * item.quantity);
    }, 0);
    const amountDue = discountApplied ? (total * (1 - DISCOUNT_PERCENTAGE / 100)) : total;

    // This is where you would integrate the PayPal SDK
    // For this mock-up, we just display a message and a button
    paypalDetails.innerHTML = `
        <h3 class="text-xl font-semibold mb-3 text-blue-800">PayPal Payment</h3>
        <p class="text-gray-700 mb-3">You will be redirected to PayPal to complete your payment of ₱${amountDue.toFixed(2)}.</p>
        <div class="mt-4 text-center">
            <button id="pay-with-paypal-btn" class="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors">
                Pay with PayPal
            </button>
        </div>
    `;

    document.getElementById('pay-with-paypal-btn').addEventListener('click', (e) => {
        e.preventDefault();
        // Here you would initiate the PayPal payment process
        alert('Redirecting to PayPal for payment...');
        
        // Simulating a successful payment
        setTimeout(() => {
            showConfirmationModal(googleDriveEmailInput.value);
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }, 1500);
    });
}

/**
 * Shows the confirmation modal and resets the cart.
 * @param {string} email - The user's Google Drive email.
 */
function showConfirmationModal(email) {
    confirmedDriveEmailSpan.textContent = email;
    toggleModal(checkoutModal, false);
    toggleModal(confirmationModal, true);
}

// ====================
// 4. EVENT LISTENERS
// ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initial display of products and cart
    displayProducts();
    updateCartDisplay();

    // Check if user is logged in from local storage
    if (localStorage.getItem('userLoggedIn') === 'true') {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
            userAvatar.classList.remove('hidden');
            userAvatar.src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${loggedInUser}`;
            mainContent.classList.remove('hidden');
        }
    } else {
        mainContent.classList.remove('hidden');
    }

    // Add to cart buttons
    gamesGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const gameId = e.target.dataset.id;
            const existingItem = cart.find(item => item.id === gameId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: gameId, quantity: 1 });
            }
            updateCartDisplay();
            alert('Item added to cart!');
        }
    });

    // Cart icon click
    cartIcon.addEventListener('click', () => {
        updateCartDisplay();
        toggleModal(cartModal, true);
    });

    // Close modals
    closeCartModalBtn.addEventListener('click', () => toggleModal(cartModal, false));
    closeCheckoutModalBtn.addEventListener('click', () => toggleModal(checkoutModal, false));
    closeConfirmationModalBtn.addEventListener('click', () => toggleModal(confirmationModal, false));
    continueShoppingBtn.addEventListener('click', () => toggleModal(cartModal, false));
    
    // Proceed to Checkout
    checkoutBtn.addEventListener('click', () => {
        toggleModal(cartModal, false);
        toggleModal(checkoutModal, true);
        discountApplied = false;
        discountCodeInput.value = '';
        discountMessage.textContent = '';
        
        // Update to handle different payment methods
        updateCheckoutSummary();
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (selectedPaymentMethod.value === 'gcash') {
            displayGcashDetails();
        } else if (selectedPaymentMethod.value === 'paypal') {
            displayPaypalDetails();
        }
    });

    // Apply discount code
    applyDiscountBtn.addEventListener('click', () => {
        if (discountCodeInput.value.toUpperCase() === DISCOUNT_CODE) {
            discountApplied = true;
            discountMessage.textContent = 'Discount applied successfully!';
            discountMessage.className = 'mt-3 text-sm font-medium text-green-600';
        } else {
            discountApplied = false;
            discountMessage.textContent = 'Invalid discount code.';
            discountMessage.className = 'mt-3 text-sm font-medium text-red-600';
        }
        updateCheckoutSummary();
    });

    // Remove item from cart
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-from-cart-btn')) {
            const gameId = e.target.closest('.remove-from-cart-btn').dataset.id;
            cart = cart.filter(item => item.id !== gameId);
            updateCartDisplay();
        }
    });
    
    // Payment method switch
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            gcashDetails.classList.add('hidden');
            bpiDetails.classList.add('hidden');
            paypalDetails.classList.add('hidden');
            payNowBtn.classList.remove('hidden');

            if (e.target.value === 'gcash') {
                gcashDetails.classList.remove('hidden');
                displayGcashDetails();
            } else if (e.target.value === 'bpi') {
                bpiDetails.classList.remove('hidden');
            } else if (e.target.value === 'paypal') {
                paypalDetails.classList.remove('hidden');
                payNowBtn.classList.add('hidden'); // Hide the main Pay Now button
                displayPaypalDetails();
            }
        });
    });

    // Pay Now button
    payNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const driveEmail = googleDriveEmailInput.value;
        if (!driveEmail) {
            paymentStatusMessage.textContent = 'Please enter your Google Drive email.';
            paymentStatusMessage.className = 'mt-4 text-center text-lg font-medium text-red-600';
            return;
        }

        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        if (selectedMethod === 'gcash' || selectedMethod === 'bpi') {
            paymentStatusMessage.textContent = 'Processing payment...';
            paymentStatusMessage.className = 'mt-4 text-center text-lg font-medium text-blue-600';
            
            setTimeout(() => {
                showConfirmationModal(driveEmail);
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }, 2000);
        }
    });

    // Support form submission
    supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        supportMessageStatus.textContent = 'Sending message...';
        supportMessageStatus.className = 'mt-4 text-center text-lg font-medium text-blue-600';

        setTimeout(() => {
            supportMessageStatus.textContent = 'Message sent successfully! We will get back to you shortly.';
            supportMessageStatus.className = 'mt-4 text-center text-lg font-medium text-green-600';
            supportForm.reset();
        }, 1500);
    });

    // Login/Signup functionality
    loginBtn.addEventListener('click', () => toggleModal(loginModal, true));
    signupBtn.addEventListener('click', () => toggleModal(signupModal, true));
    closeLoginModalBtn.addEventListener('click', () => toggleModal(loginModal, false));
    closeSignupModalBtn.addEventListener('click', () => toggleModal(signupModal, false));
    
    switchToSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(loginModal, false);
        toggleModal(signupModal, true);
    });

    switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(signupModal, false);
        toggleModal(loginModal, true);
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const storedUsers = JSON.parse(localStorage.getItem('users')) || {};
        if (storedUsers[username] && storedUsers[username].password === password) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('loggedInUser', username);
            alert('Login successful!');
            window.location.reload();
        } else {
            loginMessage.textContent = 'Invalid username or password.';
            loginMessage.className = 'mt-4 text-center text-lg font-medium text-red-600';
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const storedUsers = JSON.parse(localStorage.getItem('users')) || {};

        if (password !== confirmPassword) {
            signupMessage.textContent = 'Passwords do not match.';
            signupMessage.className = 'mt-4 text-center text-lg font-medium text-red-600';
            return;
        }
        if (storedUsers[username]) {
            signupMessage.textContent = 'Username already exists.';
            signupMessage.className = 'mt-4 text-center text-lg font-medium text-red-600';
            return;
        }

        storedUsers[username] = { password: password };
        localStorage.setItem('users', JSON.stringify(storedUsers));
        signupMessage.textContent = 'Account created successfully! You can now log in.';
        signupMessage.className = 'mt-4 text-center text-lg font-medium text-green-600';
        signupForm.reset();
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('loggedInUser');
        window.location.reload();
    });
});