import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { Link } from 'react-router';
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiRefreshCw, FiPackage, FiDollarSign, FiStar, FiShoppingBag } from "react-icons/fi";
import { FaRegClock, FaFireAlt } from "react-icons/fa";
import Swal from 'sweetalert2';

const AllProductsAdmin = () => {
    const axiosSecure = UseAxiosSecure();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        axiosSecure.get('/foods')
            .then((res) => {
                const data = res.data;
                setProducts(data);
                setFilteredProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to load products',
                    text: 'Please try again',
                    confirmButtonColor: '#ef4444',
                });
            });
    };

    
    useEffect(() => {
        let result = [...products];

      
        if (searchTerm) {
            result = result.filter(product =>
                product.food_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

       
        if (categoryFilter !== 'all') {
            result = result.filter(product => product.category === categoryFilter);
        }

        
        if (availabilityFilter !== 'all') {
            result = result.filter(product => 
                availabilityFilter === 'available' ? product.available === true : product.available === false
            );
        }

        
        switch(sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
                break;
            case 'name':
                result.sort((a, b) => a.food_name?.localeCompare(b.food_name));
                break;
        }

        setFilteredProducts(result);
    }, [searchTerm, categoryFilter, availabilityFilter, sortBy, products]);

    
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

   
    const handleDelete = (id, name) => {
        Swal.fire({
            title: "Delete Product?",
            html: `<div class="text-left">
                <p class="mb-2">Are you sure you want to delete:</p>
                <p class="font-bold text-lg">${name}</p>
                <p class="text-red-600 text-sm mt-2">This action cannot be undone!</p>
            </div>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/foods/${id}`)
                    .then((res) => {
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: 'Product has been deleted successfully',
                                showConfirmButton: false,
                                timer: 1500,
                                background: '#10b981',
                                color: 'white',
                                iconColor: 'white'
                            });

                            setProducts(prev => prev.filter((p) => p._id !== id));
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Delete Failed',
                            text: 'Failed to delete product',
                            confirmButtonColor: '#ef4444',
                        });
                    });
            }
        });
    };

    
    const stats = {
        total: products.length,
        available: products.filter(p => p.available).length,
        outOfStock: products.filter(p => !p.available).length,
        avgPrice: products.length > 0 
            ? Math.round(products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length)
            : 0,
        avgRating: products.length > 0
            ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
            : 0
    };

    
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
               
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                            <p className="text-gray-600">Manage all food products in the system</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchProducts}
                                className="p-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                                title="Refresh"
                            >
                                <FiRefreshCw className="text-gray-600" />
                            </button>
                            <Link
                                to="/dashboard/addProducts"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <FiPlus />
                                <span>Add New Product</span>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                    <FiPackage className="text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Available</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                                    <FiShoppingBag className="text-green-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Avg. Price</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.avgPrice}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                                    <FiDollarSign className="text-purple-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Avg. Rating</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.avgRating}/5</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center">
                                    <FiStar className="text-yellow-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-2">Search Products</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FiSearch />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, category, or restaurant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Availability</label>
                            <select
                                value={availabilityFilter}
                                onChange={(e) => setAvailabilityFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="out-of-stock">Out of Stock</option>
                            </select>
                        </div>
                    </div>

                    
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-gray-400" />
                            <span className="text-gray-700">Sort by:</span>
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="price-low">Price (Low to High)</option>
                            <option value="price-high">Price (High to Low)</option>
                            <option value="rating">Rating (High to Low)</option>
                        </select>
                    </div>
                </div>

                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">
                            Products ({filteredProducts.length})
                            {searchTerm && (
                                <span className="text-gray-600 text-sm ml-2">
                                    for "{searchTerm}"
                                </span>
                            )}
                        </h2>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                                <FiPackage className="w-full h-full" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm 
                                    ? `No products found matching "${searchTerm}"`
                                    : 'No products available. Add your first product!'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors duration-200"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-white">
                                    <tr>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Product</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Category</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Price</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Rating</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr 
                                            key={product._id} 
                                            className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 group"
                                        >
                                           
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={product.photo || "https://via.placeholder.com/100?text=Food"}
                                                            alt={product.food_name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/100?text=Food";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate">
                                                            {product.food_name}
                                                        </p>
                                                        <p className="text-gray-500 text-sm truncate">
                                                            {product.restaurant_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <FaRegClock className="text-gray-400 text-xs" />
                                                            <span className="text-gray-500 text-xs">
                                                                {product.preparation_time || "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            
                                            <td className="p-4">
                                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                                    {product.category || "Uncategorized"}
                                                </span>
                                            </td>

                                            
                                            <td className="p-4">
                                                <div className="font-bold text-gray-900">
                                                    {product.price}
                                                </div>
                                            </td>

                                           
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FiStar 
                                                                key={i} 
                                                                className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-700 font-semibold">
                                                        {(product.rating || 0).toFixed(1)}
                                                    </span>
                                                </div>
                                            </td>

                                           
                                            <td className="p-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                                    product.available 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <span>{product.available ? 'Available' : 'Out of Stock'}</span>
                                                </div>
                                            </td>

                                           
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    
                                                    <Link 
                                                        to={`/ProductsDetails/${product._id}`}
                                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 group/tooltip relative"
                                                        title="View Details"
                                                    >
                                                        <FiEye />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                                                            View Details
                                                        </span>
                                                    </Link>

                                                    
                                                    <Link 
                                                        to={`/dashboard/UpdateProducts/${product._id}`}
                                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors duration-200 group/tooltip relative"
                                                        title="Edit Product"
                                                    >
                                                        <FiEdit />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                                                            Edit Product
                                                        </span>
                                                    </Link>

                                                    
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.food_name)}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 group/tooltip relative"
                                                        title="Delete Product"
                                                    >
                                                        <FiTrash2 />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                                                            Delete Product
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    
                    {filteredProducts.length > 0 && (
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="text-gray-600 text-sm">
                                    Showing <span className="font-semibold text-gray-900">1-{filteredProducts.length}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{products.length}</span> products
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm">
                                        Previous
                                    </button>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(num => (
                                            <button
                                                key={num}
                                                className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 text-sm"
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-sm">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProductsAdmin;