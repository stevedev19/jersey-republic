// Enhanced Login Page JavaScript - Modern Interactive Features
console.log("Enhanced Login Page JavaScript initialized");

// Form Validation
function validateLoginForm() {
  console.log("Validating login form...");
  
  const memberNick = document.querySelector('.member-nick').value.trim();
  const memberPassword = document.querySelector('.member-password').value;
  
  // Clear previous error messages
  clearErrorMessages();
  
  let isValid = true;
  
  // Validate restaurant name
  if (!memberNick) {
    showFieldError('.member-nick', 'Restaurant name is required');
    isValid = false;
  } else if (memberNick.length < 3) {
    showFieldError('.member-nick', 'Restaurant name must be at least 3 characters');
    isValid = false;
  }
  
  // Validate password
  if (!memberPassword) {
    showFieldError('.member-password', 'Password is required');
    isValid = false;
  } else if (memberPassword.length < 6) {
    showFieldError('.member-password', 'Password must be at least 6 characters');
    isValid = false;
  }
  
  if (isValid) {
    showNotification('Form validation successful! Signing in...', 'success');
    // Add loading state to submit button
    const submitBtn = document.querySelector('.login-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
  }
  
  return isValid;
}

// Show field error
function showFieldError(selector, message) {
  const field = document.querySelector(selector);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  // Style the error message
  errorDiv.style.cssText = `
    color: #e74c3c;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideIn 0.3s ease;
  `;
  
  field.parentNode.appendChild(errorDiv);
  field.style.borderColor = '#e74c3c';
  field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
}

// Clear error messages
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.field-error');
  errorMessages.forEach(error => error.remove());
  
  // Reset field styles
  const fields = document.querySelectorAll('.form-input');
  fields.forEach(field => {
    field.style.borderColor = 'rgba(44, 62, 80, 0.2)';
    field.style.boxShadow = 'none';
  });
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    border-radius: 15px;
    padding: 1rem 1.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-family: 'Segoe UI', sans-serif;
    font-weight: 600;
    color: #2c3e50;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

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

// Password Toggle Functionality
function initPasswordToggle() {
  const passwordInput = document.getElementById('passwordInput');
  const passwordToggle = document.getElementById('passwordToggle');
  
  if (!passwordInput || !passwordToggle) return;
  
  passwordToggle.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
    
    // Add animation
    this.style.transform = 'scale(1.1)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
}

// Copy to Clipboard Functionality
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(`"${text}" copied to clipboard!`, 'success', 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showNotification(`"${text}" copied to clipboard!`, 'success', 2000);
  });
}

// Forgot Password Functionality
function showForgotPassword() {
  showNotification('Password reset feature coming soon! Contact admin for assistance.', 'info');
}

// Real-time Form Validation
function initRealTimeValidation() {
  const inputs = document.querySelectorAll('.form-input');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Clear error on input
      const error = this.parentNode.querySelector('.field-error');
      if (error) {
        error.remove();
        this.style.borderColor = 'rgba(44, 62, 80, 0.2)';
        this.style.boxShadow = 'none';
      }
    });
  });
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  
  switch (fieldName) {
    case 'memberNick':
      if (value && value.length < 3) {
        showFieldError(`.${field.className}`, 'Restaurant name must be at least 3 characters');
      }
      break;
    case 'memberPassword':
      if (value && value.length < 6) {
        showFieldError(`.${field.className}`, 'Password must be at least 6 characters');
      }
      break;
  }
}

// Auto-fill Demo Credentials
function initAutoFill() {
  const demoItems = document.querySelectorAll('.demo-item');
  
  demoItems.forEach(item => {
    const copyBtn = item.querySelector('.copy-btn');
    const demoValue = item.querySelector('.demo-value');
    
    if (copyBtn && demoValue) {
      copyBtn.addEventListener('click', function() {
        const text = demoValue.textContent;
        copyToClipboard(text);
        
        // Auto-fill the corresponding field
        if (text === 'Burak') {
          const usernameField = document.querySelector('.member-nick');
          if (usernameField) {
            usernameField.value = text;
            usernameField.style.borderColor = 'rgba(39, 174, 96, 0.5)';
            usernameField.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
            setTimeout(() => {
              usernameField.style.borderColor = 'rgba(44, 62, 80, 0.2)';
              usernameField.style.boxShadow = 'none';
            }, 2000);
          }
        } else if (text === 'damir2020') {
          const passwordField = document.querySelector('.member-password');
          if (passwordField) {
            passwordField.value = text;
            passwordField.style.borderColor = 'rgba(39, 174, 96, 0.5)';
            passwordField.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
            setTimeout(() => {
              passwordField.style.borderColor = 'rgba(44, 62, 80, 0.2)';
              passwordField.style.boxShadow = 'none';
            }, 2000);
          }
        }
      });
    }
  });
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const form = document.querySelector('.login-form');
      if (form) {
        form.submit();
      }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
      const inputs = document.querySelectorAll('.form-input');
      inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = 'rgba(44, 62, 80, 0.2)';
        input.style.boxShadow = 'none';
      });
      clearErrorMessages();
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Login page DOM loaded, initializing features...');
  
  // Initialize password toggle
  initPasswordToggle();
  
  // Initialize real-time validation
  initRealTimeValidation();
  
  // Initialize auto-fill functionality
  initAutoFill();
  
  // Initialize keyboard shortcuts
  initKeyboardShortcuts();
  
  // Add smooth animations to form elements
  const formElements = document.querySelectorAll('.login-input-container, .form-section');
  formElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 100);
  });
  
  // Add hover effects to interactive elements
  const interactiveElements = document.querySelectorAll('.form-input, .nav-link, .back-btn, .copy-btn');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add focus effects to form inputs
  const formInputs = document.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentNode.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentNode.style.transform = 'scale(1)';
    });
  });
  
  console.log('All login page features initialized successfully!');
});

// Export functions for global access
window.validateLoginForm = validateLoginForm;
window.showNotification = showNotification;
window.copyToClipboard = copyToClipboard;
window.showForgotPassword = showForgotPassword;
