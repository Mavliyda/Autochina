\
document.addEventListener('DOMContentLoaded', () => {

    // Заглушка для товаров, у которых нет своего фото (красивая векторная шестеренка)
    const svgPartPlaceholder = `
    <svg class="product-card__placeholder-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="20" stroke="#ff4d4d" stroke-width="3" stroke-dasharray="6 4"/>
        <circle cx="32" cy="32" r="10" stroke="#333" stroke-width="2"/>
        <path d="M12 32H22M42 32H52M32 12V22M32 42V52" stroke="#333" stroke-width="3" stroke-linecap="round"/>
    </svg>`;

    // ==========================================================================
    // 1. СЕКРЕТНЫЙ РЕЖИМ АДМИНИСТРАТОРА (Включение по Ctrl + Shift + A)
    // ==========================================================================
    window.addEventListener('keydown', (e) => {
        // Проверяем нажатие Ctrl + Shift + A (учитываем русскую и английскую раскладки)
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ф' || e.key === 'Ф')) {
            document.body.classList.toggle('admin-mode');
            
            if (document.body.classList.contains('admin-mode')) {
                alert('🔓 Режим администратора включен!\n\nВнизу страницы появилась панель добавления товаров.\nНа карточках товаров и отзывов появились крестики (×) для удаления.');
                const adminPanel = document.getElementById('admin-panel');
                if (adminPanel) adminPanel.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('🔒 Режим администратора выключен.\nПанель управления и кнопки удаления снова скрыты от клиентов.');
            }
        }
    });

    // ==========================================================================
    // 2. МОБИЛЬНОЕ МЕНЮ (БУРГЕР)
    // ==========================================================================
    const burger = document.getElementById('menu-burger');
    const navMenu = document.getElementById('nav');
    
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burger.classList.toggle('active');
        });
        
        // Закрываем меню при клике на любую ссылку в нём
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                burger.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // 3. АВТОМАТИЧЕСКИЙ СЛАЙДЕР С ТОЧКАМИ
    // ==========================================================================
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slider-dots');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0 && dotsContainer) {
        // Создаем динамические точки под количество слайдов
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function changeSlide() {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            resetTimer();
        }

        function resetTimer() {
            clearInterval(slideInterval);
            slideInterval = setInterval(changeSlide, 4000);
        }

        slideInterval = setInterval(changeSlide, 4000);
    }

    // ==========================================================================
    // 4. ДАННЫЕ И БАЗА ДАННЫХ (LOCALSTORAGE)
    // ==========================================================================
    
    // Стартовые товары (если в браузере еще ничего не сохранено)
    const initialProducts = [
        { id: 1, title: "Тормозные колодки Brembo (Ceramic)", brand: "Geely", models: "Monjaro / Tugella", price: 25, desc: "Увеличенный ресурс, полное отсутствие скрипа и пыли.", image: "" },
        { id: 2, title: "Комплект иридиевых свечей NGK", brand: "Chery", models: "Tiggo 7 Pro / 8 Pro", price: 40, desc: "Обеспечивают стабильный запуск двигателя в любые морозы.", image: "" },
        { id: 3, title: "Фильтр масляный + Воздушный (Комплект)", brand: "Changan", models: "CS75 Plus / CS55", price: 15, desc: "Оригинальный заводской набор для планового ТО.", image: "" }
    ];
    let products = JSON.parse(localStorage.getItem('my_custom_catalog')) || initialProducts;

    // Стартовые отзывы
    const initialReviews = [
        { id: 1, name: "Александр В.", status: "СТО «Макс-Авто» (Россия)", stars: "⭐⭐⭐⭐⭐", text: "Заказывал оптику и бамперы оптом для BYD. Приехало в жесткой деревянной обрешетке, всё идеально целое!", image: "" },
        { id: 2, name: "Канат И.", status: "Магазин деталей (Казахстан)", stars: "⭐⭐⭐⭐⭐", text: "Постоянно берем расходники на Changan и Haval. Доставка до Алматы очень быстрая, клиенты довольны.", image: "" }
    ];
    let reviews = JSON.parse(localStorage.getItem('my_custom_reviews')) || initialReviews;
    
    // Временный массив корзины
    let cart = [];

    // Поиск элементов на странице
    const catalogGrid = document.getElementById('catalog-grid');
    const reviewsGrid = document.getElementById('reviews-grid');
    const adminForm = document.getElementById('admin-form');
    const addReviewForm = document.getElementById('add-review-form');
    const cartToggle = document.getElementById('cart-toggle');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const carVinInput = document.getElementById('form-car-vin');

    // Элементы модального окна отзывов
    const openReviewModalBtn = document.getElementById('open-review-modal-btn');
    const closeReviewModalBtn = document.getElementById('close-review-modal-btn');
    const reviewModal = document.getElementById('review-modal');

    // Элементы для анимации карты
    const cardInputNumber = document.getElementById('card-input-number');
    const cardInputExpiry = document.getElementById('card-input-expiry');
    const cardViewNumber = document.getElementById('card-view-number');
    const cardViewExpiry = document.getElementById('card-view-expiry');

    // Управление модальным окном отзывов
    if (openReviewModalBtn) openReviewModalBtn.addEventListener('click', () => reviewModal.classList.add('active'));
    if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', () => reviewModal.classList.remove('active'));
    if (reviewModal) {
        reviewModal.addEventListener('click', (e) => { if (e.target === reviewModal) reviewModal.classList.remove('active'); });
    }

    // ==========================================================================
    // 5. ИНТЕРАКТИВНЫЙ ВВОД БАНКОВСКОЙ КАРТЫ (МАСКИ С ОТРИСОВКОЙ)
    // ==========================================================================
    if (cardInputNumber) {
        cardInputNumber.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = val.match(/\d{4,16}/g);
            let match = (matches && matches[0]) || '';
            let parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) { parts.push(match.substring(i, i + 4)); }
            e.target.value = parts.length > 0 ? parts.join(' ') : val;
            cardViewNumber.textContent = e.target.value || '•••• •••• •••• ••••';
        });
    }

    if (cardInputExpiry) {
        cardInputExpiry.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\//g, '').replace(/[^0-9]/gi, '');
            if (val.length >= 2) { e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4); }
            else { e.target.value = val; }
            cardViewExpiry.textContent = e.target.value || 'MM/YY';
        });
    }

    // ==========================================================================
    // 6. ОТОБРАЖЕНИЕ ТОВАРОВ ИЗ КАТАЛОГА
    // ==========================================================================
    function renderCatalog() {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            const imgContent = product.image ? `<img src="${product.image}" class="product-card__img" alt="фото товара">` : svgPartPlaceholder;
            
            card.innerHTML = `
                <button class="product-admin-delete-btn" data-id="${product.id}">×</button>
                <div class="product-card__img-container">${imgContent}</div>
                <div class="product-card__body">
                    <span class="product-card__compatibility">${product.brand}</span>
                    <p class="product-card__models">${product.models}</p>
                    <h3 class="product-card__title">${product.title}</h3>
                    <p class="product-card__desc">${product.desc}</p>
                    <div class="product-card__footer">
                        <span class="product-card__price">$${product.price}</span>
                        <button type="button" class="btn product-card__btn" data-id="${product.id}">В корзину</button>
                    </div>
                </div>`;
            catalogGrid.appendChild(card);
        });

        // Вешаем события на кнопки удаления деталей (доступны только админу)
        document.querySelectorAll('.product-admin-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                products = products.filter(p => p.id !== id);
                localStorage.setItem('my_custom_catalog', JSON.stringify(products));
                renderCatalog();
            });
        });

        // Вешаем события на кнопки добавления товара в корзину
        document.querySelectorAll('.product-card__btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const item = products.find(p => p.id === id);
                if (item) { 
                    cart.push(item); 
                    updateCartUI(); 
                }
            });
        });
    }

    // ==========================================================================
    // 7. ОТОБРАЖЕНИЕ ОТЗЫВОВ КЛИЕНТОВ (ВЫВОД ОЦЕНОК 1-5)
    // ==========================================================================
    function renderReviews() {
        if (!reviewsGrid) return;
        reviewsGrid.innerHTML = '';
        
        // Разворачиваем массив, чтобы новые отзывы были самыми первыми сверху
        const invertedReviews = [...reviews].reverse();

        invertedReviews.forEach(review => {
            const card = document.createElement('div');
            card.classList.add('review-card');
            const firstLetter = review.name ? review.name.charAt(0).toUpperCase() : 'У';
            const photoContent = review.image ? `<img src="${review.image}" class="review-attached-img" alt="фото отзыва">` : `<div class="review-attached-photo-placeholder">📸 Заказ получен без фотоотчета</div>`;

            card.innerHTML = `
                <button class="review-delete-btn" data-id="${review.id}">×</button>
                <div class="review-user">
                    <div class="review-avatar-stub">${firstLetter}</div>
                    <div>
                        <h4 class="review-user__name">${review.name}</h4>
                        <p class="review-user__status">${review.status}</p>
                    </div>
                </div>
                <div class="review-card__stars">${review.stars}</div>
                <p class="review-card__text">"${review.text}"</p>
                ${photoContent}`;
            reviewsGrid.appendChild(card);
        });

        // Кнопка удаления отзыва для админа
        document.querySelectorAll('.review-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                reviews = reviews.filter(r => r.id !== id);
                localStorage.setItem('my_custom_reviews', JSON.stringify(reviews));
                renderReviews();
            });
        });
    }

    // ==========================================================================
    // 8. ФОРМА: КЛИЕНТ ДОБАВЛЯЕТ ОТЗЫВ И ФОТО
    // ==========================================================================
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value;
            const status = document.getElementById('review-status').value;
            const stars = document.getElementById('review-stars').value;
            const text = document.getElementById('review-text').value;
            const fileInput = document.getElementById('review-file');

            const newReview = { id: Date.now(), name, status, stars, text, image: "" };

            const saveReview = () => {
                reviews.push(newReview);
                localStorage.setItem('my_custom_reviews', JSON.stringify(reviews));
                renderReviews();
                addReviewForm.reset();
                reviewModal.classList.remove('active');
                alert('🎉 Спасибо! Ваш отзыв с оценкой успешно опубликован на сайте.');
            };

            // Если прикреплен файл картинки, считываем его через FileReader
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => { 
                    newReview.image = event.target.result; 
                    saveReview(); 
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else { 
                saveReview(); 
            }
        });
    }

    // ==========================================================================
    // 9. ФОРМА АДМИНИСТРАТОРА: ДОБАВЛЕНИЕ НОВОЙ ЗАПЧАСТИ
    // ==========================================================================
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('admin-title').value;
            const brand = document.getElementById('admin-brand').value;
            const models = document.getElementById('admin-models').value;
            const price = parseInt(document.getElementById('admin-price').value) || 0;
            const desc = document.getElementById('admin-desc').value;
            const fileInput = document.getElementById('admin-file');

            const newProduct = { id: Date.now(), title, brand, models, price, desc, image: "" };

            const saveProduct = () => {
                products.push(newProduct);
                localStorage.setItem('my_custom_catalog', JSON.stringify(products));
                renderCatalog();
                adminForm.reset();
                alert('🚀 Новая деталь добавлена в каталог сайта!');
            };

            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => { 
                    newProduct.image = event.target.result; 
                    saveProduct(); 
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                saveProduct();
            }
        });
    }

    // ==========================================================================
    // 10. УПРАВЛЕНИЕ КОРЗИНОЙ И ОФОРМЛЕНИЕМ ЗАКАЗА
    // ==========================================================================
    if (cartToggle) cartToggle.addEventListener('click', () => cartSidebar.classList.toggle('active'));
    if (cartClose) cartClose.addEventListener('click', () => cartSidebar.classList.remove('active'));

    function updateCartUI() {
        cartCounter.textContent = Math.max(0, cart.length);
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-text">Корзина пока пуста</p>';
            cartTotalPriceEl.textContent = '$0';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            const row = document.createElement('div');
            row.classList.add('cart-item-row');
            row.innerHTML = `
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price}</div>
                <button class="cart-item-remove" data-index="${index}">×</button>`;
            cartItemsContainer.appendChild(row);
        });
        
        cartTotalPriceEl.textContent = `$${total}`;

        // Удаление конкретной позиции из корзины
        document.querySelectorAll('.cart-item-remove').forEach(cross => {
            cross.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }

    // Перенос товаров из корзины в поле текстовой заявки
    const cartCheckoutBtn = document.getElementById('cart-checkout');
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Добавьте детали в корзину перед оформлением!');
            
            let textOrder = 'Заявка на покупку:\n';
            cart.forEach((item, i) => { 
                textOrder += `${i+1}. ${item.title} (${item.brand}) — $${item.price}\n`; 
            });
            
            carVinInput.value = textOrder;
            cartSidebar.classList.remove('active');
            
            const contactsSection = document.getElementById('contacts');
            if (contactsSection) contactsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Финал отправки заказа
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('🎉 Ваша заявка успешно отправлена!\nОплата по карте прошла успешно.\nМенеджер уже связывается с вами в WhatsApp для подтверждения доставки!');
            
            // Очищаем данные
            cart = [];
            updateCartUI();
            orderForm.reset();
            if (cardViewNumber) cardViewNumber.textContent = '•••• •••• •••• ••••';
            if (cardViewExpiry) cardViewExpiry.textContent = 'MM/YY';
        });
    }

    // Первичный запуск отрисовки сайта при загрузке страницы
    renderCatalog();
    renderReviews();
});