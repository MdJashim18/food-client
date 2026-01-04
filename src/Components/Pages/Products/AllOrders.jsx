import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FiEye, FiTrash2, FiPackage, FiCheckCircle, FiClock, FiDollarSign, FiX, FiEdit } from "react-icons/fi";
import { MdLocalShipping, MdCancel } from "react-icons/md";
import Swal from "sweetalert2";

const AllOrders = () => {
    const axiosSecure = UseAxiosSecure();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get("/orders");
            const sortedOrders = res.data.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            Swal.fire("Error!", "Failed to load orders.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        try {
            await axiosSecure.delete(`/orders/${orderId}`);
            Swal.fire({
                title: "Deleted!",
                text: "Order has been deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            fetchOrders();
        } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to delete order.", "error");
        }

    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder) return;

        const statusOptions = [
            { value: 'pending', label: 'Pending', icon: <FiClock /> },
            { value: 'confirmed', label: 'Confirmed', icon: <FiCheckCircle /> },
            { value: 'processing', label: 'Processing', icon: <FiPackage /> },
            { value: 'shipped', label: 'Shipped', icon: <MdLocalShipping /> },
            { value: 'delivered', label: 'Delivered', icon: <FiCheckCircle /> },
            { value: 'cancelled', label: 'Cancelled', icon: <MdCancel /> }
        ];

        const currentStatusIndex = statusOptions.findIndex(option => option.value === selectedOrder.orderStatus);
        const nextStatus = currentStatusIndex < statusOptions.length - 1
            ? statusOptions[currentStatusIndex + 1]
            : statusOptions[0];

        const result = await Swal.fire({
            title: 'Update Order Status',
            html: `
                <div class="text-left">
                    <p class="mb-2">Current Status: <span class="font-bold">${selectedOrder.orderStatus?.toUpperCase() || 'PENDING'}</span></p>
                    <p class="mb-4">Update to: <span class="font-bold text-green-600">${nextStatus.label.toUpperCase()}</span></p>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Or select manually:</label>
                        <select id="statusSelect" class="w-full p-2 border border-gray-300 rounded-md">
                            ${statusOptions.map(option => `
                                <option value="${option.value}" ${option.value === selectedOrder.orderStatus ? 'selected' : ''}>
                                    ${option.label}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Status',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
            didOpen: () => {
                const select = document.getElementById('statusSelect');
                select.focus();
            },
            preConfirm: () => {
                const select = document.getElementById('statusSelect');
                return select.value;
            }
        });

        if (result.isConfirmed) {
            const newStatus = result.value;

            try {
                setUpdatingStatus(true);

                const updateData = {
                    orderStatus: newStatus,
                    ...(newStatus === 'delivered' && selectedOrder.paymentStatus === 'cash_on_delivery' && {
                        paymentStatus: 'paid'
                    })
                };

                const response = await axiosSecure.patch(`/orders/${selectedOrder._id}`, updateData);

                if (response.data.success) {
                    setSelectedOrder(prev => ({
                        ...prev,
                        ...updateData
                    }));

                    setOrders(prevOrders =>
                        prevOrders.map(order =>
                            order._id === selectedOrder._id
                                ? { ...order, ...updateData }
                                : order
                        )
                    );

                    Swal.fire({
                        title: 'Success!',
                        text: `Order status updated to ${newStatus.toUpperCase()}`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                console.error("Error updating status:", error);
                Swal.fire('Error!', 'Failed to update order status.', 'error');
            } finally {
                setUpdatingStatus(false);
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "bg-green-100 text-green-800", icon: <FiClock className="mr-1" /> },
            confirmed: { color: "bg-green-100 text-green-800", icon: <FiCheckCircle className="mr-1" /> },
            processing: { color: "bg-green-100 text-green-800", icon: <FiPackage className="mr-1" /> },
            shipped: { color: "bg-green-100 text-green-800", icon: <MdLocalShipping className="mr-1" /> },
            delivered: { color: "bg-green-100 text-green-800", icon: <FiCheckCircle className="mr-1" /> },
            cancelled: { color: "bg-green-100 text-green-800", icon: <MdCancel className="mr-1" /> },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.icon}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const paymentConfig = {
            paid: "bg-green-100 text-green-800",
            unpaid: "bg-green-100 text-green-800",
            cash_on_delivery: "bg-green-100 text-green-800",
            pending: "bg-green-100 text-green-800",
        };
        const className = paymentConfig[status] || paymentConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>
                {status.replace(/_/g, ' ').toUpperCase()}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
                    <p className="text-gray-600 mt-1">Manage and monitor customer orders</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="text-gray-400">
                                            <FiPackage className="w-16 h-16 mx-auto mb-4" />
                                            <p className="text-lg">No orders found</p>
                                            <p className="text-sm">Orders will appear here when customers place them</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-gray-900">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.orderType === "online" ? "Online" : "Offline"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.userName || "N/A"}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.email}</div>
                                            <div className="text-sm text-gray-500">{order.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(order.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(order.date).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-semibold text-gray-900">
                                                <FiDollarSign className="mr-1" />
                                                {formatCurrency(order.totalAmount || 0)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.products?.length || 0} items
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.orderStatus || "pending")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPaymentStatusBadge(order.paymentStatus || "pending")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleView(order)}
                                                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                                                    title="View Details"
                                                >
                                                    <FiEye className="mr-2" />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order._id)}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                                                    title="Delete Order"
                                                >
                                                    <FiTrash2 className="mr-2" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && selectedOrder && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 modal-backdrop"
                        onClick={handleBackdropClick}
                    ></div>

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Order ID: #{selectedOrder._id?.slice(-8).toUpperCase() || 'N/A'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Close"
                                    disabled={updatingStatus}
                                >
                                    <FiX className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                                                Customer Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Name:</span>
                                                    <span className="text-gray-900">{selectedOrder.userName || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Email:</span>
                                                    <span className="text-gray-900 break-all">{selectedOrder.email}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Mobile:</span>
                                                    <span className="text-gray-900">{selectedOrder.mobile}</span>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium text-gray-700">Address:</span>
                                                    <span className="text-gray-900 text-right max-w-xs">
                                                        {selectedOrder.address}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                                                Order Information
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Order Date:</span>
                                                    <span className="text-gray-900">
                                                        {new Date(selectedOrder.date).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Delivery Date:</span>
                                                    <span className="text-gray-900">
                                                        {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Order Type:</span>
                                                    <span className="text-gray-900 capitalize">{selectedOrder.orderType}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Delivery Method:</span>
                                                    <span className="text-gray-900 capitalize">{selectedOrder.deliveryMethod}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-green-100 rounded-lg p-5 border border-green-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-700">Subtotal:</span>
                                                    <span className="text-gray-900 font-medium">
                                                        {formatCurrency(selectedOrder.totalAmount)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-700">Order Status:</span>
                                                    {getStatusBadge(selectedOrder.orderStatus)}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-700">Payment Status:</span>
                                                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                                                </div>
                                                <div className="pt-4 border-t border-blue-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                                                        <span className="text-2xl font-bold text-blue-600">
                                                            {formatCurrency(selectedOrder.totalAmount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-green-100 rounded-lg p-5 border border-green-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Notes</h3>
                                            <div className="bg-white rounded p-4 border border-yellow-100">
                                                <p className="text-gray-700">
                                                    {selectedOrder.notes || "No special instructions provided."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Ordered Products</h3>
                                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Product
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Quantity
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Unit Price
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Total Price
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedOrder.products?.map((product, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900">
                                                                {product.productName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {product.productId?.slice(-6) || 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-medium">
                                                                {product.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900">
                                                            {formatCurrency(product.unitPrice)}
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-gray-900">
                                                            {formatCurrency(product.totalPrice)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50">
                                                <tr>
                                                    <td colSpan="3" className="px-6 py-4 text-right font-bold text-gray-700">
                                                        Grand Total:
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-xl text-blue-600">
                                                        {formatCurrency(selectedOrder.totalAmount)}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Last updated: {selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : 'Never'}
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                                        disabled={updatingStatus}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={updatingStatus}
                                        className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {updatingStatus ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <FiEdit className="mr-2" />
                                                Update Status
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllOrders;