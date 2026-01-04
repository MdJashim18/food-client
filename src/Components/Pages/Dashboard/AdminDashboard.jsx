import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign, 
  FiTrendingUp,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiCalendar,
  FiPackage,
  FiBarChart2,
  FiRefreshCw,
  FiGrid,
  FiPlus,
  FiChevronDown
} from "react-icons/fi";
import { 
  FaUserShield,
  FaChartPie,
} from "react-icons/fa";
import { Link } from "react-router";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const AdminDashboard = () => {
    const axiosSecure = UseAxiosSecure();

    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalFoods: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        todayRevenue: 0
    });
    const [timeRange, setTimeRange] = useState('today');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", count: "" });
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, [axiosSecure]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            const [usersRes, ordersRes, foodsRes, categoriesRes] = await Promise.all([
                axiosSecure.get("/users"),
                axiosSecure.get("/orders"),
                axiosSecure.get("/foods"),
                axiosSecure.get("/categories")
            ]);

            setUsers(usersRes.data);
            setOrders(ordersRes.data.data || ordersRes.data);
            setFoods(foodsRes.data);
            setCategories(categoriesRes.data);

            const totalUsers = usersRes.data.length;
            const totalOrders = ordersRes.data.data?.length || ordersRes.data.length;
            const totalFoods = foodsRes.data.length;
            
            const totalRevenue = (ordersRes.data.data || ordersRes.data).reduce((sum, order) => 
                sum + (order.totalAmount || 0), 0
            );
            
            const pendingOrders = (ordersRes.data.data || ordersRes.data).filter(order => 
                order.orderStatus === 'pending'
            ).length;
            
            const confirmedOrders = (ordersRes.data.data || ordersRes.data).filter(order => 
                order.orderStatus === 'confirmed'
            ).length;
            
            const today = new Date().toISOString().split('T')[0];
            const todayRevenue = (ordersRes.data.data || ordersRes.data)
                .filter(order => order.date && order.date.includes(today))
                .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            setStats({
                totalUsers,
                totalOrders,
                totalRevenue,
                totalFoods,
                pendingOrders,
                confirmedOrders,
                todayRevenue
            });

        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to load data',
                text: 'Please try refreshing the page',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Category name required',
                text: 'Please enter a category name',
                confirmButtonColor: '#f59e0b',
            });
            return;
        }

        try {
            const res = await axiosSecure.post('/categories', newCategory);
            if (res.data.insertedId) {
                setCategories([...categories, { ...newCategory, _id: res.data.insertedId }]);
                setNewCategory({ name: "", count: "" });
                setShowAddCategoryModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Category Added',
                    text: 'New category has been added successfully',
                    confirmButtonColor: '#10b981',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error("Error adding category:", err);
            Swal.fire({
                icon: 'error',
                title: 'Failed to add category',
                text: 'Please try again',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        try {
            const confirm = await Swal.fire({
                title: "Delete Category?",
                text: `Are you sure you want to delete "${categoryName}"? This will also delete all foods in this category.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: "Yes, delete",
                cancelButtonText: "Cancel",
                reverseButtons: true
            });

            if (!confirm.isConfirmed) return;

            const res = await axiosSecure.delete(`/categories/${categoryId}`);
            if (res.data.deletedCount > 0) {
                setCategories(categories.filter(cat => cat._id !== categoryId));
                Swal.fire({
                    icon: 'success',
                    title: 'Category Deleted',
                    text: 'Category has been removed successfully',
                    confirmButtonColor: '#10b981',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Failed to delete category',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const orderStatusData = [
        { name: 'Pending', value: stats.pendingOrders, color: 'green' },
        { name: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length, color: '#3b82f6' },
        { name: 'Confirmed', value: stats.confirmedOrders, color: '#10b981' },
        { name: 'Cancelled', value: orders.filter(o => o.orderStatus === 'cancelled').length, color: 'indigo' },
    ];

    const categoryDistributionData = categories.map(cat => ({
        name: cat.name,
        items: parseInt(cat.count) || 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }));

    const handleRoleChange = async (userId, newRole) => {
        try {
            const confirm = await Swal.fire({
                title: "Change User Role?",
                text: `Are you sure you want to change this user's role to ${newRole}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#6b7280',
                confirmButtonText: "Yes, change it",
                cancelButtonText: "Cancel"
            });

            if (!confirm.isConfirmed) return;

            setUpdatingId(userId);

            await axiosSecure.patch(`/users/${userId}`, {
                role: newRole,
            });

            setUsers(prev =>
                prev.map(u =>
                    u._id === userId ? { ...u, role: newRole } : u
                )
            );

            Swal.fire({
                icon: 'success',
                title: 'Role Updated',
                text: `User role has been changed to ${newRole}`,
                showConfirmButton: false,
                timer: 1500,
                background: '#10b981',
                color: 'white',
                iconColor: 'white'
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update user role',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        try {
            const confirm = await Swal.fire({
                title: "Delete User?",
                text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6b7280',
                confirmButtonText: "Yes, delete",
                cancelButtonText: "Cancel",
                reverseButtons: true
            });

            if (!confirm.isConfirmed) return;

            const res = await axiosSecure.delete(`/users/${userId}`);
            
            if (res.data.deletedCount > 0) {
                setUsers(prev => prev.filter(user => user._id !== userId));
                
                Swal.fire({
                    icon: 'success',
                    title: 'User Deleted',
                    text: `${userName} has been removed from the system`,
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#10b981',
                    color: 'white',
                    iconColor: 'white'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Failed to delete user',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'from-red-500 to-pink-500';
            default: return 'from-green-500 to-emerald-500';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin animation-delay-500"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Welcome back, Admin! Here's what's happening today.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select 
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                            <button 
                                onClick={fetchDashboardData}
                                className="p-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                                title="Refresh Data"
                            >
                                <FiRefreshCw className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

               
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <FiTrendingUp /> +12% from last month
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                                <FiUsers className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <FiTrendingUp /> +8% from last week
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                                <FiShoppingBag className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <FiTrendingUp /> +15% from last month
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                                <FiDollarSign className="text-purple-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Total Foods</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalFoods}</p>
                                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                                    <FiTrendingUp /> +5% from last week
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                                <FiPackage className="text-orange-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

               
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <FaChartPie className="text-indigo-600" />
                                Order Status Distribution
                            </h3>
                            <FiChevronDown className="text-gray-400" />
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                   
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900">Quick Actions</h3>
                            <FiBarChart2 className="text-gray-400" />
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowAddCategoryModal(true)}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                <FiPlus /> Add New Category
                            </button>
                            <Link to="/dashboard/AddProducts" className="block w-full text-center border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-300">
                                Add New Food
                            </Link>
                            <Link to="/dashboard/AllOrders" className="block w-full text-center border-2 border-green-600 text-green-600 py-3 rounded-xl hover:bg-green-50 transition-all duration-300">
                                View All Orders
                            </Link>
                            <Link to="/dashboard/SeeAllReviews" className="block w-full text-center border-2 border-green-600 text-green-600 py-3 rounded-xl hover:bg-green-50 transition-all duration-300">
                                View All Reviews
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCalendar className="text-gray-400" />
                                Today's Overview
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Revenue</span>
                                    <span className="font-bold text-green-600">${stats.todayRevenue}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">New Orders</span>
                                    <span className="font-bold text-gray-900">
                                        {orders.filter(o => o.date && o.date.includes(new Date().toISOString().split('T')[0])).length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">New Users</span>
                                    <span className="font-bold text-gray-900">
                                        {users.filter(u => u.createdAt && u.createdAt.includes(new Date().toISOString().split('T')[0])).length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'categories' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Categories ({categories.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('foods')}
                        className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'foods' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Foods ({foods.length})
                    </button>
                </div>
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                                    <p className="text-gray-600">Manage all users and their roles</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FiSearch />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                        <FiFilter className="text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-white">
                                    <tr>
                                        <th className="text-left p-4 text-gray-700 font-semibold">User</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Email</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Role</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Joined</th>
                                        <th className="text-left p-4 text-gray-700 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr 
                                                key={user._id} 
                                                className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {user.name || user.displayName || 'No Name'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-gray-900">{user.email}</p>
                                                </td>
                                                <td className="p-4">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${getRoleColor(user.role)} text-white text-sm font-semibold`}>
                                                        <FaUserShield className="text-sm" />
                                                        <span>{user.role}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-gray-600 text-sm">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewUser(user)}
                                                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                                                            title="View Details"
                                                        >
                                                            <FiEye />
                                                        </button>
                                                        <select
                                                            value={user.role}
                                                            disabled={updatingId === user._id}
                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[120px]"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id, user.name || user.email)}
                                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                                                            title="Delete User"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center">
                                                <div className="text-gray-500">No users found</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-6 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <div className="text-gray-600">
                                    Showing <span className="font-semibold">1-{filteredUsers.length}</span> of{' '}
                                    <span className="font-semibold">{users.length}</span> users
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                
                {activeTab === 'categories' && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
                                    <p className="text-gray-600">Manage food categories and their items</p>
                                </div>
                                <button
                                    onClick={() => setShowAddCategoryModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                    <FiPlus /> Add Category
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {categories.map((category) => (
                                <div key={category._id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all duration-200 hover:shadow-md">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                                            <p className="text-gray-600 text-sm">{category.count || '0 items'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteCategory(category._id, category.name)}
                                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                                                title="Delete Category"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Category ID: {category._id?.slice(-8)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {categories.length > 0 && (
                            <div className="p-6 border-t border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiGrid className="text-indigo-600" />
                                    Category Distribution
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryDistributionData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" stroke="#6b7280" />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip />
                                            <Bar 
                                                dataKey="items" 
                                                fill="#8b5cf6"
                                                radius={[4, 4, 0, 0]}
                                                name="Items"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'foods' && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Foods</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {foods.slice(0, 6).map((food) => (
                                    <div key={food._id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-all duration-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                                                <img 
                                                    src={food.photo} 
                                                    alt={food.food_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-900 line-clamp-1">{food.food_name}</p>
                                                <p className="text-gray-600 text-sm">{food.category}</p>
                                                <p className="text-gray-900 font-bold mt-1">${food.price}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={`px-2 py-1 rounded-full ${food.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {food.available ? 'Available' : 'Out of Stock'}
                                            </span>
                                            <span className="text-gray-600">
                                                {food.order_count || 0} orders
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Link to="/dashboard/AllProductsAdmin" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                    View All Foods →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                {(showAddCategoryModal || editingCategory) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                                        </h3>
                                        <p className="text-gray-600">Enter category details</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowAddCategoryModal(false);
                                            setEditingCategory(null);
                                            setNewCategory({ name: "", count: "" });
                                        }}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        Close
                                    </button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Category Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={editingCategory ? editingCategory.name : newCategory.name}
                                            onChange={(e) => 
                                                editingCategory 
                                                    ? setEditingCategory({...editingCategory, name: e.target.value})
                                                    : setNewCategory({...newCategory, name: e.target.value})
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="e.g., Burgers, Pizza, Drinks"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Item Count (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={editingCategory ? editingCategory.count : newCategory.count}
                                            onChange={(e) => 
                                                editingCategory 
                                                    ? setEditingCategory({...editingCategory, count: e.target.value})
                                                    : setNewCategory({...newCategory, count: e.target.value})
                                            }
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            placeholder="e.g., 45 items"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowAddCategoryModal(false);
                                            setEditingCategory(null);
                                            setNewCategory({ name: "", count: "" });
                                        }}
                                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddCategory}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                                    >
                                        Add Category
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Details Modal */}
                {showUserModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                                        <p className="text-gray-600">Complete user information</p>
                                    </div>
                                    <button
                                        onClick={() => setShowUserModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                            {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0) || 'U'}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900">
                                            {selectedUser.name || selectedUser.displayName || 'No Name'}
                                        </h4>
                                        <p className="text-gray-600">{selectedUser.email}</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Current Role</label>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getRoleColor(selectedUser.role)} text-white font-semibold`}>
                                                <FaUserShield />
                                                <span>{selectedUser.role}</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Account Created</label>
                                            <div className="text-gray-600">
                                                {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={() => setShowUserModal(false)}
                                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Handle edit user action
                                            setShowUserModal(false);
                                        }}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                                    >
                                        Edit User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;