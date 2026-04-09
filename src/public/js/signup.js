// Signup — validation and UX (presentation only; form POST unchanged)

function validateSignForm() {
  const memberNick = document.querySelector('.member-nick').value.trim();
  const memberPhone = document.querySelector('.member-phone').value.trim();
  const memberPassword = document.querySelector('.member-password').value;
  const confirmPassword = document.querySelector('.confirm-password').value;

  clearErrorMessages();

  let isValid = true;

  if (!memberNick) {
    showFieldError('.member-nick', 'Username is required');
    isValid = false;
  } else if (memberNick.length < 3) {
    showFieldError('.member-nick', 'Username must be at least 3 characters');
    isValid = false;
  }

  if (!memberPhone) {
    showFieldError('.member-phone', 'Phone number is required');
    isValid = false;
  } else if (!isValidPhone(memberPhone)) {
    showFieldError('.member-phone', 'Please enter a valid phone number');
    isValid = false;
  }

  if (!memberPassword) {
    showFieldError('.member-password', 'Password is required');
    isValid = false;
  } else if (memberPassword.length < 6) {
    showFieldError('.member-password', 'Password must be at least 6 characters');
    isValid = false;
  }

  if (!confirmPassword) {
    showFieldError('.confirm-password', 'Please confirm your password');
    isValid = false;
  } else if (memberPassword !== confirmPassword) {
    showFieldError('.confirm-password', 'Passwords do not match');
    isValid = false;
  }

  const fileInput = document.getElementById('signupImageInput');
  if (fileInput && (!fileInput.files || fileInput.files.length === 0)) {
    showNotification('Please choose a profile image.', 'error');
    isValid = false;
  }

  if (isValid) {
    showNotification('Creating your account...', 'success');
    const submitBtn = document.querySelector('.signup-btn');
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
  }

  return isValid;
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFieldError(selector, message) {
  const field = document.querySelector(selector);
  if (!field) return;
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText =
    'color:#dc2626;font-size:13px;font-weight:500;margin-top:6px;line-height:1.4';

  const host = field.closest('.login-field') || field.parentNode;
  host.appendChild(errorDiv);
  field.style.borderColor = '#f87171';
  field.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.2)';
}

function clearErrorMessages() {
  document.querySelectorAll('.field-error').forEach((el) => el.remove());
  document.querySelectorAll('.form-input').forEach((field) => {
    field.style.borderColor = '#cbd5e1';
    field.style.boxShadow = 'none';
  });
}

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

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notification.style.transform = 'translateX(110%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

function initSignupPasswordToggle() {
  const passwordInput = document.getElementById('signupPasswordInput');
  const passwordToggle = document.getElementById('signupPasswordToggle');
  if (!passwordInput || !passwordToggle) return;

  passwordToggle.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const label = this.querySelector('.password-toggle__text');
    if (label) {
      label.textContent = type === 'password' ? 'Show' : 'Hide';
    }
  });
}

function initRealTimeValidation() {
  document.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('blur', function () {
      validateField(this);
    });

    input.addEventListener('input', function () {
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

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const sel = `.${field.className.trim().split(/\s+/).join('.')}`;

  switch (fieldName) {
    case 'memberNick':
      if (value && value.length < 3) {
        showFieldError(sel, 'Username must be at least 3 characters');
      }
      break;
    case 'memberPhone':
      if (value && !isValidPhone(value)) {
        showFieldError(sel, 'Please enter a valid phone number');
      }
      break;
    case 'memberPassword':
      if (value && value.length < 6) {
        showFieldError(sel, 'Password must be at least 6 characters');
      }
      break;
    case 'confirmPassword': {
      const password = document.querySelector('.member-password').value;
      if (value && value !== password) {
        showFieldError(sel, 'Passwords do not match');
      }
      break;
    }
    default:
      break;
  }
}

function previewFileHandler(input) {
  const file = input.files && input.files[0];
  const img = document.getElementById('imagePreview');
  const nameEl = document.getElementById('signupFileName');

  if (!img) return;

  if (file) {
    const okType = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
    if (!okType) {
      showNotification('Please select a JPG or PNG image.', 'error');
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image must be smaller than 5MB.', 'error');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    if (nameEl) nameEl.textContent = file.name;
  } else {
    img.src = '/img/store.jpeg';
    if (nameEl) nameEl.textContent = 'No file chosen';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initSignupPasswordToggle();
  initRealTimeValidation();

  const card = document.querySelector('.signup-card');
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(12px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 40);
  }
});

window.validateSignForm = validateSignForm;
window.showNotification = showNotification;
window.previewFileHandler = previewFileHandler;
