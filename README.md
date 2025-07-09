# GSAP vs Vanilla CSS/JS - Animation Comparison Showdown

Technical comparison of animation libraries showcasing **GSAP** and **Vanilla CSS/JS** with advanced features: ScrollTrigger, stagger animations, SVG path drawing and ThreeJS integration. Includes comprehensive performance analysis and implementation comparisons.

## 🚀 Quick Start

### Development Mode
```bash
# Clone repository
git clone https://github.com/Yakubzie/animation-showdown.git
cd animation-showdown

# Install dependencies
npm install

# Start development server
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

> **Note:** The development server will try to use port 3000, but if it is already in use, it will automatically select the next available port (e.g., 3001, 3002, etc.). Check your terminal output for the actual URL.

### Production Build
```bash
# Build the project
npm run build

# Option 1: Serve with Vite preview
npm run preview
```
Navigate to `http://localhost:4173` to view the production build.

```bash
# Option 2: Serve with static server
npm run serve-dist
```
Navigate to `http://localhost:3000` to view the production build.

> **Note:** The `serve-dist` command requires the `serve` package. Install it globally with `npm install -g serve` if you haven't already.

**Option 3: Open directly in browser**
- Open `dist/index.html` directly in your browser
- All links and resources will work correctly
- No server required - fully static files

## 📋 Features

### Core Animations
- **ScrollTrigger**: Scroll-based animations with precise viewport triggers
- **Stagger Animations**: Sequential animations with customizable delays
- **SVG Path Drawing**: Animated stroke-dasharray effects
- **ThreeJS Integration**: 3D animations synchronized with 2D libraries
- **Performance Monitoring**: Real-time FPS and memory usage tracking (available on demo pages only)
- **Intersection Observer**: Native scroll-based triggers
- **Web Animations API**: JavaScript animation control
- **Responsive Design**: Mobile-first approach

### Implementation Comparisons
- **GSAP**: Industry-standard animation library with timeline control
- **Vanilla CSS/JS**: Pure browser APIs with Intersection Observer
- **Performance Analysis**: Detailed benchmarks and metrics comparison
- **Code Examples**: Side-by-side implementation comparisons
- **ThreeJS Integration**: 3D animations with both approaches
- **SVG Animations**: Path drawing and morphing techniques
- **Accessibility**: Respects user preferences

## 🏗️ Architecture

### Project Structure
The project follows a modular structure with separate implementations for each animation approach:
```
├── src/
│   ├── styles/
│   │   ├── variables.scss      # SCSS variables and mixins
│   │   └── main.scss          # Main stylesheet
│   └── main.js                # Main page JavaScript
├── gsap-version/
│   ├── index.html             # GSAP implementation
│   ├── style.scss             # GSAP-specific styles
│   └── main.js                # GSAP animations
├── vanilla-version/
│   ├── index.html             # Vanilla implementation
│   ├── style.scss             # Vanilla-specific styles
│   └── main.js                # Vanilla animations
├── analysis.html              # Detailed analysis page
├── index.html                 # Main landing page
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
├── LICENSE                    # MIT License
└── .gitignore                 # Git ignore rules
```

### Technology Stack
- **Build Tool**: Vite (Fast development and optimized builds)
- **Styling**: SCSS with design system
- **Animation Library**: GSAP (Professional animations)
- **3D Graphics**: ThreeJS (3D capabilities)
- **Module System**: ES6 modules
- **Package Manager**: npm
- **Version Control**: Git

## 🎯 Implementation Details

### GSAP Implementation
Professional animation library with advanced features:
```javascript
// ScrollTrigger with stagger animation
gsap.from(".stagger-item", {
  y: 100,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".stagger-section",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
});
```

**Key Features:**
- Timeline-based animation control
- ScrollTrigger plugin integration
- Advanced easing functions
- Performance-optimized rendering
- ThreeJS object animation
- Cross-browser compatibility

### Vanilla CSS/JS Implementation
Pure browser APIs with no external dependencies:
```javascript
// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
});
```

**Key Features:**
- No external dependencies
- CSS animations and transitions
- Intersection Observer API
- Web Animations API
- Pure browser performance
- Modern browser features

## 📊 Performance Comparison

| Library | Bundle Size | Performance | Learning Curve | Features |
|---------|-------------|-------------|----------------|----------|
| GSAP | ~80kb | Excellent | Moderate | Comprehensive |
| Vanilla | ~5kb | Good | Steep | Basic |

*Bundle sizes are approximate and may vary based on usage.

### Performance Metrics
- **FPS Monitoring**: Real-time frame rate tracking
- **Memory Usage**: JavaScript heap monitoring
- **Animation Count**: Active animation tracking
- **Bundle Analysis**: Size impact comparison
- **CPU Usage**: Performance monitoring
- **Load Time**: Page load optimization
- **Rendering Performance**: GPU acceleration metrics
- **Collapsible UI**: Minimizable performance panel with standard window controls
- **Mobile Responsive**: Adaptive layout for mobile devices
- **Real-time Tests**: Automated performance testing with detailed reports

## 🔍 Detailed Analysis

The project includes a comprehensive analysis page (`analysis.html`) featuring detailed comparisons and benchmarks. Visit the analysis page for in-depth technical insights:

### Performance Benchmarks
- **Bundle Size Analysis**: Visual comparison of library sizes
- **Animation Performance**: FPS, memory, and CPU usage metrics
- **Browser Compatibility**: Support matrix for different browsers
- **Load Time Comparison**: Page load performance metrics
- **Memory Usage Analysis**: JavaScript heap monitoring
- **Real-time Monitoring**: Live performance tracking with collapsible UI
- **Mobile Optimization**: Responsive performance panel for mobile devices
- **Standard Controls**: Familiar minimize/maximize icons for intuitive interaction

### Implementation Comparisons
- **Code Examples**: Side-by-side GSAP vs Vanilla JS implementations
- **ScrollTrigger vs Intersection Observer**: Detailed comparison
- **Stagger Animations**: Different approaches to sequential animations
- **SVG Path Drawing**: Animation techniques comparison
- **ThreeJS Integration**: 3D animation approaches
- **Performance Optimization**: Best practices for each approach
- **Code Quality**: Maintainability and readability

### Developer Experience
- **Learning Curve Analysis**: Time investment vs capabilities
- **Community Support**: Available resources and documentation
- **Use Case Recommendations**: When to choose each approach
- **Development Setup**: Quick start guide
- **Debugging Tools**: Performance monitoring utilities with collapsible interface
- **Best Practices**: Industry standards and recommendations

## 📊 Performance Monitor

### Features
The project includes a comprehensive performance monitoring system available on demo pages:

- **Real-time Metrics**: Live FPS, memory usage, frame time, and animation count tracking
- **Collapsible Interface**: Minimizable panel with standard window controls (─/□ icons)
- **Mobile Responsive**: Adaptive layout that collapses to corner on mobile devices
- **Automated Testing**: Built-in performance tests for scroll, stagger, and SVG animations
- **Visual Feedback**: Color-coded metrics (green for good, yellow for warning, red for poor)
- **Export Capabilities**: Performance data export for analysis

### Usage
1. Navigate to GSAP or Vanilla JS demo pages
2. Look for the performance panel (─ icon) in the bottom-right corner
3. Click the minimize button to collapse/expand the panel
4. Use "Start" to begin monitoring performance during animations
5. Click "Run Tests" to execute automated performance tests
6. View detailed metrics and recommendations

### Mobile Experience
- Panel automatically adapts to mobile screen sizes
- Collapsible interface saves screen space on small devices
- Touch-friendly controls and responsive layout
- Optimized for mobile performance testing

## 🎨 Design System

### Color Palette
Modern color scheme optimized for accessibility:
```scss
$primary-color: #6366f1;    // Indigo
$secondary-color: #8b5cf6;  // Purple
$accent-color: #06b6d4;     // Cyan
$success-color: #10b981;    // Emerald
```

### Typography
Professional font stack for optimal readability:
```scss
$font-family-base: 'Inter', sans-serif;        // Main font
$font-family-mono: 'JetBrains Mono', monospace; // Code font
```

### Spacing System
Consistent spacing scale for layout harmony:
```scss
$spacing-4: 1rem;    // 16px
$spacing-8: 2rem;    // 32px
$spacing-16: 4rem;   // 64px
$spacing-24: 6rem;   // 96px
```

## 🔧 Development Guidelines

### Code Organization
Follow these principles for maintainable code:
1. **Modular Structure**: Separate concerns by animation type
2. **Performance First**: Optimize for 60fps rendering
3. **Accessibility**: Respect `prefers-reduced-motion`
4. **Responsive Design**: Mobile-first approach
5. **Cross-browser Compatibility**: Support modern browsers

### Animation Principles
Best practices for smooth and engaging animations:
1. **Easing Functions**: Natural motion curves
2. **Stagger Timing**: Logical sequence delays
3. **Performance**: GPU-accelerated properties
4. **Cleanup**: Proper animation disposal
5. **User Experience**: Smooth and responsive interactions

## 🚦 Usage Examples

### Basic ScrollTrigger
Compare how each approach handles scroll-based animations:
```javascript
// GSAP
gsap.to(".element", {
  scrollTrigger: ".element",
  x: 100,
  duration: 1
});

// Vanilla
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
});
observer.observe(element);
```

### SVG Path Animation
Drawing animations with different techniques:
```javascript
// GSAP
const path = document.querySelector('.path');
const length = path.getTotalLength();
gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
gsap.to(path, { strokeDashoffset: 0, duration: 2 });

// Vanilla
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
path.animate([
  { strokeDashoffset: length },
  { strokeDashoffset: 0 }
], { duration: 2000, easing: 'ease-in-out' });
```

### ThreeJS Integration
3D animations with different approaches:
```javascript
// GSAP
gsap.to(mesh.rotation, { x: Math.PI * 2, duration: 4, repeat: -1 });

// Vanilla
function animate() {
  mesh.rotation.x += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

## 🔍 Browser Support

### GSAP
Wide browser support including legacy browsers:
- Chrome 30+
- Firefox 34+
- Safari 9+
- Edge 12+

### Vanilla CSS/JS
Modern browser APIs with good support:
- Chrome 51+ (Web Animations API)
- Firefox 55+ (Web Animations API)
- Safari 12.1+ (Web Animations API)
- Edge 15+ (Web Animations API)
- Chrome 51+ (Intersection Observer)
- Firefox 55+ (Intersection Observer)
- Safari 12.1+ (Intersection Observer)
- Edge 15+ (Intersection Observer)

## 🎯 Best Practices

### Performance Optimization
Optimize animations for smooth performance:
1. **Use transform properties**: Better for GPU acceleration
2. **Avoid layout thrashing**: Minimize DOM reflows
3. **Batch DOM operations**: Group reads and writes
4. **Use requestAnimationFrame**: Sync with display refresh
5. **Optimize animations**: Use will-change property
6. **Reduce repaints**: Use opacity and transform

### Code Quality
Maintain high code standards:
1. **Modular Architecture**: Reusable components
2. **Error Handling**: Graceful degradation
3. **Testing**: Unit tests for animations
4. **Code Documentation**: Clear comments and structure
5. **Consistent Naming**: Descriptive variable names
6. **Code Organization**: Logical file structure

## 📈 Deployment

### Build Process
Ready for production deployment:
```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Clean build directory
npm run clean

# Build and serve
npm run serve

# Serve static build
npm run serve-dist
```

### Build Output Structure
After running `npm run build`, the `dist/` folder contains optimized static files:

```
dist/
├── index.html                 # Main landing page
├── analysis.html              # Analysis page
├── gsap-version/              # GSAP demo files
├── vanilla-version/           # Vanilla demo files
├── css/                       # Compiled stylesheets
└── js/                        # Optimized JavaScript bundles
```

### Build Features
- **Static Files**: All files use relative paths (`./js/main.js`) for direct browser opening
- **Optimized Bundles**: Minified and compressed JavaScript/CSS
- **Tree Shaking**: Unused code automatically removed
- **Asset Organization**: Logical folder structure (js/, css/, assets/)
- **Cross-Page Navigation**: All internal links work correctly
- **No Server Required**: Can be opened directly in browser or hosted anywhere

### Optimization
- **Code Splitting**: Automatic by Vite
- **Asset Optimization**: Automatic compression
- **Caching Strategy**: Proper cache headers
- **Static Hosting**: Ready for GitHub Pages, Netlify, Vercel
- **Performance Monitoring**: Built-in metrics with collapsible UI
- **Mobile Optimization**: Responsive performance panel
- **Bundle Analysis**: Performance impact tracking
- **Gzip Compression**: Automatic compression for faster loading

## 🤝 Contributing

### Development Setup
Get started with development:
1. Fork the repository
2. Clone your fork: `git clone https://github.com/Yakubzie/animation-showdown.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Create feature branch: `git checkout -b feature/amazing-feature`
6. Make your changes
7. Commit your changes: `git commit -m 'Add some amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Code Style
- Follow existing code patterns
- Use meaningful commit messages
- Test your changes locally
- Update documentation if needed
- Follow SCSS naming conventions
- Use semantic HTML structure
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Jakub Gietler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.

## 🔗 Resources

### Documentation
- [GSAP Documentation](https://gsap.com/docs/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [ThreeJS Documentation](https://threejs.org/docs/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Vite Documentation](https://vitejs.dev/)
- [SCSS Documentation](https://sass-lang.com/documentation/)

## 🎊 Acknowledgments

Special thanks to the open source community for making this project possible:

- **GSAP Team**: For the industry-standard animation library
- **ThreeJS Team**: For 3D graphics capabilities
- **Vite Team**: For the excellent build tool
- **Open Source Community**: For inspiration and support
- **Mozilla Developer Network**: For comprehensive web API documentation
- **CSS Working Group**: For modern CSS features
- **Web Animation Community**: For pushing the boundaries of web animation

---

*This project demonstrates the power of modern web technologies and the importance of choosing the right tools for your animation needs.* 