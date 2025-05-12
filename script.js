// Menu prices
const menuPrices = {
    // Hot Beverages
    'Espresso Coffee': 104,
    'Hot Coffee': 53,
    'Special Coffee': 66,
    // Cold Beverages
    'Badam Shake': 50,
    'Banana Shake': 45,
    'Chocolate Milk': 116,
    'Chocolate Shake': 55,
    'Cold Cream Coffee': 92,
    'Kesar Shake': 66,
    'Mango Shake': 85,
    'Roohafza Milk Shake': 81,
    'Strawberry Shake': 75,
    // Special Drinks
    'Lemon Squash': 69,
    'Roohafza Sharbat': 80,
    // Snacks
    'Paneer Pakoda': 40,
    'Samosa': 25,
    'Vada Pav': 30,
    // Water
    'Bisleri': 20
};

// DOM Elements
// const menuBtn = document.querySelector('.menu-btn');
// const menuOverlay = document.querySelector('.menu-overlay');
// const closeBtn = document.querySelector('.close-btn');
const submitBtn = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const printBtn = document.querySelector('.print-btn');
const itemNameInput = document.getElementById('item-name');
const itemQtyInput = document.getElementById('item-qty');
const billTable = document.querySelector('tbody');
const subtotalElement = document.querySelector('.subtotal');
const taxElement = document.querySelector('.tax');
const totalElement = document.querySelector('.total-price');
const orderTimeElement = document.querySelector('.order-time');
const themeToggle = document.querySelector('.theme-toggle');

// Initialize order time
updateOrderTime();

// Event Listeners
// menuBtn.addEventListener('click', toggleMenu);
// closeBtn.addEventListener('click', toggleMenu);
submitBtn.addEventListener('click', addItem);
clearBtn.addEventListener('click', clearBill);
printBtn.addEventListener('click', printBill);
themeToggle.addEventListener('click', toggleTheme);

// Functions
function updateOrderTime() {
    const now = new Date();
    orderTimeElement.textContent = now.toLocaleString();
}

function addItem() {
    const itemName = itemNameInput.value;
    const quantity = parseInt(itemQtyInput.value);

    if (!itemName || !menuPrices[itemName]) {
        showNotification('Please select a valid item from the menu');
        return;
    }

    if (quantity < 1) {
        showNotification('Please enter a valid quantity');
        return;
    }

    const price = menuPrices[itemName];
    const total = price * quantity;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${itemName}</td>
        <td>₹${price}</td>
        <td>${quantity}</td>
        <td>₹${total}</td>
        <td class="action-row">
            <button class="action-btn" onclick="removeItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;

    billTable.appendChild(row);
    updateTotals();
    resetForm();
}

function removeItem(button) {
    button.closest('tr').remove();
    updateTotals();
}

function updateTotals() {
    let subtotal = 0;
    const rows = billTable.getElementsByTagName('tr');

    for (let row of rows) {
        const total = parseInt(row.cells[3].textContent.replace('₹', ''));
        subtotal += total;
    }

    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    subtotalElement.textContent = `₹${subtotal}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
}

function resetForm() {
    itemNameInput.selectedIndex = 0;
    itemQtyInput.value = '1';
    itemNameInput.focus();
}

function clearBill() {
    if (confirm('Are you sure you want to clear the bill?')) {
        billTable.innerHTML = '';
        updateTotals();
        resetForm();
    }
}

function printBill() {
    const printSection = document.querySelector('.print-section');
    const printContent = document.querySelector('.print-bill');
    
    // Create bill content
    printContent.innerHTML = `
        <div class="bill-details">
            <h2 style="text-align:center; margin-bottom:0.5rem;">Aurora Bistro</h2>
            <p style="text-align:center; margin-bottom:0.5rem; font-style:italic; color:#4ECDC4;">A Symphony of Flavors</p>
            <p style="text-align:center; margin-bottom:1rem;">Ghatkesar, Hyderabad | 9999999999 | <a href='mailto:aurorabistro@gmail.com' style='color:inherit;text-decoration:none;'>aurorabistro@gmail.com</a></p>
            <p>Date: ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${billTable.innerHTML.replace(/<button.*?<\/button>/g, '')}
                </tbody>
            </table>
            <div class="bill-totals">
                <p>Subtotal: ${subtotalElement.textContent}</p>
                <p>Tax (5%): ${taxElement.textContent}</p>
                <p>Total: ${totalElement.textContent}</p>
            </div>
            <div style="text-align:center; margin-top:1.5rem;">
                <p>Thank you for dining with us!</p>
                <p>Visit us again!</p>
            </div>
        </div>
    `;

    // Show print section
    printSection.style.display = 'block';
    
    // Print
    window.print();
    
    // Hide print section
    printSection.style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: var(--shadow);
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .dark-theme {
        --primary-color: #1a1a1a;
        --text-color: #ffffff;
        --light-bg: #2c2c2c;
        --white: #333333;
    }
`;
document.head.appendChild(style);