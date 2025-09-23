// Admin Glass JavaScript
// Copy this to src/public/js/admin-glass.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Initialize modals
    initModals();
    
    // Initialize live clock
    initLiveClock();
    
    // Initialize particles
    initParticles();
    
    // Load dashboard data
    loadDashboardData();
});

function initDashboard() {
    // Add animation to dashboard cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

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
    }
    
    // Update immediately
    updateClock();
    
    // Update every second
    setInterval(updateClock, 1000);
}

function initParticles() {
    const particles = document.querySelectorAll('.particle');
    
    // Add mouse interaction
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, index) => {
            const speed = (index % 3) + 1; // Different speeds for variety
            const offsetX = (mouseX - 0.5) * 20 * speed;
            const offsetY = (mouseY - 0.5) * 20 * speed;
            
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            particle.style.transition = 'transform 0.3s ease';
        });
    });
    
    // Reset particles when mouse leaves
    document.addEventListener('mouseleave', function() {
        particles.forEach(particle => {
            particle.style.transform = 'translate(0, 0)';
        });
    });
}

function initModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Handle form submissions
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

function openModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalType) {
    const modal = document.getElementById(modalType + 'Modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    
    // Add loading state
    const button = e.target.querySelector('.glow-button');
    const originalText = button.textContent;
    button.textContent = 'Creating Account...';
    button.disabled = true;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
        // Show success message
        showNotification('Account created successfully!', 'success');
        
        // Close modal
        closeModal('signup');
        
        // Redirect or update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, 2000);
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Add loading state
    const button = e.target.querySelector('.glow-button');
    const originalText = button.textContent;
    button.textContent = 'Logging In...';
    button.disabled = true;
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
        // Show success message
        showNotification('Login successful!', 'success');
        
        // Close modal
        closeModal('login');
        
        // Redirect or update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, 2000);
}

function loadDashboardData() {
    // Simulate loading dashboard data
    // Replace with actual API calls
    
    // Animate counter for Total Users
    animateCounter('totalUsers', 0, 1247, 2000);
    
    // Animate counter for Active Logins
    animateCounter('activeLogins', 0, 89, 1500);
    
    // Update Last Activity
    updateLastActivity();
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = Date.now();
    const range = end - start;
    
    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (range * easeOutQuart));
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

function updateLastActivity() {
    const element = document.getElementById('lastActivity');
    if (!element) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    element.textContent = timeString;
    
    // Update every minute
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        element.textContent = timeString;
    }, 60000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Create notification content
    const icon = type === 'success' ? '✓' : 'ℹ';
    const iconColor = type === 'success' ? '#22c55e' : '#3b82f6';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon" style="color: ${iconColor}">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        zIndex: '3000',
        transform: 'translateX(100%)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#fff',
        minWidth: '300px',
        maxWidth: '400px'
    });
    
    // Style notification content
    const style = document.createElement('style');
    style.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            gap: 0.75rem;
        }
        .notification-icon {
            font-size: 1.2rem;
            font-weight: bold;
            flex-shrink: 0;
        }
        .notification-message {
            flex: 1;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            transform: scale(1.1);
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Add hover effects to navbar links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link-glass');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add ripple effect to buttons
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to glow buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('glow-button')) {
        createRippleEffect(e.target, e);
    }
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export functions for external use
window.adminGlass = {
    openModal,
    closeModal,
    showNotification,
    loadDashboardData
};
