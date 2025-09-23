// Enhanced Home Page - Video Background with Interactive Features
console.log("Enhanced Home Page with Video Background initialized");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Home page loaded successfully");
    
    // Initialize all features
    initLiveClock();
    initDashboardStats();
    initQuickActions();
    initActivityFeed();
    initNotifications();
});

// Live Clock Functionality
function initLiveClock() {
    const clockElement = document.getElementById('liveClock');
    if (!clockElement) return;
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        clockElement.textContent = timeString;
        
        // Add subtle animation
        clockElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            clockElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}


// Dashboard Statistics with Animation
function initDashboardStats() {
    const stats = {
        totalUsers: 156,
        activeLogins: 89,
        totalJerseys: 24,
        totalRevenue: 15420,
        ordersToday: 12
    };
    
    // Animate counters
    animateCounter('totalUsers', stats.totalUsers);
    animateCounter('activeLogins', stats.activeLogins);
    animateCounter('totalJerseys', stats.totalJerseys);
    animateCounter('totalRevenue', stats.totalRevenue, '$');
    animateCounter('ordersToday', stats.ordersToday);
    
    // Update last activity
    updateLastActivity();
}

function animateCounter(elementId, targetValue, prefix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        if (prefix === '$') {
            element.textContent = prefix + Math.floor(currentValue).toLocaleString();
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 30);
}

function updateLastActivity() {
    const lastActivityElement = document.getElementById('lastActivity');
    if (!lastActivityElement) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    lastActivityElement.textContent = timeString;
    
    // Update every minute
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        lastActivityElement.textContent = timeString;
    }, 60000);
}

// Quick Actions
function initQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle special actions
            if (this.textContent.includes('Reports')) {
                e.preventDefault();
                showReports();
            }
        });
    });
}

function showReports() {
    showNotification('Reports feature coming soon!', 'info');
}

// Activity Feed
function initActivityFeed() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach((item, index) => {
        // Stagger animation
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Enhanced Notification System
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 2px solid ${type === 'success' ? 'rgba(39, 174, 96, 0.3)' : 
                          type === 'error' ? 'rgba(231, 76, 60, 0.3)' : 
                          'rgba(52, 152, 219, 0.3)'};
        border-radius: 15px;
        padding: 1rem 1.5rem;
        color: #2c3e50;
        font-weight: 600;
        font-size: 1rem;
        box-shadow: 0 8px 32px rgba(44, 62, 80, 0.2);
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
    `;
    
    const icon = document.createElement('i');
    icon.className = `fas ${type === 'success' ? 'fa-check-circle' : 
                            type === 'error' ? 'fa-exclamation-circle' : 
                            'fa-info-circle'}`;
    icon.style.color = type === 'success' ? '#27ae60' : 
                       type === 'error' ? '#e74c3c' : '#3498db';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + R for refresh stats
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        initDashboardStats();
        showNotification('Dashboard stats refreshed!', 'success');
    }
    
});

// Performance optimization
function optimizePerformance() {
    // Reduce animation frequency on low-end devices
    if (navigator.hardwareConcurrency < 4) {
        document.body.classList.add('reduced-motion');
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

console.log("Home page JavaScript loaded successfully");
