// Enhanced Home Page - Video Background with Interactive Features
console.log("Enhanced Home Page with Video Background initialized");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Home page loaded successfully");
    
    // Always initialize basic features
    initLiveClock();
    initNotifications();
    
    // Only initialize admin features if admin is logged in
    if (isAdminLoggedIn()) {
        initDashboardStats();
        initQuickActions();
        initActivityFeed();
    }
});

// Check if admin is logged in by looking for admin-specific elements
function isAdminLoggedIn() {
    // Check if dashboard section exists (only shown when admin is logged in)
    const dashboardSection = document.querySelector('.dashboard-section');
    return dashboardSection !== null;
}

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


// Dashboard Statistics with Real Data
function initDashboardStats() {
    // Show loading state
    showLoadingState();
    
    // Fetch real statistics from the server
    fetchDashboardStats();
    
    // Set up auto-refresh every 30 seconds
    setInterval(fetchDashboardStats, 30000);
}

function showLoadingState() {
    const elements = ['totalUsers', 'activeLogins', 'totalJerseys', 'totalRevenue', 'ordersToday'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '...';
            element.style.opacity = '0.6';
        }
    });
}

async function fetchDashboardStats() {
    try {
        const response = await fetch('/admin/stats/dashboard', {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateDashboardStats(data.data);
        
        // Update last activity time
        updateLastActivity();
        
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        showNotification('Failed to load dashboard statistics', 'error');
        // Fallback to cached/hardcoded values
        loadFallbackStats();
    }
}

function updateDashboardStats(stats) {
    console.log('Updating dashboard stats:', stats);
    
    // Update user statistics
    animateCounter('totalUsers', stats.users.total);
    animateCounter('activeLogins', stats.users.active);
    
    // Update product statistics
    animateCounter('totalJerseys', stats.products.total);
    
    // Update order statistics
    animateCounter('ordersToday', stats.orders.today);
    
    // Update revenue
    animateCounter('totalRevenue', stats.revenue.total, '$');
    
    // Update last updated time
    const lastUpdated = new Date(stats.lastUpdated);
    const timeString = lastUpdated.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const lastActivityElement = document.getElementById('lastActivity');
    if (lastActivityElement) {
        lastActivityElement.textContent = timeString;
    }
    
    // Remove loading state
    const elements = ['totalUsers', 'activeLogins', 'totalJerseys', 'totalRevenue', 'ordersToday'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.opacity = '1';
        }
    });
}

function loadFallbackStats() {
    // Fallback to hardcoded values if API fails
    const fallbackStats = {
        users: { total: 156, active: 89 },
        products: { total: 24 },
        orders: { today: 12 },
        revenue: { total: 15420 }
    };
    
    updateDashboardStats(fallbackStats);
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
            
        });
    });
}


// Activity Feed with Real Data
function initActivityFeed() {
    // Show loading state
    showActivityLoadingState();
    
    // Fetch real activity data
    fetchRecentActivity();
    
    // Set up auto-refresh every 60 seconds
    setInterval(fetchRecentActivity, 60000);
}

function showActivityLoadingState() {
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = `
            <div class="activity-item loading">
                <div class="activity-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <div class="activity-content">
                    <h4>Loading recent activity...</h4>
                    <p>Please wait while we fetch the latest updates</p>
                </div>
            </div>
        `;
    }
}

async function fetchRecentActivity() {
    try {
        const response = await fetch('/admin/stats/activity', {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateActivityFeed(data.data);
        
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        showNotification('Failed to load recent activity', 'error');
        // Keep existing static content as fallback
    }
}

function updateActivityFeed(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <h4>No recent activity</h4>
                    <p>No recent updates to display</p>
                </div>
            </div>
        `;
        return;
    }
    
    activityList.innerHTML = activities.map((activity, index) => `
        <div class="activity-item" data-activity-id="${index}">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
            </div>
            <div class="activity-actions">
                <button class="delete-activity-btn" onclick="deleteActivity(this)" title="Delete Activity">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Animate items
    const activityItems = activityList.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
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
        fetchDashboardStats();
        fetchRecentActivity();
        showNotification('Dashboard refreshed!', 'success');
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

// Activity Delete Functions
function deleteActivity(button) {
    const activityItem = button.closest('.activity-item');
    const activityTitle = activityItem.querySelector('h4').textContent;
    
    if (confirm(`Are you sure you want to delete "${activityTitle}"?`)) {
        // Add delete animation
        activityItem.style.transform = 'translateX(-100%)';
        activityItem.style.opacity = '0';
        
        setTimeout(() => {
            activityItem.remove();
            showNotification(`Activity "${activityTitle}" deleted successfully!`, 'success');
            
            // Check if no activities left
            const remainingActivities = document.querySelectorAll('.activity-item');
            if (remainingActivities.length === 0) {
                const activityList = document.querySelector('.activity-list');
                activityList.innerHTML = `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="activity-content">
                            <h4>No recent activity</h4>
                            <p>All activities have been cleared</p>
                        </div>
                    </div>
                `;
            }
        }, 300);
    }
}

function clearAllActivity() {
    const activityItems = document.querySelectorAll('.activity-item');
    
    if (activityItems.length === 0) {
        showNotification('No activities to clear!', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to clear all ${activityItems.length} activities?`)) {
        const activityList = document.querySelector('.activity-list');
        
        // Animate all items out
        activityItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(-100%)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    item.remove();
                }, 300);
            }, index * 100);
        });
        
        // Show empty state after all animations
        setTimeout(() => {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <h4>No recent activity</h4>
                        <p>All activities have been cleared</p>
                    </div>
                </div>
            `;
            showNotification('All activities cleared successfully!', 'success');
        }, activityItems.length * 100 + 300);
    }
}

console.log("Home page JavaScript loaded successfully");
