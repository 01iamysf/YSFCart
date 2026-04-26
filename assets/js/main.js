/* =============================================
   YSFCart — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* --------------------------------------------------
       1. Sidenav (mobile hamburger menu)
    -------------------------------------------------- */
    const sidenav  = document.getElementById('sidenav');
    const menubar  = document.getElementById('menubar');
    const overlay  = document.getElementById('sidenav-overlay');

    function openSidenav() {
        if (!sidenav) return;
        sidenav.classList.add('open');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidenav() {
        if (!sidenav) return;
        sidenav.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menubar) {
        menubar.addEventListener('click', function () {
            sidenav && sidenav.classList.contains('open')
                ? closeSidenav()
                : openSidenav();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidenav);
    }

    // Sub-menu toggle in sidenav
    document.querySelectorAll('#sidenav .has-sub > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const parent = this.closest('.has-sub');
            parent.classList.toggle('open');
        });
    });

    /* --------------------------------------------------
       2. Active nav link highlight
    -------------------------------------------------- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav3 a, #sidenav a').forEach(function (a) {
        const href = a.getAttribute('href') || '';
        if (href.endsWith(currentPage)) {
            a.classList.add('active');
        }
    });

    /* --------------------------------------------------
       3. Swiper carousel (Trends section)
    -------------------------------------------------- */
    if (typeof Swiper !== 'undefined' && document.querySelector('.mySwiper')) {
        new Swiper('.mySwiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 45,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    /* --------------------------------------------------
       4. Cart — Add to Cart functionality
    -------------------------------------------------- */
    let cart = JSON.parse(localStorage.getItem('ysf_cart') || '[]');

    function updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
            badge.textContent = total;
            badge.style.display = total > 0 ? 'inline-block' : 'none';
        }
    }

    document.querySelectorAll('.btn-cart').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const card = this.closest('.card');
            const name  = card.querySelector('h2') ? card.querySelector('h2').textContent : 'Product';
            const price = card.querySelector('.card-price') ? card.querySelector('.card-price').textContent : '$0.00';
            const img   = card.querySelector('img') ? card.querySelector('img').src : '';

            const existing = cart.find(function (i) { return i.name === name; });
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name: name, price: price, img: img, qty: 1 });
            }

            localStorage.setItem('ysf_cart', JSON.stringify(cart));
            updateCartBadge();

            // Visual feedback
            btn.textContent = '✓ Added!';
            btn.style.background = '#27ae60';
            setTimeout(function () {
                btn.textContent = 'Add to Cart';
                btn.style.background = '';
            }, 1400);
        });
    });

    updateCartBadge();

    /* --------------------------------------------------
       5. Cart page — render items from localStorage
    -------------------------------------------------- */
    const cartBody = document.getElementById('cart-items');
    if (cartBody) {
        renderCart();
    }

    function renderCart() {
        cart = JSON.parse(localStorage.getItem('ysf_cart') || '[]');
        const emptyMsg = document.getElementById('cart-empty');
        const cartSummary = document.getElementById('cart-summary');

        if (cart.length === 0) {
            cartBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:gray;">Your cart is empty.</td></tr>';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        let totalAmount = 0;
        cartBody.innerHTML = cart.map(function (item, idx) {
            const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
            const subtotal = numericPrice * item.qty;
            totalAmount += subtotal;
            return '<tr>' +
                '<td><img src="' + item.img + '" alt="' + item.name + '"></td>' +
                '<td>' + item.name + '</td>' +
                '<td>' + item.price + '</td>' +
                '<td>' +
                    '<button class="qty-btn" data-idx="' + idx + '" data-action="dec">−</button>' +
                    ' ' + item.qty + ' ' +
                    '<button class="qty-btn" data-idx="' + idx + '" data-action="inc">+</button>' +
                '</td>' +
                '<td>$' + subtotal.toFixed(2) + '</td>' +
                '<td><button class="remove-btn" data-idx="' + idx + '">✕</button></td>' +
            '</tr>';
        }).join('');

        const totalEl = document.getElementById('cart-total');
        if (totalEl) totalEl.textContent = '$' + totalAmount.toFixed(2);

        // Quantity and remove buttons
        cartBody.querySelectorAll('.qty-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const i = parseInt(this.dataset.idx);
                if (this.dataset.action === 'inc') {
                    cart[i].qty += 1;
                } else {
                    cart[i].qty -= 1;
                    if (cart[i].qty < 1) cart.splice(i, 1);
                }
                localStorage.setItem('ysf_cart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
            });
        });

        cartBody.querySelectorAll('.remove-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const i = parseInt(this.dataset.idx);
                cart.splice(i, 1);
                localStorage.setItem('ysf_cart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
            });
        });
    }

    /* --------------------------------------------------
       6. Contact form — basic validation
    -------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            btn.textContent = 'Sent! ✓';
            btn.style.background = '#27ae60';
            this.reset();
            setTimeout(function () {
                btn.textContent = 'Send Message';
                btn.style.background = '';
            }, 3000);
        });
    }

    /* --------------------------------------------------
       7. Auth forms — basic validation
    -------------------------------------------------- */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Login functionality coming soon!');
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Registration functionality coming soon!');
        });
    }

});
