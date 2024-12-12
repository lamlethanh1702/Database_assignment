const userIcon = document.querySelector(".header .inner-icon .user-icon");
if(userIcon) {
    const icon = document.querySelector(".header .inner-user");
    const overLay = document.querySelector(".header .inner-icon .inner-user .inner-overlay");

    userIcon.onclick = () => {
        icon.setAttribute("show","yes");
    }
    overLay.onclick = () => {
        icon.setAttribute("show","");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Get all radio buttons with name "category"
    const radios = document.querySelectorAll('input[name="category"]');

    // Add event listener to each radio button
    radios.forEach(radio => {
        radio.addEventListener('change', event => {
            const selectedValue = event.target.value; // Get selected value

            // Send the selected value to the server
            fetch('/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category: selectedValue })
            })
            .then(response => response.text())
            .then(data => {
                console.log(data); // Handle the response (optional)
                // alert(`Selected Category: ${selectedValue}`);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Selectors
    const cartTable = document.querySelector(".cart-list tbody");
    const deleteCartButton = document.querySelector(".button-delete");
    const checkoutButton = document.querySelector(".btn-success");

    // Event delegation for quantity buttons
    cartTable.addEventListener("click", (e) => {
        if (e.target.matches(".btn-outline-secondary")) {
            const isIncrement = e.target.textContent === "+";
            const quantityCell = e.target.closest("td");
            const quantitySpan = quantityCell.querySelector("span");
            const priceCell = e.target.closest("tr").querySelector("td:nth-child(3)");
            const subtotalCell = e.target.closest("tr").querySelector("td:nth-child(5)");
            const unitPrice = parseFloat(priceCell.textContent.replace("$", "").replace(",", "").trim());

            let currentQuantity = parseInt(quantitySpan.textContent);

            // Increase or decrease quantity
            if (isIncrement) {
                currentQuantity += 1;
            } else if (currentQuantity > 1) {
                currentQuantity -= 1;
            }

            // Update quantity and subtotal
            quantitySpan.textContent = currentQuantity;
            subtotalCell.textContent = `${(currentQuantity * unitPrice).toLocaleString()}$`;
        }

        // Delete single product
        if (e.target.closest(".btn-danger")) {
            e.target.closest("tr").remove();
        }

        updateCartTotal();
    });

    // Clear cart
    deleteCartButton.addEventListener("click", () => {
        cartTable.innerHTML = ""; // Clear all rows
        updateCartTotal();
    });

    // Checkout button (placeholder functionality)
    checkoutButton.addEventListener("click", (e) => {
        let total = 0;
        // e.preventDefault();
        const rows = document.querySelectorAll('tbody tr');
    
        rows.forEach(row => {
            const price = parseFloat(row.querySelector('.price').innerText.replace(/[^\d.-]/g, ''));
            const quantity = parseInt(row.querySelector('.quantity').innerText);
            const subtotal = price * quantity;
            total += subtotal;
        });

        fetch("/submit-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ total }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(`Checkout successful! Total: ${total.toLocaleString()}đ`);
                } else {
                    alert("Checkout failed. Please try again.");
                }
            })
            .catch((error) => console.error("Error:", error));

        //alert(`Total price: ${total.toFixed(2)}$`);
    });

    // Function to update cart total
    function updateCartTotal() {
        const subtotalCells = cartTable.querySelectorAll("td:nth-child(5)");
        let total = 0;

        subtotalCells.forEach((cell) => {
            total += parseInt(cell.textContent.replace("đ", "").replace(",", "").trim());
        });

        if (total === 0) {
            alert("Your cart is empty.");
        } else {
            console.log(`Total cart value: ${total.toLocaleString()}đ`);
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener("click", event => {
            const bookID = button.dataset.bookID;
            const title = button.dataset.title;
            const price = button.dataset.book_price;

            console.log(bookID, title, price);
            fetch('/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bookID, title, price })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Item added to cart!');
                } else {
                    alert('Failed to add item to cart.');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
});



// document.getElementById('checkout-btn').addEventListener('click', function () {
//     let totalPrice = 0;
    
//     // Select all rows in the cart list
//     const cartRows = document.querySelectorAll('.cart-list tbody tr');
    
//     cartRows.forEach(row => {
//         const priceElement = row.querySelector('.price'); // Get price element
//         const quantityElement = row.querySelector('.quantity'); // Get quantity element

//         // Parse the price and quantity
//         const price = parseFloat(priceElement.dataset.price); // Assuming Book_Price is stored as a valid number
//         const quantity = parseInt(quantityElement.textContent);

//         // Calculate and add to total
//         totalPrice += price * quantity;
//     });

//     // Display total price (you can also redirect or send it to the backend here)
//     alert(`Total Price: ${totalPrice.toFixed(2)}$`);
// });


// document.addEventListener('DOMContentLoaded', () => {
//     // Select cart elements
//     const cartList = document.querySelector('.cart-list tbody');
//     const deleteCartButton = document.querySelector('.button-delete');
//     const checkoutButton = document.querySelector('.btn-success');
    
//     // Event listener for delete cart
//     deleteCartButton.addEventListener('click', () => {
//         if (confirm('Are you sure you want to delete all items in the cart?')) {
//             cartList.innerHTML = ''; // Clear all items in the cart
//             updateCartTotal();
//         }
//     });

//     // Event listener for checkout
//     checkoutButton.addEventListener('click', () => {
//         alert('Proceeding to checkout...');
//         // You can implement actual checkout functionality here.
//     });

//     // Function to update the cart total price
//     function updateCartTotal() {
//         const cartItems = cartList.querySelectorAll('tr');
//         let total = 0;

//         cartItems.forEach(item => {
//             const quantity = parseInt(item.querySelector('.quantity span').textContent);
//             const price = parseInt(item.querySelector('.book-price').textContent.replace('đ', '').trim());
//             total += quantity * price;
//         });

//         // Update the total price in the UI if needed.
//         console.log(`Total Price: ${total}đ`); // For demonstration, you can replace this with actual UI update logic.
//     }

//     // Event delegation for increment/decrement buttons and deleting individual products
//     cartList.addEventListener('click', (e) => {
//         // Handle increase/decrease quantity
//         if (e.target.classList.contains('btn-outline-secondary')) {
//             const button = e.target;
//             const row = button.closest('tr');
//             const quantitySpan = row.querySelector('.quantity span');
//             const price = row.querySelector('.book-price').textContent;

//             let quantity = parseInt(quantitySpan.textContent);
//             const priceValue = parseInt(price.replace('đ', '').trim());

//             if (button.textContent === '+') {
//                 quantity += 1;
//             } else if (button.textContent === '-') {
//                 if (quantity > 1) quantity -= 1;
//             }

//             // Update quantity in UI
//             quantitySpan.textContent = quantity;

//             // Update subtotal price for the item
//             row.querySelector('.subtotal').textContent = `${quantity * priceValue}đ`;

//             // Update cart total
//             updateCartTotal();
//         }

//         // Handle deleting an individual item
//         if (e.target.closest('.btn-danger')) {
//             const row = e.target.closest('tr');
//             row.remove(); // Remove the row from the cart
//             updateCartTotal(); // Update total after item removal
//         }
//     });
// });