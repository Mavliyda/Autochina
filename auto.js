document.addEventListener('DOMContentLoaded', () => {
    
    // ==================== МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ====================
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    });

    // ==================== КАЛЬКУЛЯТОР ДОСТАВКИ ====================
    const weightInput = document.getElementById('weight');
    const transportSelect = document.getElementById('transport');
    const totalPriceEl = document.getElementById('total-price');

    function calculateDelivery() {
        const weight = parseFloat(weightInput.value) || 0;
        const selectedOption = transportSelect.options[transportSelect.selectedIndex];
        const pricePerKg = parseFloat(selectedOption.getAttribute('data-price'));
        
        const total = weight * pricePerKg;
        totalPriceEl.textContent = `$${total.toFixed(1)}`;
    }

    if(weightInput && transportSelect) {
        weightInput.addEventListener('input', calculateDelivery);
        transportSelect.addEventListener('change', calculateDelivery);
    }

    // ==================== FAQ АККОРДЕОН ====================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            const answer = currentItem.querySelector('.faq-answer');

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem && item.classList.contains('open')) {
                    item.classList.remove('open');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            currentItem.classList.toggle('open');

            if (currentItem.classList.contains('open')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // ==================== ЛОГИКА КНОПКИ "КУПИТЬ" ====================
    const buyButtons = document.querySelectorAll('.product-card__btn');
    const carVinInput = document.getElementById('form-car-vin');
    const contactsSection = document.getElementById('contacts');

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-product');
            
            if (carVinInput && contactsSection) {
                carVinInput.value = `Заказ товара: ${productName}`;
                
                carVinInput.style.borderColor = '#ff4d4d';
                carVinInput.style.backgroundColor = '#fff5f5';
                
                contactsSection.scrollIntoView({ behavior: 'smooth' });
                
                setTimeout(() => {
                    const firstInput = document.querySelector('.form__input');
                    if(firstInput) firstInput.focus();
                }, 800);
            }
        });
    });

    // ==================== ИНТЕРАКТИВНАЯ БАНКОВСКАЯ КАРТА ====================
    const paymentMethod = document.getElementById('payment-method');
    const cardPaymentBlock = document.getElementById('card-payment-block');
    
    const inputCardNumber = document.getElementById('card-number');
    const inputCardExpiry = document.getElementById('card-expiry');
    const inputCardHolder = document.getElementById('card-holder');

    const previewNumber = document.getElementById('preview-card-number');
    const previewExpiry = document.getElementById('preview-card-expiry');
    const previewHolder = document.getElementById('preview-card-holder');

    if(paymentMethod) {
        paymentMethod.addEventListener('change', () => {
            if (paymentMethod.value === 'card') {
                cardPaymentBlock.style.display = 'flex';
                inputCardNumber.required = true;
                inputCardExpiry.required = true;
                document.getElementById('card-cvc').required = true;
            } else {
                cardPaymentBlock.style.display = 'none';
                inputCardNumber.required = false;
                inputCardExpiry.required = false;
                document.getElementById('card-cvc').required = false;
            }
        });
    }

    if(inputCardNumber) {
        inputCardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = value.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];

            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }

            if (parts.length > 0) {
                e.target.value = parts.join(' ');
            } else {
                e.target.value = value;
            }

            previewNumber.textContent = e.target.value || '•••• •••• •••• ••••';
        });
    }

    if(inputCardExpiry) {
        inputCardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
            previewExpiry.textContent = e.target.value || 'MM/YY';
        });
    }

    if(inputCardHolder) {
        inputCardHolder.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            e.target.value = value;
            previewHolder.textContent = value.toUpperCase() || 'CARDHOLDER NAME';
        });
    }

    // ==================== ОТПРАВКА ФОРМЫ ЗАЯВКИ ====================
    const orderForm = document.getElementById('order-form');

    if(orderForm) {
        orderForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = orderForm.querySelector('input[type="text"]').value;
            const phone = orderForm.querySelector('input[type="tel"]').value;
            const productInfo = carVinInput ? carVinInput.value : '';

            alert(`Спасибо за заявку, ${name}!\nМы уже начали искать "${productInfo}".\nМенеджер свяжется с вами по номеру ${phone} в течение 15 минут.`);

            if(carVinInput) {
                carVinInput.style.borderColor = '#ccc';
                carVinInput.style.backgroundColor = '#fff';
            }

            orderForm.reset();
            if(cardPaymentBlock) cardPaymentBlock.style.display = 'none';
            if(previewNumber) previewNumber.textContent = '•••• •••• •••• ••••';
            if(previewExpiry) previewExpiry.textContent = 'MM/YY';
            if(previewHolder) previewHolder.textContent = 'CARDHOLDER NAME';
        });
    }
});