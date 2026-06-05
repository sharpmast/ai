'use strict'

const menuBtn = document.querySelector('.menu__icon');
const mobMenu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');
const wrapper = document.querySelector('.wrapper');

menuBtn.addEventListener('click', () => {

    menuBtn.classList.toggle('menu__icon--active');
    mobMenu.classList.toggle('menu--active');
    overlay.classList.toggle('overlay--active');
    if (wrapper.classList.contains('wrapper--active')) {
        wrapper.classList.remove('wrapper--active')
    } else {
        wrapper.classList.add('wrapper--active')
    };

});

const navLink = document.querySelectorAll('.menu__link');

navLink.forEach(item => {

    item.addEventListener('click', function (e) {

        e.preventDefault();

        menuBtn.classList.remove('menu__icon--active');
        mobMenu.classList.remove('menu--active');
        overlay.classList.remove('overlay--active');
        wrapper.classList.remove('wrapper--active');

        const blockId = item.getAttribute('href').substring(1);

        document.getElementById(blockId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});



function ibg() {

    let ibg = document.querySelectorAll(".ibg");
    for (let i = 0; i < ibg.length; i++) {
        if (ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
        }
    }
}

ibg();

document.addEventListener('click', (e) => {
    const button = e.target.closest('.choose__btn')
    if (!button) return

    document.querySelector('.choose__btn.choose__btn--active')?.classList.remove('choose__btn--active')
    button.classList.add('choose__btn--active')
})

document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.spoiler-asked__title');
    const textStorage = new Map();
    const typingTimers = new Map();

    document.querySelectorAll('.spoiler-asked__inner').forEach(container => {

        const cleanText = container.textContent.replace(/\s+/g, ' ').trim();

        textStorage.set(container, cleanText);
        container.textContent = '';
    });


    function startTyping(textContainer, contentBlock) {
        if (typingTimers.has(textContainer)) {
            clearInterval(typingTimers.get(textContainer));
        }

        const fullText = textStorage.get(textContainer);
        textContainer.textContent = '';
        contentBlock.style.maxHeight = '300px';

        let index = 0;
        const speed = 5;

        const interval = setInterval(() => {
            if (index < fullText.length) {
                textContainer.textContent += fullText.charAt(index);
                index++;
                contentBlock.style.maxHeight = contentBlock.scrollHeight + 'px';
            } else {
                clearInterval(interval);
                typingTimers.delete(textContainer);
            }
        }, speed);

        typingTimers.set(textContainer, interval);
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parent = trigger.closest('.spoiler-asked');
            if (!parent) return;

            const content = parent.querySelector('.spoiler-asked__body');
            const textContainer = parent.querySelector('.spoiler-asked__inner');
            if (!content || !textContainer) return;

            trigger.classList.toggle('open');

            if (trigger.classList.contains('open')) {
                startTyping(textContainer, content);
            } else {
                if (typingTimers.has(textContainer)) {
                    clearInterval(typingTimers.get(textContainer));
                }
                content.style.maxHeight = '0px';

                setTimeout(() => {
                    if (!trigger.classList.contains('open')) {
                        textContainer.textContent = '';
                    }
                }, 300);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY >= 500) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.stats-number');
    const animationDuration = 2000; // Час анімації в мілісекундах (2 секунди)

    // Функція анімації для конкретного лічильника
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target'); // Фінальне число
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;

            // Рахуємо прогрес від 0 до 1
            const progress = Math.min(elapsedTime / animationDuration, 1);

            // Поточне проміжне число
            const currentValue = Math.floor(progress * target);

            // Форматуємо вивід (якщо число >= 1000, перетворюємо у формат "120K+")
            if (currentValue >= 1000) {
                counter.textContent = (currentValue / 1000).toFixed(0);
            } else {
                counter.textContent = currentValue;
            }

            // Якщо час не вийшов — продовжуємо анімацію на наступному кадрі
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                // Фінальний запис для точності
                if (target >= 1000) {
                    counter.textContent = (target / 1000);
                } else {
                    counter.textContent = target;
                }
            }
        };

        requestAnimationFrame(updateNumber);
    };

    // Налаштовуємо спостерігач за скролом
    const observerOptions = {
        root: null, // стежимо відносно вікна браузера
        threshold: 0.2 // анімація почнеться, коли 20% блоку з'явиться на екрані
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Якщо елемент увійшов у зону видимості
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Вимикаємо спостереження, щоб анімація не повторювалася при кожному скролі туди-сюди
            }
        });
    }, observerOptions);

    // Запускаємо спостереження за кожним числом
    counters.forEach(counter => observer.observe(counter));
});

