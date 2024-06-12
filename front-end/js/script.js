document.addEventListener('DOMContentLoaded', () => {
    // Handle product upload form submission
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            const productData = {
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                description: formData.get('description'),
                image_url: formData.get('image_url'),
                farmer_id: JSON.parse(localStorage.getItem('user')).id
            };

            fetch('http://localhost:3000/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to upload product');
                } else {
                    alert('Product uploaded successfully');
                    uploadForm.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to upload product');
            });
        });
    }

    // Load products
    const productList = document.getElementById('product-list');
    if (productList) {
        fetch('http://localhost:3000/api/products')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = products.map(product => `
                    <div class="product-item">
                        <img src="${product.image_url}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>$${product.price.toFixed(2)}</p>
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                `).join('');
            });
    }

    // Handle cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');
    const checkoutButton = document.getElementById('checkoutButton');

    if (cartList) {
        renderCart();
    }

    function renderCart() {
        cartList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
    }

    window.addToCart = (id) => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(response => response.json())
            .then(product => {
                const cartItem = cart.find(item => item.id === product.id);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                alert('Product added to cart');
            });
    };

    window.removeFromCart = (id) => {
        const index = cart.findIndex(item => item.id === id);
        if (index > -1) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            alert('Product removed from cart');
        }
    };

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const paymentMethod = checkoutForm.paymentMethod.value;

            // Simulate payment process
            setTimeout(() => {
                alert(`Payment successful using ${paymentMethod}`);
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});
