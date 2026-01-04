import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { FiStar, FiChevronLeft, FiUser, FiMail, FiMessageSquare, FiCalendar } from "react-icons/fi";
import { FaHamburger, FaUtensils, FaMapMarkerAlt } from "react-icons/fa";

const ProductsReviews = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reviewCard, setReviewCard] = useState([]);
    const [productReviews, setProductReviews] = useState([]); 

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        setLoading(true);
        axiosSecure.get(`/foods/${id}`)
            .then((res) => {
                setProduct(res.data);
                reset({
                    productName: res.data?.food_name || "",
                    userName: "",
                    userEmail: "",
                    rating: "",
                    comment: "",
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, axiosSecure, reset]);

    useEffect(() => {
        if (product) {
            axiosSecure.get('/review')
                .then((res) => {
                    const reviewData = res.data || [];
                    const filteredReviews = reviewData.filter(item => 
                        item.food_name === product.food_name
                    );
                    setProductReviews(filteredReviews);
                    
                    const fiveStarReviews = filteredReviews
                        .filter(item => item.star_rating === 5)
                        .slice(0, 2);
                    setReviewCard(fiveStarReviews);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }, [product, axiosSecure]);

    const onSubmit = async (data) => {
        if (!product) return;

        setSubmitting(true);

        const newReview = {
            userName: data.userName,
            userEmail: data.userEmail,
            rating: Number(data.rating),
            comment: data.comment,
            date: new Date().toISOString(),
        };

        try {
            const reviewData = {
                userName: data.userName,
                food_name: product.food_name,
                food_image: product.photo,
                restaurant_name: product.restaurant_name,
                location: product.restaurant_location,
                star_rating: Number(data.rating),
                review_text: data.comment,
                email: data.userEmail,
                date_time: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            };


            const reviewRes = await axiosSecure.post("/review", reviewData);


            const updatedComments = [...(product.review?.comments || []), newReview];
            const updatedReviewObj = {
                count: updatedComments.length,
                average: updatedComments.reduce((sum, r) => sum + r.rating, 0) / updatedComments.length,
                comments: updatedComments,
            };

            const res = await axiosSecure.patch(`/foods/${id}`, { review: updatedReviewObj });

            if (res.data.modifiedCount > 0 && reviewRes.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Review Submitted!',
                    text: 'Thank you for sharing your experience!',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#10b981',
                    color: 'white',
                    iconColor: 'white'
                });


                setProduct((prev) => ({
                    ...prev,
                    review: updatedReviewObj,
                }));

              
                setProductReviews(prev => [reviewData, ...prev]);
                if (Number(data.rating) === 5) {
                    setReviewCard(prev => [reviewData, ...prev].slice(0, 2));
                }

                reset({
                    productName: product.food_name,
                    userName: "",
                    userEmail: "",
                    rating: "",
                    comment: "",
                });

                setTimeout(() => {
                    navigate(`/ProductsDetails/${id}`);
                }, 2000);
            }
        } catch (err) {
            console.error("Failed to add review:", err);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Please try again later.',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                className={`text-lg ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };


    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };


    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading review form...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center p-8 rounded-2xl bg-white shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">Unable to load product details.</p>
                    <Link to="/AllProducts" className="btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold">
                        Browse Foods
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">

               
                <div className="mb-8">
                    <Link
                        to={`/ProductsDetails/${id}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-white transition-all duration-300"
                    >
                        <FiChevronLeft className="text-lg" />
                        Back to Product
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                   
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            Product Information
                        </h2>

                       
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                <img
                                    src={product.photo || "https://via.placeholder.com/300x300?text=Food"}
                                    alt={product.food_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{product.food_name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStars(product.rating || 0)}
                                    <span className="text-gray-600">({product.rating || 0}/5)</span>
                                </div>
                            </div>
                        </div>

                       
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                                <FaUtensils className="text-indigo-600 text-xl" />
                                <div>
                                    <p className="font-semibold text-gray-800">Restaurant</p>
                                    <p className="text-gray-600">{product.restaurant_name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                <FaMapMarkerAlt className="text-green-600 text-xl" />
                                <div>
                                    <p className="font-semibold text-gray-800">Location</p>
                                    <p className="text-gray-600">{product.restaurant_location}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                                <FiCalendar className="text-blue-600 text-xl" />
                                <div>
                                    <p className="font-semibold text-gray-800">Preparation Time</p>
                                    <p className="text-gray-600">{product.preparation_time}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-semibold">Price</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {product.price}TK
                                </span>
                            </div>
                        </div>
                    </div>

                   
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Share Your Experience
                            </h1>
                            <p className="text-gray-600">
                                Your feedback helps others make better choices
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                           
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Product Name
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FaHamburger />
                                    </div>
                                    <input
                                        {...register("productName")}
                                        value={product.food_name}
                                        className="w-full border border-gray-200 p-3 pl-10 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FiUser />
                                    </div>
                                    <input
                                        {...register("userName", {
                                            required: "Name is required",
                                            minLength: {
                                                value: 2,
                                                message: "Name must be at least 2 characters"
                                            }
                                        })}
                                        className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        type="text"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.userName && (
                                    <p className="mt-2 text-red-500 text-sm">{errors.userName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FiMail />
                                    </div>
                                    <input
                                        {...register("userEmail", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        type="email"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                {errors.userEmail && (
                                    <p className="mt-2 text-red-500 text-sm">{errors.userEmail.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Your Rating <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FiStar />
                                    </div>
                                    <select
                                        {...register("rating", {
                                            required: "Please select a rating",
                                            validate: value => value !== "" || "Rating is required"
                                        })}
                                        className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                    >
                                        <option value="">Select your rating</option>
                                        <option value="5">Excellent (5)</option>
                                        <option value="4">Very Good (4)</option>
                                        <option value="3">Good (3)</option>
                                        <option value="2">Fair (2)</option>
                                        <option value="1">Poor (1)</option>
                                    </select>
                                </div>
                                {errors.rating && (
                                    <p className="mt-2 text-red-500 text-sm">{errors.rating.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Your Review <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <FiMessageSquare />
                                    </div>
                                    <textarea
                                        {...register("comment", {
                                            required: "Please write your review",
                                            minLength: {
                                                value: 10,
                                                message: "Review must be at least 10 characters"
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: "Review cannot exceed 500 characters"
                                            }
                                        })}
                                        className="w-full border border-gray-200 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        rows={5}
                                        placeholder="Share your experience with this food... What did you like? What could be improved?"
                                    />
                                </div>
                                {errors.comment && (
                                    <p className="mt-2 text-red-500 text-sm">{errors.comment.message}</p>
                                )}
                                <div className="mt-2 text-sm text-gray-500">
                                    Share your honest opinion to help other customers
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${submitting
                                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>

                            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                                <h4 className="font-semibold text-gray-800 mb-2">Review Guidelines</h4>
                                <ul className="text-sm text-gray-600 space-y-1" >
                                    <li>Be honest and specific about your experience</li>
                                    <li>Focus on the food quality, taste, and presentation</li>
                                    <li>Mention service and delivery experience if applicable</li>
                                    <li>Avoid personal attacks or offensive language</li>
                                    <li>Your review will help other customers make decisions</li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Recent Reviews for {product.food_name}
                        </h2>
                        {productReviews.length > 0 && (
                            <span className="text-gray-600">
                                {productReviews.length} reviews
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviewCard.length > 0 ? (
                            reviewCard.map((item, index) => (
                                <div key={index} className="p-6 border border-gray-100 rounded-2xl hover:border-indigo-100 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {getInitials(item.userName || item.email)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.userName || item.email?.split('@')[0] || 'Anonymous'}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                {renderStars(item.star_rating)}
                                                <span className="text-gray-500 text-sm ml-1">
                                                    ({item.star_rating}/5)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-3 line-clamp-3">
                                        "{item.review_text}"
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{getTimeAgo(item.date_time)}</span>
                                        {item.star_rating === 5 && (
                                            <span className="flex items-center gap-1 text-yellow-600">
                                                <FiStar className="fill-current" /> 5 Star Review
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="p-6 border border-gray-100 rounded-2xl">
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                                            <FiStar className="w-full h-full" />
                                        </div>
                                        <p className="text-gray-600">No 5-star reviews yet</p>
                                        <p className="text-gray-500 text-sm mt-1">Be the first to give 5 stars!</p>
                                    </div>
                                </div>
                                <div className="p-6 border border-gray-100 rounded-2xl">
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                                            <FiMessageSquare className="w-full h-full" />
                                        </div>
                                        <p className="text-gray-600">Share your experience</p>
                                        <p className="text-gray-500 text-sm mt-1">Your review helps others decide</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            to={`/ProductsDetails/${id}`}
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                            View All {productReviews.length} Reviews
                            <FiChevronLeft className="rotate-180" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsReviews;