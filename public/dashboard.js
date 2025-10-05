// Modern Dashboard JavaScript Functionality
class ToolshubDashboard {
    constructor() {
        this.refreshInterval = 5000; // 5 seconds
        this.maxRetries = 3;
        this.retryCount = 0;
        this.isOnline = true;

        this.init();
    }

    init() {
        this.fetchHealthData();
        this.startAutoRefresh();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle visibility change to pause/resume updates
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoRefresh();
            } else {
                this.startAutoRefresh();
                this.fetchHealthData();
            }
        });
    }

    async fetchHealthData() {
        try {
            const response = await fetch('/api/health');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'healthy') {
                this.updateDashboard(data);
                this.updateConnectionStatus(true);
                this.showDashboard();
                this.retryCount = 0;
                this.isOnline = true;
            } else {
                throw new Error('Server reported unhealthy status');
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
            this.handleError(error);
        }
    }

    updateDashboard(data) {
        try {
            console.log('Dashboard data received:', data); // Debug log

            // Server Status
            this.updateServerStatus(data);

            // CPU Information
            this.updateCPUInfo(data.cpu);

            // Memory Usage
            this.updateMemoryInfo(data.memory);

            // API Traffic
            this.updateTrafficInfo(data.traffic);            // Update timestamp
            const timestamp = data.timestamp ?
                new Date(data.timestamp).toLocaleString() :
                new Date().toLocaleString();
            this.updateElement('last-updated', `Last updated: ${timestamp}`);

        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    updateServerStatus(data) {
        if (data.status) {
            const statusElement = document.getElementById('server-status');
            if (statusElement) {
                statusElement.textContent = data.status.toUpperCase();
                statusElement.className = `status-badge ${this.getStatusClass(data.status)}`;
            }
        }

        this.updateElement('server-uptime', data.server?.uptime?.formatted || '-');
        this.updateElement('server-environment', data.server?.environment || '-');
    }

    updateCPUInfo(cpu) {
        if (!cpu) return;

        this.updateElement('cpu-cores', cpu.cores || '-');
        this.updateElement('cpu-speed', cpu.speed ? `${cpu.speed} GHz` : '-');

        const cpuModel = cpu.model ?
            (cpu.model.length > 25 ? cpu.model.substring(0, 25) + '...' : cpu.model) : '-';
        this.updateElement('cpu-model', cpuModel);

        if (cpu.loadAverage) {
            const loadAvg = `${cpu.loadAverage['1min']} / ${cpu.loadAverage['5min']} / ${cpu.loadAverage['15min']}`;
            this.updateElement('cpu-load', loadAvg);
        }
    }

    updateMemoryInfo(memory) {
        if (!memory || !memory.system) {
            console.warn('Memory data not available:', memory);
            return;
        }

        const systemMemory = memory.system;
        console.log('System Memory Data:', systemMemory); // Debug log

        // Use system memory data instead of undefined properties
        this.updateElement('memory-used', this.formatBytes((systemMemory.used || 0) * 1024 * 1024 * 1024)); // Convert GB to bytes
        this.updateElement('memory-total', this.formatBytes((systemMemory.total || 0) * 1024 * 1024 * 1024)); // Convert GB to bytes

        // Safe percentage calculation from system memory
        const percentage = systemMemory.usagePercent || 0;
        this.updateElement('memory-percentage', `${percentage.toFixed(1)}%`);

        // Update memory progress bar
        const progressBar = document.getElementById('memory-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${Math.min(percentage, 100)}%`;

            // Change color based on usage
            if (percentage > 90) {
                progressBar.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
            } else if (percentage > 75) {
                progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #6366f1, #8b5cf6)';
            }
        }
    }    updateTrafficInfo(traffic) {
        if (!traffic) return;

        this.updateElement('total-hits', (traffic.totalHits || 0).toLocaleString());
        this.updateElement('health-hits', (traffic.healthEndpointHits || 0).toLocaleString());
        this.updateElement('requests-per-second', traffic.requestsPerSecond || '0');

        // Update API hits if available
        if (traffic.apiHits !== undefined) {
            this.updateElement('api-hits', (traffic.apiHits || 0).toLocaleString());
        }
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    updateConnectionStatus(isOnline) {
        const statusIndicator = document.getElementById('connection-status');
        const statusText = statusIndicator?.nextElementSibling;

        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
        }

        if (statusText) {
            statusText.textContent = isOnline ? 'Connected' : 'Disconnected';
        }
    }

    getStatusClass(status) {
        switch (status?.toLowerCase()) {
            case 'healthy':
            case 'ok':
                return 'status-healthy';
            case 'warning':
                return 'status-warning';
            case 'error':
            case 'unhealthy':
                return 'status-error';
            default:
                return 'status-warning';
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showDashboard() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    }

    handleError(error) {
        console.error('Dashboard error:', error);

        this.retryCount++;
        this.isOnline = false;
        this.updateConnectionStatus(false);

        if (this.retryCount >= this.maxRetries) {
            // Show error state
            document.getElementById('loading').style.display = 'none';
            document.getElementById('dashboard').style.display = 'none';

            const errorElement = document.getElementById('error');
            errorElement.style.display = 'block';
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <div>Failed to load system data</div>
                <div style="font-size: 0.9em; margin-top: 10px; opacity: 0.8;">
                    ${error.message || 'Network error or server unavailable'}
                </div>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem;">
                    <i class="fas fa-redo"></i> Retry
                </button>
            `;
        } else {
            // Retry with exponential backoff
            const retryDelay = Math.pow(2, this.retryCount) * 1000;
            setTimeout(() => this.fetchHealthData(), retryDelay);
        }
    }

    startAutoRefresh() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            if (!document.hidden && this.isOnline) {
                this.fetchHealthData();
            }
        }, this.refreshInterval);
    }

    stopAutoRefresh() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    destroy() {
        this.stopAutoRefresh();
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Add status styles to CSS dynamically
const statusStyles = `
    .status-healthy {
        background-color: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
    }
    .status-warning {
        background-color: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
    }
    .status-error {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #fecaca;
    }
`;

// Inject status styles
const styleSheet = document.createElement('style');
styleSheet.textContent = statusStyles;
document.head.appendChild(styleSheet);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.toolshubDashboard = new ToolshubDashboard();
});

// Global functions for debugging
window.refreshDashboard = () => {
    if (window.toolshubDashboard) {
        window.toolshubDashboard.fetchHealthData();
    }
};

window.toggleAutoRefresh = () => {
    if (window.toolshubDashboard) {
        if (window.toolshubDashboard.intervalId) {
            window.toolshubDashboard.stopAutoRefresh();
            console.log('Auto-refresh stopped');
        } else {
            window.toolshubDashboard.startAutoRefresh();
            console.log('Auto-refresh started');
        }
    }
};