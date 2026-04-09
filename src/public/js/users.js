// Enhanced Users Management - Interactive Features
console.log('Enhanced Users Management System initialized');

class UsersManager {
  constructor() {
    this.users = [];
    this.filteredUsers = [];
    this.currentSort = { column: null, direction: 'asc' };
    this.init();
  }

  init() {
    this.loadUsers();
    this.bindTableDelegation();
    this.setupStaticEventListeners();
    this.updateStats();
    this.initializeAnimations();
  }

  loadUsers() {
    const rows = document.querySelectorAll('.users-page-table .user-row');
    this.users = Array.from(rows).map((row, listIndex) => {
      const template = row.cloneNode(true);
      let status = row.dataset.memberStatus || 'ACTIVE';
      if (status !== 'DELETE') {
        const t = template.querySelector('.member-status-toggle');
        if (t) status = t.checked ? 'ACTIVE' : 'BLOCK';
      }
      const pts = template.querySelector('.points-value');
      return {
        id: row.dataset.userId,
        listIndex,
        name: template.querySelector('.user-name').textContent.trim(),
        phone: (row.dataset.memberPhone || template.querySelector('.phone-link')?.textContent || '').trim(),
        points: parseInt(pts ? pts.textContent.trim() : '0', 10) || 0,
        status,
        address: row.dataset.memberAddress || '',
        description: row.dataset.memberDesc || '',
        element: template
      };
    });
    this.filteredUsers = [...this.users];
  }

  bindTableDelegation() {
    const table = document.querySelector('.users-page-table .modern-table');
    if (!table || this._tableDelegationBound) return;
    this._tableDelegationBound = true;
    table.addEventListener('change', (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('member-status-toggle')) {
        this.handleStatusToggle(t);
      }
    });
  }

  setupStaticEventListeners() {
    if (this._staticListenersBound) return;
    this._staticListenersBound = true;

    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterUsers(e.target.value);
      });
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        this.filterByStatus(e.target.value);
      });
    }

    document.querySelectorAll('.sortable').forEach(header => {
      header.addEventListener('click', () => {
        this.sortTable(header.dataset.sort);
      });
    });

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
      let aVal;
      let bVal;

      switch (column) {
        case 'index':
          aVal = a.listIndex;
          bVal = b.listIndex;
          break;
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
    const tbody = document.querySelector('.users-page-table .modern-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    this.filteredUsers.forEach((user, index) => {
      const row = user.element.cloneNode(true);
      const rn = row.querySelector('.row-num');
      if (rn) rn.textContent = String(index + 1);
      tbody.appendChild(row);
    });

    this.updateSortIndicators();
  }

  updateSortIndicators() {
    document.querySelectorAll('.sortable').forEach(header => {
      header.classList.remove('sort-asc', 'sort-desc');
      if (header.dataset.sort === this.currentSort.column) {
        header.classList.add(`sort-${this.currentSort.direction}`);
      }
    });
  }

  syncToggleLabel(checkbox) {
    const row = checkbox.closest('.user-row');
    if (!row) return;
    const label = row.querySelector('.toggle-label');
    if (!label) return;
    const on = checkbox.checked;
    label.textContent = on ? 'Active' : 'Blocked';
    label.classList.toggle('is-active', on);
    label.classList.toggle('is-blocked', !on);
  }

  async handleStatusToggle(checkbox) {
    const userId = checkbox.dataset.userId;
    const newStatus = checkbox.checked ? 'ACTIVE' : 'BLOCK';
    const row = checkbox.closest('.user-row');
    const prevChecked = !checkbox.checked;

    this.syncToggleLabel(checkbox);

    checkbox.disabled = true;

    try {
      const response = await fetch('/admin/user/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: userId,
          memberStatus: newStatus
        })
      });

      if (response.ok) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = newStatus;
          const tpl = user.element;
          if (tpl) {
            tpl.dataset.memberStatus = newStatus;
            const tt = tpl.querySelector('.member-status-toggle');
            if (tt) tt.checked = newStatus === 'ACTIVE';
            const lab = tpl.querySelector('.toggle-label');
            if (lab) {
              lab.textContent = newStatus === 'ACTIVE' ? 'Active' : 'Blocked';
              lab.classList.toggle('is-active', newStatus === 'ACTIVE');
              lab.classList.toggle('is-blocked', newStatus !== 'ACTIVE');
            }
          }
        }

        checkbox.disabled = false;

        if (row) {
          row.style.background = 'rgba(29, 158, 117, 0.12)';
          setTimeout(() => {
            row.style.background = '';
          }, 900);
        }

        this.updateStats();
        this.showNotification(`User status updated to ${newStatus}`, 'success');

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        checkbox.checked = prevChecked;
        this.syncToggleLabel(checkbox);
        checkbox.disabled = false;
        let msg = 'Unknown error';
        try {
          const errorData = await response.json();
          msg = errorData.message || msg;
        } catch (_) {}
        this.showNotification(`Failed to update status: ${msg}`, 'error');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      checkbox.checked = prevChecked;
      this.syncToggleLabel(checkbox);
      checkbox.disabled = false;
      this.showNotification(`Failed to update status: ${error.message}`, 'error');
    }
  }

  updateStats() {
    const activeUsers = this.users.filter(u => u.status === 'ACTIVE').length;
    const blockedUsers = this.users.filter(u => u.status === 'BLOCK').length;
    const totalUsers = this.users.length;

    const activeElement = document.getElementById('activeUsers');
    const blockedElement = document.getElementById('blockedUsers');
    const totalElement = document.getElementById('totalUsers');
    const blockedDelta = document.getElementById('blockedUsersDelta');

    if (activeElement) this.animateNumber(activeElement, activeUsers);
    if (blockedElement) this.animateNumber(blockedElement, blockedUsers);
    if (totalElement) this.animateNumber(totalElement, totalUsers);

    if (blockedDelta) {
      if (blockedUsers > 0) {
        blockedDelta.textContent = `${blockedUsers} currently blocked`;
        blockedDelta.classList.add('is-warning');
      } else {
        blockedDelta.textContent = 'No blocks active';
        blockedDelta.classList.remove('is-warning');
      }
    }
  }

  animateNumber(element, targetNumber) {
    const startNumber = parseInt(element.textContent, 10) || 0;
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
    }
  }

  editUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.openEditUserModal(user);
    }
  }

  openEditUserModal(user) {
    document.getElementById('editUserName').value = user.name || '';
    document.getElementById('editUserPhone').value = user.phone || '';
    document.getElementById('editUserAddress').value = user.address || '';
    document.getElementById('editUserDesc').value = user.description || '';
    document.getElementById('editUserPoints').value = user.points || 0;
    document.getElementById('editUserStatus').value = user.status || 'ACTIVE';

    document.getElementById('editUserForm').dataset.userId = user.id;

    document.getElementById('editUserModal').style.display = 'block';
  }

  async updateUser(userId, formData) {
    try {
      this.showNotification('Updating user...', 'warning');

      const response = await fetch('/admin/user/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: userId,
          ...formData
        }),
      });

      if (response.ok) {
        this.showNotification('User updated successfully!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        this.showNotification(`Failed to update user: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      this.showNotification(`Failed to update user: ${error.message}`, 'error');
    }
  }

  closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
    document.getElementById('editUserForm').reset();
  }

  async deleteUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        this.showNotification(`Deleting ${user.name}...`, 'warning');

        const response = await fetch(`/admin/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          this.showNotification(`${user.name} deleted successfully!`, 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          const errorData = await response.json();
          this.showNotification(`Failed to delete ${user.name}: ${errorData.message || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showNotification(`Failed to delete ${user.name}: ${error.message}`, 'error');
      }
    } else if (!user) {
      this.showNotification('User not found!', 'error');
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

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) notification.parentNode.removeChild(notification);
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
    const elements = document.querySelectorAll('.admin-stats-grid--users .admin-stat, .user-row');
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
  } else {
    alert('System not ready. Please refresh the page.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.user-table-container')) {
    window.usersManager = new UsersManager();

    const editForm = document.getElementById('editUserForm');
    if (editForm) {
      editForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const userId = this.dataset.userId;
        const formData = {
          memberNick: document.getElementById('editUserName').value,
          memberPhone: document.getElementById('editUserPhone').value,
          memberAddress: document.getElementById('editUserAddress').value,
          memberDesc: document.getElementById('editUserDesc').value,
          memberPoints: parseInt(document.getElementById('editUserPoints').value, 10),
          memberStatus: document.getElementById('editUserStatus').value
        };

        window.usersManager.updateUser(userId, formData);
      });
    }

    const modal = document.getElementById('editUserModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          window.usersManager.closeEditUserModal();
        }
      });
    }
  }
});

function closeEditUserModal() {
  if (window.usersManager) {
    window.usersManager.closeEditUserModal();
  }
}

window.UsersManager = UsersManager;
