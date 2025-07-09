import * as THREE from 'three';

// Import performance monitoring
import { performanceMonitor, animationTester } from '../src/utils/performance.js';
import { performanceUI } from '../src/utils/performance-ui.js';

// Application state
let scene, camera, renderer, animationId;
let cube, spheres = [];
let pathAnimationState = 'stopped'; // 'stopped', 'forward', 'reverse'
let rotationSpeed = 1;
let animationScale = 1;
let lastTime = 0;
let frameCount = 0;
let fps = 60;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    initScrollAnimations();
    initPathAnimations();
    initThreeJS();
    initControls();
    initHeroAnimations();
});

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Make performance monitor globally available
    window.performanceMonitor = performanceMonitor;
    window.animationTester = animationTester;
    
    // Show performance panel
    performanceUI.show();
    
    // Start monitoring automatically
    setTimeout(() => {
        performanceMonitor.startMonitoring();
    }, 1000);
    
    // Update metrics display periodically
    setInterval(() => {
        const summary = performanceMonitor.getPerformanceSummary();
        performanceUI.updateMetrics({
            fps: summary.averageFPS || '--',
            memory: summary.currentMemory ? `${summary.currentMemory.used}MB` : '--',
            frameTime: summary.averageFrameTime ? `${summary.averageFrameTime}ms` : '--',
            animationCount: summary.animationCount
        });
    }, 1000);
    
    console.log('🚀 Performance monitoring initialized for Vanilla JS demo');
}

/**
 * Initialize scroll-based animations using Intersection Observer
 */
function initScrollAnimations() {
    // Basic intersection observer setup
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Track animation count
                if (window.performanceMonitor) {
                    window.performanceMonitor.incrementAnimationCount();
                }
            }
        });
    }, observerOptions);
    
    // Observe stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe section headers
    document.querySelectorAll('.section-header').forEach(header => {
        observer.observe(header);
    });
    
    // Observe code examples
    document.querySelectorAll('.code-example').forEach(example => {
        observer.observe(example);
    });
    

}



/**
 * Initialize SVG path animations
 */
function initPathAnimations() {
    const path = document.querySelector('.draw-path');
    const dots = document.querySelectorAll('.path-dot');
    
    if (path) {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
        
        // Set up intersection observer for path section
        const pathObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && pathAnimationState === 'stopped') {
                    // Animate path
                    path.classList.add('animate');
                    pathAnimationState = 'forward';
                    
                    // Track animation count
                    if (window.performanceMonitor) {
                        window.performanceMonitor.incrementAnimationCount();
                    }
                    
                    // Animate dots with delay
                    setTimeout(() => {
                        dots.forEach((dot, index) => {
                            dot.style.transitionDelay = ''; // Reset to CSS default
                            setTimeout(() => {
                                dot.classList.add('animate');
                                // Track animation count for each dot
                                if (window.performanceMonitor) {
                                    window.performanceMonitor.incrementAnimationCount();
                                }
                            }, index * 300);
                        });
                    }, 1500);
                }
            });
        }, {
            threshold: 0.5
        });
        
        pathObserver.observe(document.querySelector('.path-section'));
    }
}

/**
 * Initialize ThreeJS scene with vanilla JavaScript
 */
function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1f2937);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Create main cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x06b6d4,
        shininess: 100
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    
    // Create floating spheres
    for (let i = 0; i < 8; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color().setHSL(i / 8, 0.7, 0.6),
            shininess: 100
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        // Position spheres in a circle
        const angle = (i / 8) * Math.PI * 2;
        const baseX = Math.cos(angle) * 4;
        const baseY = Math.sin(angle) * 2;
        const baseZ = Math.sin(angle * 2) * 2;
        
        sphere.position.set(baseX, baseY, baseZ);
        
        // Store original positions for animation
        sphere.userData = {
            originalX: baseX,
            originalY: baseY,
            originalZ: baseZ
        };
        
        spheres.push(sphere);
        scene.add(sphere);
    }
    
    // Initialize performance monitoring
    lastTime = Date.now();
    
    // Start render loop
    animate();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

/**
 * Animation loop with vanilla JavaScript
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Calculate FPS
    const currentTime = Date.now();
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Update FPS display
        const fpsElement = document.getElementById('fps');
        if (fpsElement) {
            fpsElement.textContent = fps;
        }
    }
    
    // Rotate cube with speed control
    if (cube) {
        cube.rotation.x += 0.01 * rotationSpeed;
        cube.rotation.y += 0.01 * rotationSpeed;
        
        // Pulse effect with scale control
        const time = Date.now() * 0.001;
        const baseScale = 1 + Math.sin(time * 2) * 0.3;
        cube.scale.setScalar(baseScale * animationScale);
    }
    
    // Animate spheres with more complex movement
    spheres.forEach((sphere, index) => {
        const time = Date.now() * 0.001;
        const originalData = sphere.userData;
        
        // Floating animation based on original position
        const offsetY = Math.sin(time + index * 0.5) * 1;
        const offsetX = Math.cos(time * 0.5 + index * 0.3) * 0.5;
        
        sphere.position.y = originalData.originalY + offsetY;
        sphere.position.x = originalData.originalX + offsetX;
        sphere.rotation.x += 0.01 * rotationSpeed;
        sphere.rotation.y += 0.005 * rotationSpeed;
    });
    
    renderer.render(scene, camera);
}

/**
 * Handle window resize
 */
function onWindowResize() {
    const container = document.getElementById('threejs-canvas').parentElement;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(container.clientWidth, container.clientHeight);
}

/**
 * Initialize UI controls
 */
function initControls() {
    // Path animation controls
    const playBtn = document.getElementById('playPath');
    const reverseBtn = document.getElementById('reversePath');
    const restartBtn = document.getElementById('restartPath');
    
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const path = document.querySelector('.draw-path');
            const dots = document.querySelectorAll('.path-dot');
            
            if (path) {
                // Remove all animation classes
                path.classList.remove('animate', 'animate-reverse');
                dots.forEach(dot => dot.classList.remove('animate'));
                
                // Force reflow
                path.offsetHeight;
                
                // Set initial state for forward animation
                const pathLength = path.getTotalLength();
                path.style.strokeDashoffset = pathLength;
                
                // Re-add forward animation
                path.classList.add('animate');
                pathAnimationState = 'forward';
                
                setTimeout(() => {
                    dots.forEach((dot, index) => {
                        dot.style.transitionDelay = ''; // Reset to CSS default
                        setTimeout(() => {
                            dot.classList.add('animate');
                        }, index * 300);
                    });
                }, 1500);
            }
        });
    }
    
    if (reverseBtn) {
        reverseBtn.addEventListener('click', () => {
            const path = document.querySelector('.draw-path');
            const dots = document.querySelectorAll('.path-dot');
            
            if (path) {
                // Remove all animation classes
                path.classList.remove('animate', 'animate-reverse');
                dots.forEach(dot => dot.classList.remove('animate'));
                
                // Force reflow
                path.offsetHeight;
                
                // Set initial state for reverse animation
                path.style.strokeDashoffset = '0';
                
                // Add reverse animation
                path.classList.add('animate-reverse');
                pathAnimationState = 'reverse';
                
                // Show dots first, then hide them in reverse order
                dots.forEach(dot => {
                    dot.classList.add('animate');
                    dot.style.transitionDelay = '0s'; // Reset delays for immediate show
                });
                
                setTimeout(() => {
                    dots.forEach((dot, index) => {
                        setTimeout(() => {
                            dot.classList.remove('animate');
                        }, (dots.length - 1 - index) * 300);
                    });
                }, 500);
            }
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            const path = document.querySelector('.draw-path');
            const dots = document.querySelectorAll('.path-dot');
            
            if (path) {
                // Reset path
                path.classList.remove('animate', 'animate-reverse');
                dots.forEach(dot => dot.classList.remove('animate'));
                
                // Reset stroke offset
                const pathLength = path.getTotalLength();
                path.style.strokeDashoffset = pathLength;
                pathAnimationState = 'stopped';
                
                // Restart animation
                setTimeout(() => {
                    path.classList.add('animate');
                    pathAnimationState = 'forward';
                    
                    setTimeout(() => {
                        dots.forEach((dot, index) => {
                            dot.style.transitionDelay = ''; // Reset to CSS default
                            setTimeout(() => {
                                dot.classList.add('animate');
                            }, index * 300);
                        });
                    }, 1500);
                }, 100);
            }
        });
    }
    
    // ThreeJS controls
    const rotationSlider = document.getElementById('rotationSpeed');
    const scaleSlider = document.getElementById('animationScale');
    const changeColorBtn = document.getElementById('changeColor');
    
    if (rotationSlider) {
        rotationSlider.addEventListener('input', (e) => {
            rotationSpeed = parseFloat(e.target.value);
        });
    }
    
    if (scaleSlider) {
        scaleSlider.addEventListener('input', (e) => {
            animationScale = parseFloat(e.target.value);
        });
    }
    
    if (changeColorBtn) {
        changeColorBtn.addEventListener('click', () => {
            // Generate random colors
            const cubeColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
            
            // Animate cube color change
            if (cube) {
                animateColorChange(cube.material, cubeColor, 400);
            }
            
            // Animate spheres color change with stagger
            spheres.forEach((sphere, index) => {
                setTimeout(() => {
                    const sphereColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
                    animateColorChange(sphere.material, sphereColor, 300);
                }, index * 50);
            });
        });
    }
    
    // Color animation helper function
    function animateColorChange(material, targetColor, duration) {
        const startColor = material.color.clone();
        const startTime = Date.now();
        
        function updateColor() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing
            const eased = 1 - Math.pow(1 - progress, 3);
            
            // Lerp between colors
            material.color.lerpColors(startColor, targetColor, eased);
            
            if (progress < 1) {
                requestAnimationFrame(updateColor);
            }
        }
        
        updateColor();
    }
}

/**
 * Hero section entrance animations - exact copy from GSAP version
 */
function initHeroAnimations() {
    // Set initial states for text
    const titleLines = document.querySelectorAll('.title-line');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const featureTags = document.querySelectorAll('.feature-tag');
    
    titleLines.forEach(line => {
        line.style.transform = 'translateY(50px)';
        line.style.opacity = '0';
    });
    
    if (heroSubtitle) {
        heroSubtitle.style.transform = 'translateY(30px)';
        heroSubtitle.style.opacity = '0';
    }
    
    featureTags.forEach(tag => {
        tag.style.transform = 'translateY(20px)';
        tag.style.opacity = '0';
    });
    
    // Animate title lines with stagger
    titleLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            line.style.transform = 'translateY(0)';
            line.style.opacity = '1';
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }, index * 200);
    });
    
    // Animate subtitle
    setTimeout(() => {
        if (heroSubtitle) {
            heroSubtitle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            heroSubtitle.style.transform = 'translateY(0)';
            heroSubtitle.style.opacity = '1';
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }
    }, 500);
    
    // Animate feature tags
    featureTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            tag.style.transform = 'translateY(0)';
            tag.style.opacity = '1';
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }, 700 + index * 100);
    });
    
    // Initialize particle system
    initParticleSystem();
    
    // Initialize orbital animations
    initOrbitalAnimations();
    
    // Initialize geometric shapes
    initGeometricShapes();
    
    // Initialize energy waves
    initEnergyWaves();
    
    // Initialize connection lines
    initConnectionLines();
}

/**
 * Initialize particle system animation - exact copy from GSAP
 */
function initParticleSystem() {
    const particles = document.querySelectorAll('.particle');
    
    // Set initial states
    particles.forEach(particle => {
        particle.style.transform = 'scale(0) translate(0, 0)';
        particle.style.opacity = '0';
    });
    
    // Create particle explosion effect
    particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        setTimeout(() => {
            particle.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            particle.style.opacity = '1';
            particle.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }, 500 + index * 50);
        
        // Continuous floating animation
        setTimeout(() => {
            const floatDuration = 3 + Math.random() * 2;
            const floatY = 20;
            const floatX = 10;
            
            setInterval(() => {
                particle.style.transition = `all ${floatDuration}s ease-in-out`;
                particle.style.transform = `translate(${x + floatX}px, ${y + floatY}px) scale(1)`;
                
                setTimeout(() => {
                    particle.style.transform = `translate(${x - floatX}px, ${y - floatY}px) scale(1)`;
                }, floatDuration * 1000 / 2);
            }, floatDuration * 1000);
        }, 2000 + index * 100);
    });
}

/**
 * Initialize orbital animations - exact copy from GSAP
 */
function initOrbitalAnimations() {
    const orbits = document.querySelectorAll('.orbit');
    
    orbits.forEach((orbit, orbitIndex) => {
        const elements = orbit.querySelectorAll('.orbital-element');
        const orbitRadius = 60 + orbitIndex * 40;
        
        elements.forEach((element, elementIndex) => {
            const angle = (elementIndex / elements.length) * Math.PI * 2;
            const speed = parseFloat(element.dataset.speed) || 1;
            
            // Set initial position
            element.style.transform = `translate(${Math.cos(angle) * orbitRadius}px, ${Math.sin(angle) * orbitRadius}px) scale(0)`;
            element.style.opacity = '0';
            
            // Animate entrance
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                element.style.transform = `translate(${Math.cos(angle) * orbitRadius}px, ${Math.sin(angle) * orbitRadius}px) scale(1)`;
                element.style.opacity = '1';
                // Track animation count
                if (window.performanceMonitor) {
                    window.performanceMonitor.incrementAnimationCount();
                }
            }, 1000 + elementIndex * 100);
            
            // Continuous orbital motion
            setTimeout(() => {
                const duration = 8 / speed;
                let currentAngle = angle;
                
                setInterval(() => {
                    currentAngle += 0.02;
                    const newX = Math.cos(currentAngle) * orbitRadius;
                    const newY = Math.sin(currentAngle) * orbitRadius;
                    element.style.transition = `all ${duration / 100}s linear`;
                    element.style.transform = `translate(${newX}px, ${newY}px) scale(1)`;
                }, duration * 10);
            }, 2000 + elementIndex * 200);
        });
    });
}

/**
 * Initialize geometric shapes animation - exact copy from GSAP
 */
function initGeometricShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    // Set initial states
    shapes.forEach(shape => {
        shape.style.transform = 'scale(0) rotate(0deg)';
        shape.style.opacity = '0';
    });
    
    shapes.forEach((shape, index) => {
        const speed = parseFloat(shape.dataset.speed) || 1;
        let time = 0;
        let floatDirection = 1; // 1 = up, -1 = down
        let floatY = 0;

        // Entrance animation
        setTimeout(() => {
            shape.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            shape.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
            shape.style.opacity = '1';
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }, 1500 + index * 150);

        // Add CSS keyframes for each shape
        const animationName = `shapeAnimation${index}`;
        const duration = 10 / speed;
        const floatDuration = 3 / speed;
        
        // Create keyframes dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ${animationName} {
                0% { transform: rotate(0deg) translateY(0px) scale(1); }
                50% { transform: rotate(180deg) translateY(-30px) scale(1); }
                100% { transform: rotate(360deg) translateY(0px) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Start animation after entrance
        setTimeout(() => {
            shape.style.animation = `${animationName} ${duration}s linear infinite`;
        }, 2500 + index * 200);
    });
}

/**
 * Initialize energy waves animation - exact copy from GSAP
 */
function initEnergyWaves() {
    const waves = document.querySelectorAll('.wave');
    
    // Set initial states
    waves.forEach(wave => {
        wave.style.transform = 'scale(0)';
        wave.style.opacity = '0';
    });
    
    waves.forEach((wave, index) => {
        // Animate entrance
        setTimeout(() => {
            wave.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            wave.style.transform = 'scale(1)';
            wave.style.opacity = '0.6';
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }, 2000 + index * 300);
        
        // Continuous pulsing
        setTimeout(() => {
            setInterval(() => {
                wave.style.transition = 'all 2s ease-in-out';
                wave.style.transform = 'scale(1.2)';
                wave.style.opacity = '0.2';
                
                setTimeout(() => {
                    wave.style.transform = 'scale(1)';
                    wave.style.opacity = '0.6';
                }, 2000);
            }, 4000 + index * 300);
        }, 3000 + index * 300);
    });
}

/**
 * Initialize connection lines animation - exact copy from GSAP
 */
function initConnectionLines() {
    const lines = document.querySelectorAll('.connection-line');
    
    // Set initial states
    lines.forEach(line => {
        line.style.strokeDashoffset = '1000';
        line.style.opacity = '0';
    });
    
    lines.forEach((line, index) => {
        // Animate drawing
        setTimeout(() => {
            line.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            line.style.strokeDashoffset = '0';
            line.style.opacity = '1';
            // Track animation count
            if (window.performanceMonitor) {
                window.performanceMonitor.incrementAnimationCount();
            }
        }, 2500 + index * 500);
        
        // Continuous flow effect
        setTimeout(() => {
            setInterval(() => {
                line.style.transition = 'all 4s linear';
                line.style.strokeDashoffset = '-1000';
                
                setTimeout(() => {
                    line.style.strokeDashoffset = '0';
                }, 4000);
            }, 4500 + index * 500);
        }, 4500 + index * 500);
    });
}

/**
 * Cleanup function
 */
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
