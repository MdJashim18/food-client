import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { 
  FiArrowLeft, 
  FiStar, 
  FiShoppingCart, 
  FiClock, 
  FiCheckCircle,
  FiMapPin,
  FiTag,
  FiShare2,
  FiHeart
} from "react-icons/fi";
import { 
  TbTruckDelivery, 
  TbLeaf 
} from "react-icons/tb";
import { 
  MdLocalOffer, 
  MdSecurity,
  MdOutlineRestaurantMenu 
} from "react-icons/md";
import { FaFireAlt, FaRegCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";
import useAuth from "../../../Hooks/useAuth";

const ProductsDetails = () => {
  const { id } = useParams();
  const axiosSecure = UseAxiosSecure();
  const { currentUser } = useContext(AuthContext);
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sideProducts, setSideProducts] = useState([]); 


  const [productImages, setProductImages] = useState([
    "https://via.placeholder.com/600x400?text=Loading...",
    "https://images.unsplash.com/photo-1621996346565-e3dbc353d2c5?auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600",
    "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600"
  ]);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/foods/${id}`)
      .then((res) => {
        const productData = res.data || null;
        setProduct(productData);
        
        if (productData && productData.photo) {
          const updatedImages = [
            productData.photo, 
            "https://i.ibb.co.com/VnJKd8Z/Salads.jpg",
            "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=600"
          ];
          setProductImages(updatedImages);
        }
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, axiosSecure]);
  
  useEffect(()=>{
    setLoading(true);
    axiosSecure
      .get(`/foods`)
      .then((res) => {
        const productsData = res.data || [];
        const filteredProducts = productsData.filter(item => item._id !== id);
        
        setSideProducts(filteredProducts.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setSideProducts([]);
        setLoading(false);
      });
  },[axiosSecure, id]);

  const handleAddToCart = async () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add items to your cart',
        showCancelButton: true,
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#6366f1',
        cancelButtonColor: '#6b7280',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }

    const cartItem = {
      userName: user.displayName,
      userEmail: user.email,
      productId: product._id,
      productName: product.food_name,
      quantity: quantity,
      totalAmount: product.price * quantity,
      addedAt: new Date().toISOString(),
      status: "unpaid",
    };

    try {
      const res = await axiosSecure.post("/cards", cartItem);

      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart!',
          text: `${product.food_name} has been added to your cart`,
          showConfirmButton: false,
          timer: 1500,
          background: 'indigo-600',
          color: 'white',
          iconColor: 'white'
        });
        setAddedToCart(true);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add',
        text: 'Please try again',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.food_name,
        text: `Check out ${product.food_name} on Food Lovers!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'Product link copied to clipboard',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin animation-delay-500"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading delicious details...</p>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 rounded-2xl bg-white shadow-xl max-w-md">
          <div className="w-24 h-24 mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">This delicious item seems to be unavailable right now.</p>
          <Link to="/AllProducts" className="btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold">
            Browse Other Foods
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-white transition-all duration-300"
          >
            <FiArrowLeft className="text-lg" />
            Back to Menu
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white hover:bg-gray-50 shadow-sm transition-all duration-300"
              title="Share"
            >
              <FiShare2 className="text-gray-600" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full shadow-sm transition-all duration-300 ${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

       
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            
            <div className="relative p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={productImages[selectedImage]}
                  alt={product.food_name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    
                    e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                  }}
                />
               
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <FaFireAlt /> Popular
                  </span>
                </div>
                
                
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <FiStar className="fill-current" /> {product.rating}
                  </span>
                </div>
              </div>
              
              
              <div className="flex gap-3 mt-6">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-1 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.food_name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        
                        e.target.src = "https://via.placeholder.com/150x100?text=Thumbnail";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            
            <div className="p-8 lg:p-10">
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <FiTag /> {product.category || "Pasta"}
                </span>
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <TbLeaf /> Fresh Ingredients
                </span>
                <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <TbTruckDelivery /> Free Delivery
                </span>
              </div>

             
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                {product.food_name}
              </h1>

              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <MdOutlineRestaurantMenu className="text-indigo-600 text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{product.restaurant_name}</h3>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiMapPin /> {product.restaurant_location}
                  </div>
                </div>
              </div>

             
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          className={`text-2xl ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{product.rating}</span>
                      <span className="text-gray-500">/5.0</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-green-600 font-semibold flex items-center gap-1">
                  <FiCheckCircle /> 95% of customers recommend this
                </div>
              </div>

              
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {product.price}TK
                  </span>
                  <span className="text-gray-400 line-through text-xl">{product.price + 80}</span>
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Save 80TK
                  </span>
                </div>
                <p className="text-gray-600">Price includes all taxes</p>
              </div>

              
              <div className="grid grid-cols-1 gap-3 mb-8">
                <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                  <FiClock className="text-indigo-600 text-xl" />
                  <div>
                    <p className="font-semibold text-gray-800">{product.preparation_time}</p>
                    <p className="text-sm text-gray-600">Prep Time</p>
                  </div>
                </div>
              </div>

              
              <div className="mb-8">
                <label className="block text-gray-700 font-semibold mb-3">Select Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 text-xl font-bold text-gray-800 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-gray-700">
                    <p className="font-semibold">Total: <span className="text-2xl text-indigo-600">{product.price * quantity}TK</span></p>
                  </div>
                </div>
              </div>

             
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available || addedToCart}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    addedToCart
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed'
                      : product.available
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiShoppingCart className="text-xl" />
                  {addedToCart ? `✓ Added (${quantity})` : product.available ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MdSecurity className="text-green-500 text-xl" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-blue-500 text-xl" />
                    <span className="text-sm">Quality Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TbTruckDelivery className="text-orange-500 text-xl" />
                    <span className="text-sm">30-min Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Product Description</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="leading-relaxed mb-6">{product.description}</p>
              
             
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl mb-6">
                <h3 className="font-bold text-xl text-gray-800 mb-4">What Makes It Special</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCheckCircle className="text-green-600" />
                    </div>
                    <span>Freshly prepared with premium ingredients</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiCheckCircle className="text-blue-600" />
                    </div>
                    <span>Perfectly balanced flavors and textures</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <FiCheckCircle className="text-purple-600" />
                    </div>
                    <span>Made to order for maximum freshness</span>
                  </li>
                </ul>
              </div>
              
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h3 className="font-bold text-xl text-gray-800 mb-4">Nutritional Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-xl font-bold text-gray-900">650</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-xl font-bold text-gray-900">42g</p>
                    <p className="text-xs text-gray-500">High</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-xl font-bold text-gray-900">55g</p>
                    <p className="text-xs text-gray-500">Moderate</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-xl font-bold text-gray-900">28g</p>
                    <p className="text-xs text-gray-500">Low</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="space-y-8">
            
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Share Your Experience</h3>
              <p className="mb-6 opacity-90">Tell others what you think about this delicious dish!</p>
              <Link 
                to={`/ProductsReviews/${id}`} 
                className="inline-block w-full bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl text-center transition-all duration-300 transform hover:-translate-y-1"
              >
                Write a Review
              </Link>
            </div>

           
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
              
              {product.review?.comments?.length > 0 ? (
                <div className="space-y-6">
                  {product.review.comments.slice(0, 3).map((c, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-indigo-100 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {c.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{c.userName || 'Anonymous'}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, starIdx) => (
                              <FiStar 
                                key={starIdx} 
                                className={`text-sm ${starIdx < c.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 line-clamp-3">{c.comment}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(c.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  ))}
                  
                  {product.review.comments.length > 3 && (
                    <Link 
                      to={`/ProductsReviews/${id}`} 
                      className="block text-center text-indigo-600 font-semibold hover:text-indigo-700 pt-4 border-t border-gray-100"
                    >
                      View All {product.review.comments.length} Reviews →
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>

            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <TbTruckDelivery className="text-green-600 text-2xl" />
                  <div>
                    <p className="font-semibold text-gray-800">Free Delivery</p>
                    <p className="text-sm text-gray-600">On orders above 300</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <FiClock className="text-blue-600 text-2xl" />
                  <div>
                    <p className="font-semibold text-gray-800">Estimated Time</p>
                    <p className="text-sm text-gray-600">20-30 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sideProducts.length > 0 ? (
              sideProducts.map((item) => (
                <div key={item._id || item.id || Math.random()} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.photo || "https://via.placeholder.com/400x300?text=Food+Image"} 
                      alt={item.food_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-gray-800 mb-2">{item.food_name || "Food Item"}</h4>
                    <p className="text-gray-600 text-sm mb-3">{item.category || "Delicious Food"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-indigo-600">{item.price || "0"}TK</span>
                      <Link to={`/ProductsDetails/${item._id || item.id}`} className="text-sm text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors duration-300">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600">No other products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;