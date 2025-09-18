// frontend/src/components/ProductListExample.js
// Copy this file to your React frontend: src/components/ProductListExample.js
// This is an example component showing how to use the API service

import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ProductListExample = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    order: 'createdAt'
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [pagination]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getProducts(pagination);
      setProducts(data);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleOrderChange = (newOrder) => {
    setPagination(prev => ({ ...prev, order: newOrder, page: 1 }));
  };

  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      const data = await apiService.getProducts({
        ...pagination,
        search: searchTerm
      });
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error loading products</h3>
        <p>{error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-list-example">
      <h2>Products from Backend API</h2>
      
      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => {
            if (e.target.value.length > 2) {
              handleSearch(e.target.value);
            }
          }}
        />
      </div>

      {/* Order controls */}
      <div className="controls">
        <select 
          value={pagination.order} 
          onChange={(e) => handleOrderChange(e.target.value)}
        >
          <option value="createdAt">Newest First</option>
          <option value="-createdAt">Oldest First</option>
          <option value="productPrice">Price Low to High</option>
          <option value="-productPrice">Price High to Low</option>
          <option value="productName">Name A-Z</option>
          <option value="-productName">Name Z-A</option>
        </select>
      </div>

      {/* Products grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-images">
              {product.productImages && product.productImages.length > 0 ? (
                <img 
                  src={`http://localhost:3003/${product.productImages[0]}`}
                  alt={product.productName}
                  onError={(e) => {
                    e.target.src = 'http://localhost:3003/img/default.jpeg';
                  }}
                />
              ) : (
                <img src="http://localhost:3003/img/default.jpeg" alt="No image" />
              )}
            </div>
            
            <div className="product-info">
              <h3>{product.productName}</h3>
              <p className="price">${product.productPrice}</p>
              <p className="description">{product.productDesc}</p>
              <p className="collection">{product.productCollection}</p>
              <p className="size">Size: {product.productSize}</p>
              <p className="stock">Stock: {product.productLeftCount}</p>
              <p className="views">Views: {product.productViews || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </button>
        
        <span>Page {pagination.page}</span>
        
        <button 
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={products.length < pagination.limit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductListExample;
