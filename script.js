// NotchNest Landing Page JavaScript - GitHub Pages Compatible

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initNotificationSystem();
    initSmoothScrolling();
    initButtonEffects();
    initVideoHandling();
    initRainAnimation();
});

// Notification system for button clicks
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#30d158' : type === 'error' ? '#ff453a' : '#007aff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-family: inherit;
        font-weight: 500;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const targetSection = document.querySelector(href);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enhanced button effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('button, a');

    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function (e) {
            if (this.classList.contains('no-ripple')) return;

            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            `;

            ripple.classList.add('ripple');

            // Ensure button has relative positioning
            if (getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Hover effects
        button.addEventListener('mouseenter', function () {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Active state
        button.addEventListener('mousedown', function () {
            if (!this.disabled) {
                this.style.transform = 'translateY(1px) scale(0.98)';
            }
        });

        button.addEventListener('mouseup', function () {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });
    });
}

// Video handling
function initVideoHandling() {
    const video = document.querySelector('video');
    if (video) {
        // Ensure video plays on interaction for mobile devices
        video.addEventListener('loadeddata', function () {
            // Try to play the video
            const playPromise = this.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Auto-play prevented:', error);
                    // Auto-play was prevented, add click to play
                    this.addEventListener('click', function () {
                        this.play();
                    });
                });
            }
        });

        // Add loading state
        video.addEventListener('loadstart', function () {
            this.style.opacity = '0.5';
        });

        video.addEventListener('canplay', function () {
            this.style.opacity = '1';
        });

        // Error handling
        video.addEventListener('error', function () {
            console.error('Video failed to load');
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 300px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                font-weight: bold;
            `;
            placeholder.textContent = '🎥 Video Preview';
            this.parentNode.replaceChild(placeholder, this);
        });
    }
}

// Rain animation enhancement
function initRainAnimation() {
    const rainElement = document.querySelector('.rain');
    if (rainElement) {
        // Add dynamic rain drops
        for (let i = 0; i < 50; i++) {
            createRainDrop();
        }

        // Continuously create new rain drops
        setInterval(createRainDrop, 200);
    }
}

function createRainDrop() {
    const rainContainer = document.querySelector('.rain');
    if (!rainContainer) return;

    const drop = document.createElement('div');
    drop.style.cssText = `
        position: absolute;
        width: 2px;
        height: 10px;
        background: linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.6));
        left: ${Math.random() * 100}%;
        top: -10px;
        animation: drop-fall ${Math.random() * 3 + 2}s linear infinite;
        pointer-events: none;
    `;

    rainContainer.appendChild(drop);

    // Remove drop after animation
    setTimeout(() => {
        if (drop.parentNode) {
            drop.parentNode.removeChild(drop);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes drop-fall {
        to {
            transform: translateY(100vh);
            opacity: 0;
        }
    }
    
    /* Enhanced button transitions */
    button, a {
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
    }
    
    /* FAQ item animations */
    article {
        transition: all 0.3s ease;
    }
    
    /* Video fade in */
    video {
        transition: opacity 0.5s ease;
    }
    
    /* Notification animations */
    .notification {
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
    
    /* Mobile optimizations */
    @media (max-width: 640px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* Focus styles for keyboard navigation */
    button:focus-visible,
    a:focus-visible {
        outline: 2px solid #ffd700;
        outline-offset: 2px;
    }
`;

document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Intersection Observer for animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe FAQ items and other elements
    const elementsToAnimate = document.querySelectorAll('article, .mt-10');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Add fade in animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInStyle);

// Error handling for missing elements
window.addEventListener('error', function (e) {
    console.warn('NotchNest: Non-critical error handled:', e.message);
});

// Export functions for global access
window.showNotification = showNotification; 