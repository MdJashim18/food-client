import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FiShoppingCart, FiTrash2, FiCheckCircle, FiXCircle, FiPackage, FiDollarSign, FiCalendar, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";

const Cards = () => {
  const axiosSecure = UseAxiosSecure();
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    mobile: "",
    address: "",
    notes: ""
  });

  
  useEffect(() => {
    if (!user?.email) return;

    const fetchCards = async () => {
      try {
        const res = await axiosSecure.get(`/cards?email=${user.email}`);
        setCards(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCards();
  }, [user]);

  
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Remove Item?",
      text: "This item will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      background: '#fff',
      color: '#1f2937'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/cards/${id}`);
          if (res.data.deletedCount > 0) {
            setCards(cards.filter((item) => item._id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Item Removed',
              text: 'Item has been removed from your cart',
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
            title: 'Remove Failed',
            text: 'Please try again',
            confirmButtonColor: '#ef4444',
          });
        }
      }
    });
  };

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  
  const handleCreateOrder = async () => {
    if (!user || cards.length === 0) return;

    const unpaidCards = cards.filter((c) => c.status !== "paid");
    const totalAmount = unpaidCards.reduce(
      (total, c) => total + Number(c.totalAmount || 0),
      0
    );

    if (totalAmount <= 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Items to Order',
        text: 'All items in your cart are already paid.',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

  
    setShowCheckoutForm(true);
  };

 
  const handleSubmitOrder = async () => {
    if (!user || cards.length === 0) return;
    
    setOrdering(true);

    const unpaidCards = cards.filter((c) => c.status !== "paid");
    const totalAmount = unpaidCards.reduce(
      (total, c) => total + Number(c.totalAmount || 0),
      0
    );

   
    if (!formData.mobile.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Mobile Number Required',
        text: 'Please enter your mobile number',
        confirmButtonColor: '#6366f1',
      });
      setOrdering(false);
      return;
    }

    if (!formData.address.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Address Required',
        text: 'Please enter your delivery address',
        confirmButtonColor: '#6366f1',
      });
      setOrdering(false);
      return;
    }

    try {
      const productsArray = unpaidCards.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.totalAmount / item.quantity,
        totalPrice: item.totalAmount,
        addedAt: item.addedAt,
        status: "ordered"
      }));

      const orderData = {
        email: user.email,
        userName: user.displayName || "Customer",
        mobile: formData.mobile,
        address: formData.address,
        products: productsArray,
        totalAmount: totalAmount,
        date: new Date().toISOString(),
        orderStatus: "pending",
        paymentStatus: "cash_on_delivery",
        orderType: "online",
        deliveryMethod: "standard",
        notes: formData.notes || "",
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      };

     
      const orderRes = await axiosSecure.post("/orders", orderData);

      if (orderRes.data.insertedId) {
        const updatePromises = unpaidCards.map(async (item) => {
          await axiosSecure.patch(`/cards/${item._id}`, {
            status: "ordered",
            orderId: orderRes.data.insertedId,
            orderedAt: new Date().toISOString()
          });
        });

        await Promise.all(updatePromises);

        
        const updatedCards = cards.map(card => 
          unpaidCards.some(uc => uc._id === card._id) 
            ? { ...card, status: "ordered", orderId: orderRes.data.insertedId }
            : card
        );
        setCards(updatedCards);

        
        Swal.fire({
          icon: 'success',
          title: 'Order Placed Successfully!',
          html: `
            <div class="text-left">
              <p><strong>Order ID:</strong> ${orderRes.data.insertedId}</p>
              <p><strong>Total Amount:</strong> ${totalAmount}</p>
              <p><strong>Delivery Address:</strong> ${formData.address}</p>
              <p><strong>Mobile:</strong> ${formData.mobile}</p>
              <p class="mt-3">Your order will be delivered within 24 hours.</p>
            </div>
          `,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'OK'
        });

        
        setFormData({
          mobile: "",
          address: "",
          notes: ""
        });
        setShowCheckoutForm(false);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: 'Please try again',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setOrdering(false);
    }
  };

 
  const unpaidCards = cards.filter((c) => c.status !== "paid");
  const paidCards = cards.filter((c) => c.status === "paid");
  const orderedCards = cards.filter((c) => c.status === "ordered");
  const totalAmount = unpaidCards.reduce(
    (total, c) => total + Number(c.totalAmount || 0),
    0
  );
  const itemCount = unpaidCards.reduce(
    (count, c) => count + Number(c.quantity || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
      
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <FiShoppingCart className="text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Shopping Cart</h1>
              <p className="text-gray-600">Manage your items before checkout</p>
            </div>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <FiShoppingCart className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <a 
              href="/AllProducts" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Browse Foods
            </a>
          </div>
        ) : (
          <>
           
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900">{itemCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <FiPackage className="text-blue-600 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Unpaid Items</p>
                    <p className="text-3xl font-bold text-gray-900">{unpaidCards.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center justify-center">
                    <FiShoppingCart className="text-yellow-600 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-3xl font-bold text-gray-900">{totalAmount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <FiDollarSign className="text-green-600 text-xl" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Ordered Items</p>
                    <p className="text-3xl font-bold text-gray-900">{orderedCards.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <FiCheckCircle className="text-purple-600 text-xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Cart Items ({cards.length})</h2>
                <p className="text-gray-600 text-sm">All items in your shopping cart</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-white">
                    <tr>
                      <th className="text-left p-4 text-gray-700 font-semibold">Product</th>
                      <th className="text-left p-4 text-gray-700 font-semibold">Quantity</th>
                      <th className="text-left p-4 text-gray-700 font-semibold">Unit Price</th>
                      <th className="text-left p-4 text-gray-700 font-semibold">Total</th>
                      <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                      <th className="text-left p-4 text-gray-700 font-semibold">Date Added</th>
                      <th className="text-left p-4 text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((item, index) => (
                      <tr 
                        key={item._id} 
                        className={`border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                          item.status === "paid" ? "bg-green-50/30" : 
                          item.status === "ordered" ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center">
                                <FiPackage className="text-gray-400" />
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{item.productName}</p>
                              <p className="text-sm text-gray-500">Product ID: {item.productId?.slice(-6) || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <span className="px-3 py-1 bg-gray-50 text-gray-800 font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-900 font-semibold">
                            {(item.totalAmount / item.quantity).toFixed(2)}
                          </p>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-900 font-bold">
                            {item.totalAmount}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === "paid" 
                              ? "bg-green-100 text-green-800" 
                              : item.status === "ordered"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {item.status === "paid" || item.status === "ordered" ? (
                              <FiCheckCircle className="text-sm" />
                            ) : (
                              <FiXCircle className="text-sm" />
                            )}
                            <span>{item.status || "unpaid"}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiCalendar className="text-gray-400" />
                            <span>{new Date(item.addedAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {item.status !== "paid" && item.status !== "ordered" && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 hover:text-red-700 rounded-lg font-medium transition-all duration-300"
                            >
                              <FiTrash2 />
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

           
            {unpaidCards.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                        <span className="font-semibold text-gray-900">{totalAmount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total Amount</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {totalAmount}
                        </span>
                      </div>
                    </div>

                   
                    <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FaShippingFast className="text-blue-600 text-xl" />
                        <div>
                          <p className="font-semibold text-gray-800">Free Delivery</p>
                          <p className="text-sm text-gray-600">Order above ৳300 | Delivery in 30-45 mins</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-96">
                    {!showCheckoutForm ? (
                      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Your Order</h3>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <FiCheckCircle className="text-green-600 text-xl" />
                            <div>
                              <p className="font-semibold text-gray-800">Cash on Delivery</p>
                              <p className="text-sm text-gray-600">Pay when you receive your order</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <FaShippingFast className="text-indigo-600 text-xl" />
                            <div>
                              <p className="font-semibold text-gray-800">Fast Delivery</p>
                              <p className="text-sm text-gray-600">Delivery within 24 hours</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleCreateOrder}
                          className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <FiShoppingCart />
                          Proceed to Checkout
                        </button>
                        
                        <p className="text-center text-gray-500 text-sm mt-4">
                          You'll provide shipping details in the next step
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Details</h3>
                        
                        <div className="space-y-4">
                        
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 mb-4">
                            <FiUser className="text-indigo-600" />
                            <div>
                              <p className="font-semibold text-gray-800">{user.displayName || "Customer"}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>

                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute left-3 top-3 text-gray-400">
                                <FiPhone />
                              </div>
                              <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="01XXXXXXXXX"
                                required
                              />
                            </div>
                          </div>

                         
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Delivery Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute left-3 top-3 text-gray-400">
                                <FiMapPin />
                              </div>
                              <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows="3"
                                placeholder="House #, Road #, Area, City"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Additional Notes (Optional)
                            </label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              rows="2"
                              placeholder="Delivery instructions, special requests, etc."
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setShowCheckoutForm(false)}
                            className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300"
                          >
                            Cancel
                          </button>
                          
                          <button
                            onClick={handleSubmitOrder}
                            disabled={ordering}
                            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                              ordering
                                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                            }`}
                          >
                            {ordering ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                              </>
                            ) : (
                              'Place Order'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            
            {(paidCards.length > 0 || orderedCards.length > 0) && (
              <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...paidCards, ...orderedCards].slice(0, 6).map((item) => (
                    <div key={item._id} className="border border-gray-100 rounded-xl p-5 hover:border-green-200 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">Order #{(item.orderId || item._id || "").slice(-8)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "paid" 
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {item.status === "paid" ? "Paid" : "Ordered"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Qty: {item.quantity}</span>
                        <span>{item.totalAmount}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cards;