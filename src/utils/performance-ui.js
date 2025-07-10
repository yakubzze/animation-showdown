/**
 * Performance UI Components
 * Provides UI elements for displaying performance metrics and test results
 */
export class PerformanceUI {
  constructor() {
    this.isVisible = false;
    this.isCollapsed = false;
    this.panel = null;
  }

  /**
   * Create performance monitoring panel
   */
  createPerformancePanel() {
    if (this.panel) return this.panel;

    this.panel = document.createElement('div');
    this.panel.className = 'performance-panel';
    this.panel.innerHTML = `
      <div class="performance-header">
        <h3>Performance Monitor</h3>
        <button class="performance-collapse" id="performanceCollapse" title="Collapse/Expand">─</button>
      </div>
      <div class="performance-content" id="performanceContent">
        <div class="performance-metrics">
          <div class="metric-item">
            <span class="metric-label">FPS:</span>
            <span class="metric-value" id="fps">--</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Memory:</span>
            <span class="metric-value" id="memory">--</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Frame Time:</span>
            <span class="metric-value" id="frameTime">--</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Animations:</span>
            <span class="metric-value" id="animationCount">0</span>
          </div>
        </div>
        <div class="performance-controls">
          <button class="control-btn" id="startMonitoring">Start</button>
          <button class="control-btn" id="stopMonitoring">Stop</button>
          <button class="control-btn" id="resetMetrics">Reset</button>
          <button class="control-btn" id="runTests">Run Tests</button>
        </div>
        <div class="performance-results" id="performanceResults"></div>
      </div>
    `;

    // Add styles
    this.addStyles();
    
    // Add event listeners
    this.addEventListeners();

    return this.panel;
  }

  /**
   * Add performance panel styles
   */
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .performance-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 12px;
        padding: 16px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        min-width: 280px;
        max-height: 80vh;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.6s ease;
        overflow: hidden;
      }

      .performance-panel.collapsed {
        padding: 12px 16px;
      }

      .performance-panel.collapsed .performance-content {
        max-height: 0;
        opacity: 0;
        transform: translateY(-8px);
        pointer-events: none;
      }

      .performance-panel.collapsed .performance-header {
        margin-bottom: 0;
      }

      .performance-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        transition: margin-bottom 0.6s ease;
      }

      .performance-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #f3f4f6;
      }

      .performance-collapse {
        background: none;
        border: none;
        color: #6366f1;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 4px;
        transition: all 0.3s ease;
        font-family: 'Courier New', monospace;
        line-height: 1;
        min-width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .performance-collapse:hover {
        background: rgba(99, 102, 241, 0.1);
        transform: scale(1.05);
      }

      .performance-collapse.active {
        color: #10b981;
      }

      .performance-content {
        transition: all 0.6s ease;
        max-height: 600px;
        opacity: 1;
        transform: translateY(0);
        overflow-y: auto;
        overflow-x: hidden;
      }

      .performance-content::-webkit-scrollbar {
        width: 6px;
      }

      .performance-content::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }

      .performance-content::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.5);
        border-radius: 3px;
      }

      .performance-content::-webkit-scrollbar-thumb:hover {
        background: rgba(99, 102, 241, 0.7);
      }

      .performance-metrics {
        margin-bottom: 16px;
      }

      .metric-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding: 4px 0;
      }

      .metric-label {
        color: #9ca3af;
        font-weight: 500;
      }

      .metric-value {
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
      }

      .performance-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 16px;
      }

      .control-btn {
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.3);
        color: #6366f1;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .control-btn:hover {
        background: rgba(99, 102, 241, 0.2);
        border-color: rgba(99, 102, 241, 0.5);
      }

      .control-btn:active {
        transform: scale(0.95);
      }

      .control-btn.primary {
        background: #6366f1;
        color: white;
        border-color: #6366f1;
      }

      .control-btn.primary:hover {
        background: #5855eb;
      }

      .performance-results {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 12px;
      }

      .performance-results h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: #f3f4f6;
      }

      .test-result {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        padding: 8px;
        margin-bottom: 8px;
      }

      .test-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      .test-name {
        font-weight: 600;
        color: #f3f4f6;
      }

      .test-duration {
        font-size: 12px;
        color: #9ca3af;
      }

      .test-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        font-size: 12px;
      }

      .test-metric {
        display: flex;
        justify-content: space-between;
      }

      .test-metric-label {
        color: #9ca3af;
      }

      .test-metric-value {
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
      }

      .test-status {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .test-status.success {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }

      .test-status.warning {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }

      .test-status.error {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
      }

      .performance-grade {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        margin-top: 4px;
      }

      .performance-grade.grade-a {
        background: rgba(16, 185, 129, 0.2);
        color: #10b981;
      }

      .performance-grade.grade-b {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
      }

      .performance-grade.grade-c {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
      }

      .performance-grade.grade-d {
        background: rgba(239, 115, 22, 0.2);
        color: #f97316;
      }

      .performance-grade.grade-f {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .performance-panel {
          bottom: 10px;
          right: 10px;
          left: 10px;
          min-width: auto;
          max-width: none;
        }

        .performance-panel.collapsed {
          left: auto;
          right: 10px;
          width: auto;
        }

        .performance-content {
          max-height: 500px;
        }

        .performance-controls {
          grid-template-columns: 1fr;
        }

        .test-metrics {
          grid-template-columns: 1fr;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .performance-panel {
          background: rgba(17, 24, 39, 0.95);
          border-color: rgba(255, 255, 255, 0.1);
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Add event listeners to performance panel
   */
  addEventListeners() {
    const collapseBtn = this.panel.querySelector('#performanceCollapse');
    const content = this.panel.querySelector('#performanceContent');
    const startBtn = this.panel.querySelector('#startMonitoring');
    const stopBtn = this.panel.querySelector('#stopMonitoring');
    const resetBtn = this.panel.querySelector('#resetMetrics');
    const runTestsBtn = this.panel.querySelector('#runTests');

    // Toggle collapse with smooth animation
    collapseBtn.addEventListener('click', () => {
      this.isCollapsed = !this.isCollapsed;
      
      if (this.isCollapsed) {
        this.panel.classList.add('collapsed');
        collapseBtn.textContent = '□';
        collapseBtn.title = 'Expand';
        collapseBtn.classList.add('active');
      } else {
        this.panel.classList.remove('collapsed');
        collapseBtn.textContent = '─';
        collapseBtn.title = 'Collapse';
        collapseBtn.classList.remove('active');
      }
    });

    // Control buttons
    startBtn.addEventListener('click', () => {
      if (window.performanceMonitor) {
        window.performanceMonitor.startMonitoring();
        startBtn.disabled = true;
        stopBtn.disabled = false;
      }
    });

    stopBtn.addEventListener('click', () => {
      if (window.performanceMonitor) {
        window.performanceMonitor.stopMonitoring();
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    });

    resetBtn.addEventListener('click', () => {
      if (window.performanceMonitor) {
        window.performanceMonitor.resetMetrics();
        this.updateMetrics({
          fps: '--',
          memory: '--',
          frameTime: '--',
          animationCount: 0
        });
      }
    });

    runTestsBtn.addEventListener('click', async () => {
      if (window.animationTester) {
        runTestsBtn.disabled = true;
        runTestsBtn.textContent = 'Testing...';
        
        try {
          const results = await window.animationTester.runAllTests();
          this.displayTestResults(results);
        } catch (error) {
          console.error('Test execution failed:', error);
        } finally {
          runTestsBtn.disabled = false;
          runTestsBtn.textContent = 'Run Tests';
        }
      }
    });

    // Set initial states
    stopBtn.disabled = true;
  }

  /**
   * Update performance metrics display
   */
  updateMetrics(metrics) {
    const fpsElement = this.panel.querySelector('#fps');
    const memoryElement = this.panel.querySelector('#memory');
    const frameTimeElement = this.panel.querySelector('#frameTime');
    const animationCountElement = this.panel.querySelector('#animationCount');

    if (fpsElement && metrics.fps !== undefined) {
      fpsElement.textContent = metrics.fps;
      fpsElement.style.color = this.getFPSColor(metrics.fps);
    }

    if (memoryElement && metrics.memory !== undefined) {
      memoryElement.textContent = metrics.memory;
    }

    if (frameTimeElement && metrics.frameTime !== undefined) {
      frameTimeElement.textContent = metrics.frameTime;
    }

    if (animationCountElement && metrics.animationCount !== undefined) {
      animationCountElement.textContent = metrics.animationCount;
    }
  }

  /**
   * Get FPS color based on performance
   */
  getFPSColor(fps) {
    if (fps === '--') return '#9ca3af';
    if (fps >= 55) return '#10b981';
    if (fps >= 30) return '#f59e0b';
    return '#ef4444';
  }

  /**
   * Display test results
   */
  displayTestResults(results) {
    const resultsContainer = this.panel.querySelector('#performanceResults');
    
    let html = '<h4>Test Results</h4>';
    
    // Individual test results
    Object.entries(results).forEach(([test, data]) => {
      if (typeof data === 'number') {
        html += `
          <div class="test-result">
            <div class="test-result-header">
              <span class="test-name">${test}</span>
              <span class="test-duration">${data}ms</span>
            </div>
          </div>
        `;
      }
    });

    // Performance summary
    if (results.summary) {
      const grade = results.summary.performance;
      html += `
        <div class="test-result">
          <div class="test-result-header">
            <span class="test-name">Overall Performance</span>
            <span class="test-duration">${results.summary.averageFPS} FPS</span>
          </div>
          <div class="performance-grade grade-${grade.grade.toLowerCase()}">
            Grade ${grade.grade}: ${grade.description}
          </div>
        </div>
      `;
    }

    resultsContainer.innerHTML = html;
  }

  /**
   * Show performance panel
   */
  show() {
    if (!this.panel) {
      this.createPerformancePanel();
    }
    
    document.body.appendChild(this.panel);
    this.isVisible = true;
    this.panel.querySelector('#performanceContent').style.display = 'block';
  }

  /**
   * Hide performance panel
   */
  hide() {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
  }

  /**
   * Create performance comparison chart
   */
  createComparisonChart(gsapData, vanillaData) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'performance-comparison-chart';
    
    const chartHTML = `
      <div class="chart-header">
        <h3>Performance Comparison</h3>
      </div>
      <div class="chart-metrics">
        <div class="metric-comparison">
          <div class="metric-label">FPS</div>
          <div class="metric-bars">
            <div class="metric-bar gsap" style="width: ${(gsapData.averageFPS / 60) * 100}%">
              <span class="bar-label">GSAP: ${gsapData.averageFPS}</span>
            </div>
            <div class="metric-bar vanilla" style="width: ${(vanillaData.averageFPS / 60) * 100}%">
              <span class="bar-label">Vanilla: ${vanillaData.averageFPS}</span>
            </div>
          </div>
        </div>
        <div class="metric-comparison">
          <div class="metric-label">Memory (MB)</div>
          <div class="metric-bars">
            <div class="metric-bar gsap" style="width: ${(gsapData.currentMemory?.used / 100) * 100}%">
              <span class="bar-label">GSAP: ${gsapData.currentMemory?.used || 0}</span>
            </div>
            <div class="metric-bar vanilla" style="width: ${(vanillaData.currentMemory?.used / 100) * 100}%">
              <span class="bar-label">Vanilla: ${vanillaData.currentMemory?.used || 0}</span>
            </div>
          </div>
        </div>
        <div class="metric-comparison">
          <div class="metric-label">Frame Time (ms)</div>
          <div class="metric-bars">
            <div class="metric-bar gsap" style="width: ${(gsapData.averageFrameTime / 33) * 100}%">
              <span class="bar-label">GSAP: ${gsapData.averageFrameTime}</span>
            </div>
            <div class="metric-bar vanilla" style="width: ${(vanillaData.averageFrameTime / 33) * 100}%">
              <span class="bar-label">Vanilla: ${vanillaData.averageFrameTime}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    chartContainer.innerHTML = chartHTML;
    
    // Add chart styles
    const chartStyle = document.createElement('style');
    chartStyle.textContent = `
      .performance-comparison-chart {
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 12px;
        padding: 20px;
        margin: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .chart-header h3 {
        margin: 0 0 16px 0;
        color: #f3f4f6;
      }

      .metric-comparison {
        margin-bottom: 16px;
      }

      .metric-label {
        font-weight: 600;
        margin-bottom: 8px;
        color: #9ca3af;
      }

      .metric-bars {
        display: flex;
        gap: 8px;
        height: 24px;
      }

      .metric-bar {
        height: 100%;
        border-radius: 4px;
        position: relative;
        transition: width 0.3s ease;
        min-width: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: white;
      }

      .metric-bar.gsap {
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
      }

      .metric-bar.vanilla {
        background: linear-gradient(90deg, #06b6d4, #10b981);
      }

      .bar-label {
        position: absolute;
        white-space: nowrap;
        font-size: 10px;
      }
    `;
    
    document.head.appendChild(chartStyle);
    
    return chartContainer;
  }
}

// Global performance UI instance
export const performanceUI = new PerformanceUI(); 