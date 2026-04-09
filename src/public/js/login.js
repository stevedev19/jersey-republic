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
  
  if (!memberNick) {
    showFieldError('.member-nick', 'Username is required');
    isValid = false;
  } else if (memberNick.length < 3) {
    showFieldError('.member-nick', 'Must be at least 3 characters');
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
    const submitBtn = document.querySelector('.login-submit-btn');
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
  }
  
  return isValid;
}

// Show field error
function showFieldError(selector, message) {
  const field = document.querySelector(selector);
  if (!field) return;
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;

  errorDiv.style.cssText = `
    color: #dc2626;
    font-size: 13px;
    font-weight: 500;
    margin-top: 6px;
    line-height: 1.4;
  `;

  const host = field.closest('.login-field') || field.parentNode;
  host.appendChild(errorDiv);
  field.style.borderColor = '#f87171';
  field.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.2)';
}

// Clear error messages
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.field-error');
  errorMessages.forEach(error => error.remove());
  
  // Reset field styles
  const fields = document.querySelectorAll('.form-input');
  fields.forEach(field => {
    field.style.borderColor = '#cbd5e1';
    field.style.boxShadow = 'none';
  });
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  const content = document.createElement('div');
  content.className = 'notification-content';
  content.style.cssText =
    'display:flex;align-items:flex-start;gap:8px;font-size:14px;line-height:1.45;color:#334155;';
  const span = document.createElement('span');
  span.textContent = message;
  content.appendChild(span);
  notification.appendChild(content);

  const border =
    type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fff;
    border: 1px solid ${border};
    border-radius: 10px;
    padding: 14px 18px;
    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.12);
    z-index: 10000;
    transform: translateX(110%);
    transition: transform 0.25s ease;
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    font-weight: 500;
    max-width: min(320px, calc(100vw - 32px));
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
    const label = this.querySelector('.password-toggle__text');
    if (label) {
      label.textContent = type === 'password' ? 'Show' : 'Hide';
    }
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
      const wrap = this.closest('.login-field');
      const error = wrap ? wrap.querySelector('.field-error') : this.parentNode.querySelector('.field-error');
      if (error) {
        error.remove();
        this.style.borderColor = '#cbd5e1';
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
        showFieldError(`.${field.className.split(' ').join('.')}`, 'Must be at least 3 characters');
      }
      break;
    case 'memberPassword':
      if (value && value.length < 6) {
        showFieldError(`.${field.className.split(' ').join('.')}`, 'Password must be at least 6 characters');
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
              usernameField.style.borderColor = '#cbd5e1';
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
              passwordField.style.borderColor = '#cbd5e1';
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
        input.style.borderColor = '#cbd5e1';
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
  const formElements = document.querySelectorAll('.login-card');
  formElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(12px)';

    setTimeout(() => {
      element.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 60);
  });
  
  console.log('All login page features initialized successfully!');
});

// Export functions for global access
window.validateLoginForm = validateLoginForm;
window.showNotification = showNotification;
window.copyToClipboard = copyToClipboard;
window.showForgotPassword = showForgotPassword;
