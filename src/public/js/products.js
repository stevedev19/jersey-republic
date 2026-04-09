// Enhanced Products Management - Interactive Features
console.log("Enhanced Products Management System initialized");

class ProductsManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentSort = { column: null, direction: 'asc' };
    this.init();
  }

  init() {
    this.loadProducts();
    this.setupEventListeners();
    this.updateStats();
    this.initializeAnimations();
  }

  loadProducts() {
    // Extract products from the table rows (human-readable cells + raw codes in data attrs)
    const rows = document.querySelectorAll('.product-row');
    this.products = Array.from(rows).map((row, rowOrder) => {
      const statusSelect = row.querySelector('.status-select');
      const priceEl = row.querySelector('.price-value');
      const priceText = priceEl ? priceEl.textContent : '0';
      const stockRaw = row.dataset.productStock;
      const leftParsed =
        stockRaw !== undefined && stockRaw !== ''
          ? parseInt(stockRaw, 10)
          : parseInt(row.querySelector('.stock-value')?.textContent.trim() || '0', 10) || 0;
      return {
        id: row.dataset.productId,
        name: row.querySelector('.product-name')?.textContent.trim() || '',
        description: row.querySelector('.product-desc')?.textContent || '',
        collection: row.dataset.productCollection || '',
        collectionLabel:
          row.querySelector('.league-text')?.textContent.trim() || '',
        volume: row.dataset.productVolume || '',
        volumeLabel: row.querySelector('.kit-text')?.textContent.trim() || '',
        size: row.querySelector('.size-badge')?.textContent.trim() || '',
        price: parseFloat(String(priceText).replace(/[^0-9.]/g, '')) || 0,
        leftCount: Number.isFinite(leftParsed) ? leftParsed : 0,
        status: statusSelect.value,
        productStatus: statusSelect.value,
        madeYear: row.dataset.madeYear ? parseInt(row.dataset.madeYear, 10) : null,
        rowOrder,
        element: row
      };
    });
    this.filteredProducts = [...this.products];
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('productSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterProducts(e.target.value);
      });
    }

    // League filter
    const leagueFilter = document.getElementById('leagueFilter');
    if (leagueFilter) {
      leagueFilter.addEventListener('change', (e) => {
        this.filterByLeague(e.target.value);
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
    document.querySelectorAll('.new-product-status').forEach(select => {
      select.addEventListener('change', (e) => {
        this.handleStatusChange(e.target);
      });
    });

    // Action button handlers
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = e.target.closest('.product-row').dataset.productId;
        this.viewProduct(productId);
      });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = e.target.closest('.product-row').dataset.productId;
        this.editProduct(productId);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = e.target.closest('.product-row').dataset.productId;
        this.deleteProduct(productId);
      });
    });

    // Form toggle
    const toggleBtn = document.getElementById('toggle-form-btn');
    const form = document.getElementById('product-form');
    const cancelBtn = document.getElementById('cancel-form-btn');

    if (toggleBtn && form) {
      toggleBtn.addEventListener('click', () => {
        form.style.display = form.style.display === 'none' ? 'grid' : 'none';
        toggleBtn.textContent = form.style.display === 'none' ? 'New Product' : 'Hide form';
      });
    }

    if (cancelBtn && form) {
      cancelBtn.addEventListener('click', () => {
        form.style.display = 'none';
        toggleBtn.textContent = 'New Product';
        form.reset();
      });
    }
  }

  filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      (product.collection || '').toLowerCase().includes(term) ||
      (product.collectionLabel || '').toLowerCase().includes(term) ||
      (product.volume || '').toLowerCase().includes(term) ||
      (product.volumeLabel || '').toLowerCase().includes(term)
    );
    this.updateTableDisplay();
  }

  filterByLeague(league) {
    if (!league) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => 
        (product.collection || '') === league
      );
    }
    this.updateTableDisplay();
  }

  filterByStatus(status) {
    if (!status) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.status === status);
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

    this.filteredProducts.sort((a, b) => {
      let aVal, bVal;
      
      switch (column) {
        case 'index':
          aVal = a.rowOrder;
          bVal = b.rowOrder;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'league':
          aVal = a.collection.toLowerCase();
          bVal = b.collection.toLowerCase();
          break;
        case 'kit':
          aVal = (a.volume || '').toLowerCase();
          bVal = (b.volume || '').toLowerCase();
          break;
        case 'size':
          aVal = (a.size || '').toLowerCase();
          bVal = (b.size || '').toLowerCase();
          break;
        case 'price':
          aVal = a.price;
          bVal = b.price;
          break;
        case 'stock':
          aVal = a.leftCount;
          bVal = b.leftCount;
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
    const tbody =
      document.querySelector('.modern-table--jerseys tbody') ||
      document.querySelector('.modern-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    this.filteredProducts.forEach((product, index) => {
      const row = product.element.cloneNode(true);
      const idxEl = row.querySelector('.product-index');
      if (idxEl) idxEl.textContent = String(index + 1);
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

  async handleStatusChange(selectElement) {
    const productId = selectElement.id;
    const newStatus = selectElement.value;
    const row = selectElement.closest('.product-row');
    
    // Add loading state
    selectElement.disabled = true;
    selectElement.style.opacity = '0.6';
    
    try {
      console.log('Updating product status:', { productId, newStatus });
      
      // Make API call to update product status
      const response = await fetch(`/admin/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productStatus: newStatus
        }),
      });
      
      console.log('API response status:', response.status);

      if (response.ok) {
        // Update local data
        const product = this.products.find(p => p.id === productId);
        if (product) {
          product.status = newStatus;
          product.productStatus = newStatus;
        }
        
        // Add success animation
        row.style.background = 'rgba(0, 255, 0, 0.1)';
        setTimeout(() => {
          row.style.background = '';
        }, 1000);
        
        this.updateStats();
        this.showNotification(`Product status updated to ${newStatus}`, 'success');
      } else {
        const errorData = await response.json();
        this.showNotification(`Failed to update status: ${errorData.message || 'Unknown error'}`, 'error');
        
        // Revert the select value
        const product = this.products.find(p => p.id === productId);
        if (product) {
          selectElement.value = product.status;
        }
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      this.showNotification(`Failed to update status: ${error.message}`, 'error');
      
      // Revert the select value
      const product = this.products.find(p => p.id === productId);
      if (product) {
        selectElement.value = product.status;
      }
    } finally {
      // Update UI
      selectElement.disabled = false;
      selectElement.style.opacity = '1';
    }
  }

  updateStats() {
    const totalJerseys = this.products.length;
    const activeJerseys = this.products.filter(p => p.status === 'PROCESS').length;
    const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.leftCount), 0);

    const totalElement = document.getElementById('totalJerseys');
    const activeElement = document.getElementById('activeJerseys');
    const valueElement = document.getElementById('totalValue');

    if (totalElement) this.animateNumber(totalElement, totalJerseys);
    if (activeElement) this.animateNumber(activeElement, activeJerseys);
    if (valueElement) this.animateNumber(valueElement, totalValue, true);
  }

  animateNumber(element, targetNumber, isCurrency = false) {
    const startNumber = isCurrency ? 
      parseFloat(element.textContent.replace('$', '')) || 0 : 
      parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentNumber = startNumber + (targetNumber - startNumber) * progress;
      element.textContent = isCurrency ? 
        `$${Math.round(currentNumber).toLocaleString()}` : 
        Math.round(currentNumber);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  viewProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.showNotification(`Viewing details for ${product.name}`, 'info');
      // Here you would typically open a modal or navigate to product details
    }
  }

  editProduct(productId) {
    console.log('Edit product called with ID:', productId);
    console.log('Available products:', this.products);
    const product = this.products.find(p => p.id === productId);
    console.log('Found product:', product);
    if (product) {
      this.openEditModal(product);
    } else {
      console.error('Product not found with ID:', productId);
      this.showNotification('Product not found!', 'error');
    }
  }

  openEditModal(product) {
    console.log('Opening edit modal for product:', product);
    
    // Populate the form with product data
    document.getElementById('editProductName').value = product.name || '';
    document.getElementById('editProductPrice').value = product.price || '';
    document.getElementById('editProductSize').value = product.size || '';
    document.getElementById('editProductVolume').value = product.volume || '';
    document.getElementById('editProductCollection').value = product.collection || '';
    document.getElementById('editProductLeftCount').value = product.leftCount || '';
    document.getElementById('editProductDesc').value = product.description || '';
    document.getElementById('editProductStatus').value = product.status || 'PROCESS';
    document.getElementById('editMadeYear').value = product.madeYear || '';

    // Store the product ID for the update
    document.getElementById('editProductForm').dataset.productId = product.id;

    // Show the modal
    document.getElementById('editProductModal').style.display = 'flex';
  }

  async updateProduct(productId, formData) {
    try {
      console.log('Updating product:', productId, formData);
      this.showNotification('Updating product...', 'warning');
      
      const response = await fetch(`/admin/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Update response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Update result:', result);
        this.showNotification('Product updated successfully!', 'success');
        
        // Update the product in the local array
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          this.products[productIndex] = { ...this.products[productIndex], ...formData };
        }
        
        // Close modal first
        this.closeEditModal();
        
        // Reload page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        this.showNotification(`Failed to update product: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      this.showNotification(`Failed to update product: ${error.message}`, 'error');
    }
  }

  closeEditModal() {
    document.getElementById('editProductModal').style.display = 'none';
    document.getElementById('editProductForm').reset();
  }

  async deleteProduct(productId) {
    const product = this.products.find(p => p.id === productId);
    if (product && confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        this.showNotification(`Deleting ${product.name}...`, 'warning');
        
        const response = await fetch(`/admin/product/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          this.showNotification(`${product.name} deleted successfully!`, 'success');
          // Remove the product from the local array
          this.products = this.products.filter(p => p.id !== productId);
          // Refresh the table
          this.updateTableDisplay();
        } else {
          const errorData = await response.json();
          this.showNotification(`Failed to delete ${product.name}: ${errorData.message || 'Unknown error'}`, 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showNotification(`Failed to delete ${product.name}: ${error.message}`, 'error');
      }
    }
  }

  showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
      notification.remove();
    });

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
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
    const elements = document.querySelectorAll('.stat-card, .product-row');
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
function viewProduct(productId) {
  if (window.productsManager) {
    window.productsManager.viewProduct(productId);
  }
}

function editProduct(productId) {
  if (window.productsManager) {
    window.productsManager.editProduct(productId);
  }
}

function deleteProduct(productId) {
  if (window.productsManager) {
    window.productsManager.deleteProduct(productId);
  }
}

// Enhanced form validation
function validateForm() {
  const form = document.querySelector(".product-form");
  const requiredFields = form.querySelectorAll("[required]");
  const imageInputs = form.querySelectorAll('input[type="file"][name="productImages"]');

  let isValid = true;
  let hasImage = false;


  // Check required fields
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = "#dc3545";
      isValid = false;
    } else {
      field.style.borderColor = "";
    }
  });

  // Check if at least one image is uploaded
  imageInputs.forEach(input => {
    if (input.files && input.files.length > 0) {
      hasImage = true;
    }
  });

  if (!hasImage) {
    alert("Please upload at least one product image");
    isValid = false;
  }

  if (!isValid) {
    if (!hasImage) {
      alert("Please fill in all required fields and upload at least one image");
    } else {
      alert("Please fill in all required fields");
    }
  }

  return isValid;
}
// Enhanced image preview handler
function previewFileHandler(input, index) {
  const file = input.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      input.value = "";
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      input.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById(`image-preview-${index}`);
      const uploadBox = input.closest(".upload-box");
      const overlay = uploadBox.querySelector(".upload-overlay");
      
      img.src = e.target.result;
      img.style.objectFit = "cover";
      img.style.border = "2px solid #28a745";
      
      // Update overlay with success state
      overlay.innerHTML = `<i class="fas fa-check-circle overlay-success-icon"></i><span class="overlay-success">Image Selected</span>`;
      overlay.style.background = "rgba(40, 167, 69, 0.1)";
      
      // Add success animation
      uploadBox.style.transform = "scale(1.05)";
      setTimeout(() => {
        uploadBox.style.transform = "scale(1)";
      }, 200);
    };
    reader.readAsDataURL(file);
  } else {
    // Reset preview if no file selected
    const img = document.getElementById(`image-preview-${index}`);
    const uploadBox = input.closest(".upload-box");
    const overlay = uploadBox.querySelector(".upload-overlay");
    
    img.src = "/img/upload.svg";
    img.style.border = "";
    
    // Reset overlay to default state
    overlay.innerHTML = `<i class="fas fa-camera"></i><span>Upload Image</span>`;
    overlay.style.background = "rgba(44, 62, 80, 0.1)";
  }
}// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Enhanced Products Management...');
  
  // Only initialize if we're on the products page
  if (document.querySelector('.products-table-container')) {
    window.productsManager = new ProductsManager();
    console.log('Enhanced Products Management System ready!');
    
    // Add event listener for edit form submission
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
      editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = this.dataset.productId;
        const madeYearRaw = document.getElementById('editMadeYear').value;
        const formData = {
          productName: document.getElementById('editProductName').value,
          productPrice: parseFloat(document.getElementById('editProductPrice').value),
          productSize: document.getElementById('editProductSize').value,
          productVolume: document.getElementById('editProductVolume').value,
          productCollection: document.getElementById('editProductCollection').value,
          productLeftCount: parseInt(document.getElementById('editProductLeftCount').value),
          productDesc: document.getElementById('editProductDesc').value,
          productStatus: document.getElementById('editProductStatus').value,
          ...(madeYearRaw !== '' && { madeYear: parseInt(madeYearRaw) }),
        };
        
        window.productsManager.updateProduct(productId, formData);
      });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('editProductModal');
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          window.productsManager.closeEditModal();
        }
      });
    }
  }
});

// Global functions for modal control
function closeEditModal() {
  if (window.productsManager) {
    window.productsManager.closeEditModal();
  }
}

// Export for external use
window.ProductsManager = ProductsManager;
