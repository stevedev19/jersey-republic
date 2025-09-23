// Enhanced Users Management - Interactive Features
console.log("Enhanced Users Management System initialized");

class UsersManager {
  constructor() {
    this.users = [];
    this.filteredUsers = [];
    this.currentSort = { column: null, direction: 'asc' };
    this.init();
  }

  init() {
    this.loadUsers();
    this.setupEventListeners();
    this.updateStats();
    this.initializeAnimations();
  }

  loadUsers() {
    // Extract users from the table rows
    const rows = document.querySelectorAll('.user-row');
    this.users = Array.from(rows).map(row => ({
      id: row.dataset.userId,
      name: row.querySelector('.user-name').textContent,
      phone: row.querySelector('.phone-link').textContent.trim(),
      points: parseInt(row.querySelector('.points-badge').textContent.trim()) || 0,
      status: row.querySelector('.status-select').value,
      element: row
    }));
    this.filteredUsers = [...this.users];
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterUsers(e.target.value);
      });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filterByStatus(e.target.value);
      });
    }

    // Sortable columns
    document.querySelectorAll('.sortable').forEach(header => {
      header.addEventListener('click', () => {
        this.sortTable(header.dataset.sort);
      });
    });

    // Status change handlers
    document.querySelectorAll('.member-status').forEach(select => {
      select.addEventListener('change', (e) => {
        this.handleStatusChange(e.target);
      });
    });

    // Action button handlers
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = e.target.closest('.user-row').dataset.userId;
        this.viewUser(userId);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = e.target.closest('.user-row').dataset.userId;
        this.editUser(userId);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const userId = e.target.closest('.user-row').dataset.userId;
        this.deleteUser(userId);
      });
    });
  }

  filterUsers(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term)
    );
    this.updateTableDisplay();
  }

  filterByStatus(status) {
    if (!status) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user => user.status === status);
    }
    this.updateTableDisplay();
  }

  sortTable(column) {
    if (this.currentSort.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = column;
      this.currentSort.direction = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
      let aVal, bVal;
      
      switch (column) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'phone':
          aVal = a.phone;
          bVal = b.phone;
          break;
        case 'points':
          aVal = a.points;
          bVal = b.points;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return this.currentSort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateTableDisplay();
    this.updateSortIndicators();
  }

  updateTableDisplay() {
    const tbody = document.querySelector('.modern-table tbody');
    tbody.innerHTML = '';

    this.filteredUsers.forEach((user, index) => {
      const row = user.element.cloneNode(true);
      row.querySelector('.number-badge').textContent = index + 1;
      tbody.appendChild(row);
    });

    // Re-attach event listeners
    this.setupEventListeners();
  }

  updateSortIndicators() {
    document.querySelectorAll('.sortable').forEach(header => {
      header.classList.remove('sort-asc', 'sort-desc');
      if (header.dataset.sort === this.currentSort.column) {
        header.classList.add(`sort-${this.currentSort.direction}`);
      }
    });
  }

  handleStatusChange(selectElement) {
    const userId = selectElement.id;
    const newStatus = selectElement.value;
    const row = selectElement.closest('.user-row');
    
    // Add loading state
    selectElement.disabled = true;
    selectElement.style.opacity = '0.6';
    
    // Simulate API call
    setTimeout(() => {
      // Update local data
      const user = this.users.find(u => u.id === userId);
      if (user) {
        user.status = newStatus;
      }
      
      // Update UI
      selectElement.disabled = false;
      selectElement.style.opacity = '1';
      
      // Add success animation
      row.style.background = 'rgba(0, 255, 0, 0.1)';
      setTimeout(() => {
        row.style.background = '';
      }, 1000);
      
      this.updateStats();
      this.showNotification(`User status updated to ${newStatus}`, 'success');
    }, 500);
  }

  updateStats() {
    const activeUsers = this.users.filter(u => u.status === 'ACTIVE').length;
    const blockedUsers = this.users.filter(u => u.status === 'BLOCK').length;
    const totalUsers = this.users.length;

    const activeElement = document.getElementById('activeUsers');
    const blockedElement = document.getElementById('blockedUsers');
    const totalElement = document.getElementById('totalUsers');

    if (activeElement) this.animateNumber(activeElement, activeUsers);
    if (blockedElement) this.animateNumber(blockedElement, blockedUsers);
    if (totalElement) this.animateNumber(totalElement, totalUsers);
  }

  animateNumber(element, targetNumber) {
    const startNumber = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentNumber = Math.round(startNumber + (targetNumber - startNumber) * progress);
      element.textContent = currentNumber;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  viewUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.showNotification(`Viewing details for ${user.name}`, 'info');
      // Here you would typically open a modal or navigate to user details
    }
  }

  editUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.showNotification(`Editing ${user.name}`, 'info');
      // Here you would typically open an edit modal
    }
  }

  deleteUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.showNotification(`Deleting ${user.name}...`, 'warning');
      // Here you would typically make an API call to delete the user
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
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
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  getNotificationColor(type) {
    const colors = {
      success: 'linear-gradient(135deg, #28a745, #20c997)',
      error: 'linear-gradient(135deg, #dc3545, #e74c3c)',
      warning: 'linear-gradient(135deg, #ffc107, #f39c12)',
      info: 'linear-gradient(135deg, #17a2b8, #3498db)'
    };
    return colors[type] || colors.info;
  }

  initializeAnimations() {
    // Add entrance animations to elements
    const elements = document.querySelectorAll('.stat-card, .user-row');
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// Global functions for onclick handlers
function viewUser(userId) {
  if (window.usersManager) {
    window.usersManager.viewUser(userId);
  }
}

function editUser(userId) {
  if (window.usersManager) {
    window.usersManager.editUser(userId);
  }
}

function deleteUser(userId) {
  if (window.usersManager) {
    window.usersManager.deleteUser(userId);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Enhanced Users Management...');
  
  // Only initialize if we're on the users page
  if (document.querySelector('.user-table-container')) {
    window.usersManager = new UsersManager();
    console.log('Enhanced Users Management System ready!');
  }
});

// Export for external use
window.UsersManager = UsersManager;
