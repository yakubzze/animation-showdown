/**
 * Performance Monitor for Animation Libraries
 * Tracks FPS, memory usage, animation count, and other performance metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      loadTime: 0,
      animationCount: 0,
      frameTime: [],
      cpuUsage: 0,
      startTime: performance.now()
    };
    
    this.isMonitoring = false;
    this.fpsInterval = null;
    this.memoryInterval = null;
    this.frameCount = 0;
    this.lastTime = performance.now();
    
    // Bind methods
    this.updateFPS = this.updateFPS.bind(this);
    this.updateMemory = this.updateMemory.bind(this);
    this.measureFrameTime = this.measureFrameTime.bind(this);
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.metrics.startTime = performance.now();
    
    // Start FPS monitoring
    this.fpsInterval = setInterval(this.updateFPS, 1000);
    
    // Start memory monitoring
    this.memoryInterval = setInterval(this.updateMemory, 2000);
    
    // Start frame time monitoring
    this.measureFrameTime();
    
    console.log('🚀 Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = null;
    }
    
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = null;
    }
    
    console.log('⏹️ Performance monitoring stopped');
  }

  /**
   * Update FPS metrics
   */
  updateFPS() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    const fps = Math.round((this.frameCount * 1000) / deltaTime);
    
    this.metrics.fps.push(fps);
    
    // Keep only last 60 FPS measurements
    if (this.metrics.fps.length > 60) {
      this.metrics.fps.shift();
    }
    
    this.frameCount = 0;
    this.lastTime = currentTime;
    
    // Update FPS display
    this.updateFPSDisplay(fps);
  }

  /**
   * Update memory metrics
   */
  updateMemory() {
    if (performance.memory) {
      const memoryInfo = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
        timestamp: Date.now()
      };
      
      this.metrics.memory.push(memoryInfo);
      
      // Keep only last 30 memory measurements
      if (this.metrics.memory.length > 30) {
        this.metrics.memory.shift();
      }
      
      // Update memory display
      this.updateMemoryDisplay(memoryInfo);
    }
  }

  /**
   * Measure frame time
   */
  measureFrameTime() {
    if (!this.isMonitoring) return;
    
    const frameStart = performance.now();
    
    requestAnimationFrame(() => {
      const frameEnd = performance.now();
      const frameTime = frameEnd - frameStart;
      
      this.metrics.frameTime.push(frameTime);
      this.frameCount++;
      
      // Keep only last 120 frame time measurements
      if (this.metrics.frameTime.length > 120) {
        this.metrics.frameTime.shift();
      }
      
      this.measureFrameTime();
    });
  }

  /**
   * Update FPS display
   */
  updateFPSDisplay(fps) {
    const fpsElement = document.getElementById('fps');
    if (fpsElement) {
      fpsElement.textContent = fps;
      
      // Color coding based on performance
      if (fps >= 55) {
        fpsElement.style.color = '#10b981'; // Green
      } else if (fps >= 30) {
        fpsElement.style.color = '#f59e0b'; // Yellow
      } else {
        fpsElement.style.color = '#ef4444'; // Red
      }
    }
  }

  /**
   * Update memory display
   */
  updateMemoryDisplay(memoryInfo) {
    const memoryElement = document.getElementById('memory');
    if (memoryElement) {
      memoryElement.textContent = `${memoryInfo.used}MB`;
      
      // Color coding based on memory usage
      const usagePercent = (memoryInfo.used / memoryInfo.limit) * 100;
      
      if (usagePercent < 50) {
        memoryElement.style.color = '#10b981'; // Green
      } else if (usagePercent < 80) {
        memoryElement.style.color = '#f59e0b'; // Yellow
      } else {
        memoryElement.style.color = '#ef4444'; // Red
      }
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const avgFPS = this.metrics.fps.length > 0 
      ? Math.round(this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length)
      : 0;
    
    const avgFrameTime = this.metrics.frameTime.length > 0
      ? Math.round(this.metrics.frameTime.reduce((a, b) => a + b, 0) / this.metrics.frameTime.length)
      : 0;
    
    const currentMemory = this.metrics.memory.length > 0
      ? this.metrics.memory[this.metrics.memory.length - 1]
      : null;
    
    const totalTime = performance.now() - this.metrics.startTime;
    
    return {
      averageFPS: avgFPS,
      averageFrameTime: avgFrameTime,
      currentMemory: currentMemory,
      animationCount: this.metrics.animationCount,
      totalTime: Math.round(totalTime / 1000),
      performance: this.getPerformanceGrade(avgFPS, avgFrameTime)
    };
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade(avgFPS, avgFrameTime) {
    if (avgFPS >= 55 && avgFrameTime <= 16) {
      return { grade: 'A', color: '#10b981', description: 'Excellent' };
    } else if (avgFPS >= 45 && avgFrameTime <= 22) {
      return { grade: 'B', color: '#f59e0b', description: 'Good' };
    } else if (avgFPS >= 30 && avgFrameTime <= 33) {
      return { grade: 'C', color: '#f97316', description: 'Fair' };
    } else {
      return { grade: 'D', color: '#ef4444', description: 'Poor' };
    }
  }

  /**
   * Increment animation count
   */
  incrementAnimationCount() {
    this.metrics.animationCount++;
  }

  /**
   * Decrement animation count
   */
  decrementAnimationCount() {
    if (this.metrics.animationCount > 0) {
      this.metrics.animationCount--;
    }
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.metrics = {
      fps: [],
      memory: [],
      loadTime: 0,
      animationCount: 0,
      frameTime: [],
      cpuUsage: 0,
      startTime: performance.now()
    };
    
    this.frameCount = 0;
    this.lastTime = performance.now();
    
    console.log('🔄 Performance metrics reset');
  }

  /**
   * Export performance data
   */
  exportData() {
    return {
      summary: this.getPerformanceSummary(),
      rawData: this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      devicePixelRatio: window.devicePixelRatio
    };
  }
}

/**
 * Animation Performance Tester
 * Tests specific animation scenarios
 */
export class AnimationPerformanceTester {
  constructor(monitor) {
    this.monitor = monitor;
    this.testResults = [];
  }

  /**
   * Test scroll-triggered animations
   */
  async testScrollAnimations() {
    const startTime = performance.now();
    
    // Get full page height
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    
    // Detect if page has heavy animations
    const hasHeavyAnimations = document.querySelectorAll('.particle, .orbital-element, .shape, .wave').length > 10;
    const isDemoPage = window.location.pathname.includes('gsap-version') || window.location.pathname.includes('vanilla-version');
    
    // Adjust scroll parameters based on page type
    const scrollSteps = hasHeavyAnimations || isDemoPage 
      ? Math.ceil(pageHeight / 200) // Fewer steps for heavy pages
      : Math.ceil(pageHeight / 100); // More steps for light pages
    
    const stepDelay = hasHeavyAnimations || isDemoPage 
      ? 300 // Longer delay for heavy pages
      : 150; // Shorter delay for light pages
    
    console.log(`📜 Testing scroll animations: ${pageHeight}px height, ${scrollSteps} steps, ${stepDelay}ms delay`);
    console.log(`📜 Page type: ${hasHeavyAnimations ? 'Heavy animations' : 'Light animations'}, ${isDemoPage ? 'Demo page' : 'Main page'}`);
    
    // Simulate scroll events through entire page
    for (let i = 0; i <= scrollSteps; i++) {
      const scrollPosition = Math.min(i * (pageHeight / scrollSteps), pageHeight);
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth' // Use smooth scrolling for better performance
      });
      await this.wait(stepDelay);
    }
    
    // Scroll back to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    await this.wait(1000); // Longer wait for smooth scroll back
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.testResults.push({
      test: 'Scroll Animations',
      duration: Math.round(duration),
      timestamp: Date.now(),
      details: {
        pageHeight: pageHeight,
        scrollSteps: scrollSteps,
        stepDelay: stepDelay,
        totalDistance: pageHeight * 2, // down and back up
        pageType: hasHeavyAnimations ? 'Heavy' : 'Light',
        isDemoPage: isDemoPage
      }
    });
    
    return duration;
  }

  /**
   * Test stagger animations
   */
  async testStaggerAnimations() {
    const startTime = performance.now();
    
    // Find all possible stagger elements
    const staggerSelectors = [
      '.stagger-item',
      '.feature-tag',
      '.title-line',
      '.card',
      '.doc-card',
      '.analysis-card',
      '.performance-card'
    ];
    
    let allElements = [];
    staggerSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        allElements = allElements.concat(Array.from(elements));
      }
    });
    
    // If no specific stagger elements found, create some test elements
    if (allElements.length === 0) {
      console.log('🎯 No stagger elements found, creating test elements');
      const testContainer = document.createElement('div');
      testContainer.style.position = 'fixed';
      testContainer.style.top = '-1000px';
      testContainer.style.left = '-1000px';
      testContainer.style.zIndex = '-1';
      
      for (let i = 0; i < 20; i++) {
        const testElement = document.createElement('div');
        testElement.className = 'stagger-test-element';
        testElement.style.width = '50px';
        testElement.style.height = '50px';
        testElement.style.background = '#6366f1';
        testElement.style.margin = '5px';
        testElement.style.opacity = '0';
        testElement.style.transform = 'translateY(20px)';
        testContainer.appendChild(testElement);
        allElements.push(testElement);
      }
      
      document.body.appendChild(testContainer);
    }
    
    // Detect if page has heavy animations
    const hasHeavyAnimations = document.querySelectorAll('.particle, .orbital-element, .shape, .wave').length > 10;
    const isDemoPage = window.location.pathname.includes('gsap-version') || window.location.pathname.includes('vanilla-version');
    
    // Adjust stagger delay based on page type
    const staggerDelay = hasHeavyAnimations || isDemoPage ? 120 : 80; // Slower for heavy pages
    
    console.log(`🎯 Testing stagger animations: ${allElements.length} elements, ${staggerDelay}ms delay`);
    console.log(`🎯 Page type: ${hasHeavyAnimations ? 'Heavy animations' : 'Light animations'}, ${isDemoPage ? 'Demo page' : 'Main page'}`);
    
    // Trigger stagger animations
    allElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-in');
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * staggerDelay);
    });
    
    // Wait for all animations to complete
    await this.wait(allElements.length * staggerDelay + 1000);
    
    // Clean up test elements
    const testContainer = document.querySelector('div[style*="-1000px"]');
    if (testContainer) {
      document.body.removeChild(testContainer);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.testResults.push({
      test: 'Stagger Animations',
      duration: Math.round(duration),
      timestamp: Date.now(),
      details: {
        elementCount: allElements.length,
        staggerDelay: staggerDelay,
        pageType: hasHeavyAnimations ? 'Heavy' : 'Light',
        isDemoPage: isDemoPage
      }
    });
    
    return duration;
  }

  /**
   * Test SVG path animations
   */
  async testSVGAnimations() {
    const startTime = performance.now();
    
    // Find all possible SVG elements
    const svgSelectors = [
      '.draw-path',
      'path[stroke-dasharray]',
      '.animated-path',
      'svg path',
      'svg line',
      'svg circle',
      'svg rect'
    ];
    
    let svgElements = [];
    svgSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        svgElements = svgElements.concat(Array.from(elements));
      }
    });
    
    // If no SVG elements found, create a test SVG
    if (svgElements.length === 0) {
      console.log('🖼️ No SVG elements found, creating test SVG');
      const testSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      testSVG.setAttribute('width', '200');
      testSVG.setAttribute('height', '100');
      testSVG.style.position = 'fixed';
      testSVG.style.top = '-1000px';
      testSVG.style.left = '-1000px';
      testSVG.style.zIndex = '-1';
      
      const testPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      testPath.setAttribute('d', 'M10 50 Q100 10 190 50');
      testPath.setAttribute('stroke', '#6366f1');
      testPath.setAttribute('stroke-width', '3');
      testPath.setAttribute('fill', 'none');
      testPath.setAttribute('stroke-dasharray', '1000');
      testPath.setAttribute('stroke-dashoffset', '1000');
      testPath.classList.add('draw-path');
      
      testSVG.appendChild(testPath);
      document.body.appendChild(testSVG);
      svgElements.push(testPath);
    }
    
    // Detect if page has heavy animations
    const hasHeavyAnimations = document.querySelectorAll('.particle, .orbital-element, .shape, .wave').length > 10;
    const isDemoPage = window.location.pathname.includes('gsap-version') || window.location.pathname.includes('vanilla-version');
    
    // Adjust animation delay based on page type
    const animationDelay = hasHeavyAnimations || isDemoPage ? 300 : 200; // Slower for heavy pages
    
    console.log(`🖼️ Testing SVG animations: ${svgElements.length} elements, ${animationDelay}ms delay`);
    console.log(`🖼️ Page type: ${hasHeavyAnimations ? 'Heavy animations' : 'Light animations'}, ${isDemoPage ? 'Demo page' : 'Main page'}`);
    
    // Trigger SVG animations
    svgElements.forEach((element, index) => {
      setTimeout(() => {
        if (element.tagName === 'path' || element.tagName === 'line') {
          // Animate stroke-dashoffset for paths and lines
          element.style.transition = 'stroke-dashoffset 2s ease-in-out';
          element.style.strokeDashoffset = '0';
        } else if (element.tagName === 'circle') {
          // Animate radius for circles
          element.style.transition = 'r 1.5s ease-in-out';
          const currentRadius = element.getAttribute('r') || 10;
          element.setAttribute('r', currentRadius * 2);
        } else if (element.tagName === 'rect') {
          // Animate width for rectangles
          element.style.transition = 'width 1.5s ease-in-out';
          const currentWidth = element.getAttribute('width') || 50;
          element.setAttribute('width', currentWidth * 1.5);
        }
      }, index * animationDelay);
    });
    
    // Wait for animations to complete
    await this.wait(svgElements.length * animationDelay + 2500);
    
    // Clean up test SVG
    const testSVG = document.querySelector('svg[style*="-1000px"]');
    if (testSVG) {
      document.body.removeChild(testSVG);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.testResults.push({
      test: 'SVG Path Animations',
      duration: Math.round(duration),
      timestamp: Date.now(),
      details: {
        elementCount: svgElements.length,
        elementTypes: [...new Set(svgElements.map(el => el.tagName))],
        animationDelay: animationDelay,
        pageType: hasHeavyAnimations ? 'Heavy' : 'Light',
        isDemoPage: isDemoPage
      }
    });
    
    return duration;
  }

  /**
   * Run all performance tests
   */
  async runAllTests() {
    console.log('🧪 Starting performance tests...');
    
    this.monitor.startMonitoring();
    
    const results = {
      scrollAnimations: await this.testScrollAnimations(),
      staggerAnimations: await this.testStaggerAnimations(),
      svgAnimations: await this.testSVGAnimations(),
      summary: this.monitor.getPerformanceSummary()
    };
    
    this.monitor.stopMonitoring();
    
    // Log detailed results
    console.log('📊 Performance Test Results:');
    this.testResults.forEach(result => {
      console.log(`  ${result.test}: ${result.duration}ms`);
      if (result.details) {
        console.log(`    Details:`, result.details);
      }
    });
    
    console.log('✅ Performance tests completed', results);
    return results;
  }

  /**
   * Wait utility
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get test results
   */
  getTestResults() {
    return this.testResults;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
export const animationTester = new AnimationPerformanceTester(performanceMonitor); 