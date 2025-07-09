// Import styles
import './style.scss';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Import performance monitoring
import { performanceMonitor, animationTester } from '../src/utils/performance.js';
import { performanceUI } from '../src/utils/performance-ui.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Application state
let scene, camera, renderer, animationId;
let cube, spheres = [];
let pathTimeline, heroTimeline;
let cubeRotationTimeline, spheresRotationTimeline;
let rotationSpeed = 1;
let animationScale = 1;
let lastTime = 0;
let frameCount = 0;
let fps = 60;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    initGSAPAnimations();
    initThreeJS();
    initControls();
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
    
    console.log('🚀 Performance monitoring initialized for GSAP demo');
}

/**
 * Initialize all GSAP animations
 */
function initGSAPAnimations() {
    // Hero section animations
    initHeroAnimations();
    
    // Stagger animations
    initStaggerAnimations();
    
    // SVG path animations
    initPathAnimations();
    
    // Floating elements parallax
    initParallaxAnimations();
    
    // Scroll-triggered animations
    initScrollAnimations();
}

/**
 * Hero section entrance animations
 */
function initHeroAnimations() {
    // Set initial states for text
    gsap.set('.title-line', { y: 50, opacity: 0 });
    gsap.set('.hero-subtitle', { y: 30, opacity: 0 });
    gsap.set('.feature-tag', { y: 20, opacity: 0 });
    
    heroTimeline = gsap.timeline();
    
    // Animate title lines with stagger
    heroTimeline
        .to('.title-line', {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            onStart: () => {
                if (window.performanceMonitor) {
                    window.performanceMonitor.incrementAnimationCount();
                }
            }
        })
        .to('.hero-subtitle', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onStart: () => {
                if (window.performanceMonitor) {
                    window.performanceMonitor.incrementAnimationCount();
                }
            }
        }, '-=0.5')
        .to('.feature-tag', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            onStart: () => {
                if (window.performanceMonitor) {
                    window.performanceMonitor.incrementAnimationCount();
                }
            }
        }, '-=0.3');
    
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
 * Initialize particle system animation
 */
function initParticleSystem() {
    const particles = document.querySelectorAll('.particle');
    
    // Set initial states
    gsap.set(particles, { 
        scale: 0, 
        opacity: 0,
        x: 0,
        y: 0
    });
    
    // Create particle explosion effect
    particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            scale: 1,
            opacity: 1,
            x: x,
            y: y,
            duration: 1.5,
            delay: 0.5 + index * 0.05,
            ease: 'power2.out'
        });
        
        // Continuous floating animation
        gsap.to(particle, {
            y: '+=20',
            x: '+=10',
            duration: 3 + Math.random() * 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 2 + index * 0.1
        });
    });
}

/**
 * Initialize orbital animations
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
            gsap.set(element, {
                x: Math.cos(angle) * orbitRadius,
                y: Math.sin(angle) * orbitRadius,
                scale: 0,
                opacity: 0
            });
            
            // Animate entrance
            gsap.to(element, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                delay: 1 + elementIndex * 0.1,
                ease: 'back.out(1.7)'
            });
            
            // Continuous orbital motion using gsap.ticker for smooth movement
            const orbitalDuration = 20 / speed; // Much slower movement
            let animationStartTime = null;
            
            // Start orbital motion after entrance animation
            setTimeout(() => {
                animationStartTime = Date.now();
                
                const ticker = gsap.ticker.add(() => {
                    if (!animationStartTime) return;
                    
                    const elapsed = (Date.now() - animationStartTime) / 1000;
                    const currentAngle = angle + (elapsed / orbitalDuration) * Math.PI * 2;
                    const x = Math.cos(currentAngle) * orbitRadius;
                    const y = Math.sin(currentAngle) * orbitRadius;
                    
                    gsap.set(element, {
                        x: x,
                        y: y
                    });
                });
                
                // Store ticker reference for cleanup
                element._orbitalTicker = ticker;
            }, (2 + elementIndex * 0.2) * 1000);
        });
    });
}

/**
 * Initialize geometric shapes animation
 */
function initGeometricShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    // Set initial states
    gsap.set(shapes, { 
        scale: 0, 
        opacity: 0,
        rotation: 0
    });
    
    shapes.forEach((shape, index) => {
        const speed = parseFloat(shape.dataset.speed) || 1;
        
        // Animate entrance
        gsap.to(shape, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 1.5 + index * 0.15,
            ease: 'elastic.out(1, 0.3)'
        });
        
        // Continuous rotation and floating
        gsap.to(shape, {
            rotation: 360,
            duration: 10 / speed,
            ease: 'none',
            repeat: -1,
            delay: 2.5 + index * 0.2
        });
        
        gsap.to(shape, {
            y: '-=30',
            duration: 3 / speed,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 3 + index * 0.3
        });
    });
}

/**
 * Initialize energy waves animation
 */
function initEnergyWaves() {
    const waves = document.querySelectorAll('.wave');
    
    // Set initial states
    gsap.set(waves, { 
        scale: 0, 
        opacity: 0
    });
    
    waves.forEach((wave, index) => {
        // Animate entrance
        gsap.to(wave, {
            scale: 1,
            opacity: 0.6,
            duration: 1,
            delay: 2 + index * 0.3,
            ease: 'power2.out'
        });
        
        // Continuous pulsing
        gsap.to(wave, {
            scale: 1.2,
            opacity: 0.2,
            duration: 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 3 + index * 0.3
        });
    });
}

/**
 * Initialize connection lines animation
 */
function initConnectionLines() {
    const lines = document.querySelectorAll('.connection-line');
    
    // Set initial states
    gsap.set(lines, { 
        strokeDashoffset: 1000,
        opacity: 0
    });
    
    lines.forEach((line, index) => {
        // Animate drawing
        gsap.to(line, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 2,
            delay: 2.5 + index * 0.5,
            ease: 'power2.out'
        });
        
        // Continuous flow effect
        gsap.to(line, {
            strokeDashoffset: -1000,
            duration: 4,
            ease: 'none',
            repeat: -1,
            delay: 4.5 + index * 0.5
        });
    });
}

/**
 * Stagger animations for grid items
 */
function initStaggerAnimations() {
    // Set initial state
    gsap.set('.stagger-item', {
        y: 100,
        opacity: 0
    });
    
    // Animate to visible state
    gsap.to('.stagger-item', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stagger-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Hover effects for stagger items
    document.querySelectorAll('.stagger-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -10,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * SVG path drawing animations
 */
function initPathAnimations() {
    const path = document.querySelector('.draw-path');
    const dots = document.querySelectorAll('.path-dot');
    const text = document.querySelector('.path-text');
    
    if (path) {
        const pathLength = path.getTotalLength();
        
        // Set up path for drawing animation
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });
        
        // Set up dots and text
        gsap.set(dots, { opacity: 0, scale: 0 });
        gsap.set(text, { opacity: 0, x: -20 });
        
        // Create path animation timeline
        pathTimeline = gsap.timeline({ 
            paused: true,
            scrollTrigger: {
                trigger: '.path-section',
                start: 'top 60%',
                end: 'bottom 40%',
                toggleActions: 'play none none reverse'
            }
        });
        
        pathTimeline
            .to(path, {
                strokeDashoffset: 0,
                duration: 3,
                ease: 'power2.inOut'
            })
            .to(dots, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            }, '-=1')
            .to(text, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.5');
    }
}

/**
 * Parallax effects for floating elements
 */
function initParallaxAnimations() {
    document.querySelectorAll('.floating-element').forEach(element => {
        const speed = element.dataset.speed || 1;
        
        gsap.to(element, {
            y: -50 * speed,
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

/**
 * General scroll-triggered animations
 */
function initScrollAnimations() {
    // Metric cards removed for cleaner layout
    
    // Animate code examples
    gsap.from('.code-example', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.code-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Section headers animation
    gsap.from('.section-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
}

/**
 * Initialize ThreeJS scene
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
        color: 0x88ce02,
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
        sphere.position.set(
            Math.cos(angle) * 4,
            Math.sin(angle) * 2,
            Math.sin(angle * 2) * 2
        );
        
        spheres.push(sphere);
        scene.add(sphere);
    }
    
    // GSAP animations for 3D objects
    // Scale animation
    gsap.to(cube.scale, {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });
    
    // Initialize GSAP 3D animations
    init3DAnimations();
    
    // Initialize performance monitoring
    lastTime = Date.now();
    
    // Start render loop
    animate();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

/**
 * Initialize GSAP 3D animations using proper timelines
 */
function init3DAnimations() {
    // Create cube rotation timeline - this is the GSAP way
    cubeRotationTimeline = gsap.timeline({ repeat: -1, ease: 'none' });
    cubeRotationTimeline.to(cube.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 10,
        ease: 'none'
    });
    
    // Create spheres rotation timeline
    spheresRotationTimeline = gsap.timeline({ repeat: -1, ease: 'none' });
    spheres.forEach((sphere, index) => {
        spheresRotationTimeline.to(sphere.rotation, {
            x: Math.PI * 2,
            y: Math.PI * 2,
            duration: 3 + index * 0.2,
            ease: 'none'
        }, 0); // Start all animations at the same time
    });
}

/**
 * ThreeJS animation loop
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
    
    // GSAP handles all 3D animations via timelines
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
            if (pathTimeline) {
                pathTimeline.play();
            }
        });
    }
    
    if (reverseBtn) {
        reverseBtn.addEventListener('click', () => {
            if (pathTimeline) {
                pathTimeline.reverse();
            }
        });
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (pathTimeline) {
                pathTimeline.restart();
            }
        });
    }
    
    // ThreeJS controls
    const rotationSlider = document.getElementById('rotationSpeed');
    const scaleSlider = document.getElementById('animationScale');
    const changeColorBtn = document.getElementById('changeColor');
    
    if (rotationSlider) {
        rotationSlider.addEventListener('input', (e) => {
            const newSpeed = parseFloat(e.target.value);
            rotationSpeed = newSpeed;
            
            // Use GSAP timeScale() to control animation speed - this is the GSAP way!
            if (cubeRotationTimeline) {
                cubeRotationTimeline.timeScale(newSpeed);
            }
            if (spheresRotationTimeline) {
                spheresRotationTimeline.timeScale(newSpeed);
            }
        });
    }
    
    if (scaleSlider) {
        scaleSlider.addEventListener('input', (e) => {
            const newScale = parseFloat(e.target.value);
            animationScale = newScale;
            
            if (cube) {
                // Kill existing scale animation and create new one
                gsap.killTweensOf(cube.scale);
                gsap.to(cube.scale, {
                    x: 1.3 * newScale,
                    y: 1.3 * newScale,
                    z: 1.3 * newScale,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    if (changeColorBtn) {
        changeColorBtn.addEventListener('click', () => {
            // Generate random colors
            const cubeColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
            
            // Animate cube color change with GSAP
            if (cube) {
                gsap.to(cube.material.color, {
                    r: cubeColor.r,
                    g: cubeColor.g,
                    b: cubeColor.b,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            
            // Animate spheres color change with stagger
            spheres.forEach((sphere, index) => {
                const sphereColor = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
                gsap.to(sphere.material.color, {
                    r: sphereColor.r,
                    g: sphereColor.g,
                    b: sphereColor.b,
                    duration: 0.3,
                    ease: 'power2.out',
                    delay: index * 0.05
                });
            });
        });
    }
}

/**
 * Performance monitoring removed for cleaner layout
 */

// Code copy functionality removed

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
    
        // Kill GSAP 3D animation timelines
    if (cubeRotationTimeline) {
        cubeRotationTimeline.kill();
    }
    if (spheresRotationTimeline) {
        spheresRotationTimeline.kill();
    }
    
    // Cleanup orbital tickers
    document.querySelectorAll('.orbital-element').forEach(element => {
        if (element._orbitalTicker) {
            gsap.ticker.remove(element._orbitalTicker);
        }
    });
    
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf('*');
}

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
