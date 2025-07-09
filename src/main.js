// Import styles
import './styles/main.scss';

// Main JavaScript for the comparison page
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Intersection Observer for scroll animations
    initScrollAnimations();
    
    // Preview item interactions
    initPreviewInteractions();
    
    // Navbar scroll effect
    initNavbarScroll();
});

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-based animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Respect reduced motion preference
                if (!prefersReducedMotion) {
                    entry.target.classList.add('animate-in');
                    // Track animation count
                    if (window.performanceMonitor) {
                        window.performanceMonitor.incrementAnimationCount();
                    }
                } else {
                    // For users with reduced motion preference, show elements immediately
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .comparison-card,
        .doc-card,
        .hero-text,
        .hero-visual,
        .advantage-card,
        .performance-card,
        .dev-card,
        .analysis-summary-card
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize preview item interactions
 */
function initPreviewInteractions() {
    const previewItems = document.querySelectorAll('.preview-item');
    
    previewItems.forEach((item, index) => {
        const handleInteraction = function() {
            const library = this.getAttribute('data-library');
            const urls = {
                'gsap': './gsap-version/',
                'vanilla': './vanilla-version/'
            };
            
            if (urls[library]) {
                window.location.href = urls[library];
            }
        };
        
        // Click handler
        item.addEventListener('click', handleInteraction);
        
        // Keyboard handler for accessibility
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteraction.call(this);
            }
        });
        
        // Stagger animation on load
        setTimeout(() => {
            if (!prefersReducedMotion) {
                item.classList.add('animate-in');

            } else {
                // For users with reduced motion preference, show items immediately
                item.style.opacity = '1';
                item.style.transform = 'none';
            }
        }, index * 200);
    });
}

/**
 * Initialize navbar scroll effect
 */
function initNavbarScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}



// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Add CSS animations for scroll-triggered elements
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .comparison-card,
    .doc-card,
    .hero-text,
    .hero-visual,
    .advantage-card,
    .performance-card,
    .dev-card,
    .analysis-summary-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    
    .doc-card {
        transition: all 0.4s ease-out;
    }
    
    .feature-card.animate-in,
    .comparison-card.animate-in,
    .doc-card.animate-in,
    .hero-text.animate-in,
    .hero-visual.animate-in,
    .advantage-card.animate-in,
    .performance-card.animate-in,
    .dev-card.animate-in,
    .analysis-summary-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .preview-item {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        transition: all 0.5s ease-out;
    }
    
    .preview-item.animate-in {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    
    .header {
        transition: all 0.3s ease-out;
    }
    
    .header.scrolled {
        background: rgba(17, 24, 39, 0.98);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    @media (prefers-color-scheme: dark) {
        .header.scrolled {
            background: rgba(17, 24, 39, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
    }
    
    /* Stagger animation for cards */
    .comparison-card:nth-child(1) { transition-delay: 0.1s; }
    .comparison-card:nth-child(2) { transition-delay: 0.2s; }
    .comparison-card:nth-child(3) { transition-delay: 0.3s; }
    
    .feature-card:nth-child(1) { transition-delay: 0.1s; }
    .feature-card:nth-child(2) { transition-delay: 0.2s; }
    .feature-card:nth-child(3) { transition-delay: 0.3s; }
    .feature-card:nth-child(4) { transition-delay: 0.4s; }
    
    .doc-card:nth-child(1) { transition-delay: 0.1s; }
    .doc-card:nth-child(2) { transition-delay: 0.2s; }
    .doc-card:nth-child(3) { transition-delay: 0.3s; }
    .doc-card:nth-child(4) { transition-delay: 0.4s; }
    
    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
        .feature-card,
        .comparison-card,
        .doc-card,
        .hero-text,
        .hero-visual,
        .preview-item {
            transition: none !important;
            animation: none !important;
        }
        
        .feature-card,
        .comparison-card,
        .doc-card,
        .hero-text,
        .hero-visual,
        .preview-item {
            opacity: 1 !important;
            transform: none !important;
        }
    }
`;

document.head.appendChild(style); 