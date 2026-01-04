import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link, useLocation } from "react-router";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiShoppingCart, FiClock, FiMapPin } from "react-icons/fi";

const AllProducts = () => {
    const axiosSecure = UseAxiosSecure();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("search") || "";

    useEffect(() => {
        setLoading(true);
        axiosSecure.get("/foods").then((res) => {
            setFoods(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [axiosSecure]);

    
    const filteredFoods = foods.filter((food) =>
        food.food_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.restaurant_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    
    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFoods = filteredFoods.slice(indexOfFirstItem, indexOfLastItem);

    const getRatingStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar
                key={i}
                className={`text-sm ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
        ));
    };

    const getShortDescription = (text = "") => {
        if (!text) return "";
        const words = text.split(" ");
        return words.slice(0, 10).join(" ") + (words.length > 10 ? "..." : "");
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

   
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
         
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);
            
            if (currentPage <= 3) {
                endPage = maxPagesToShow;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - maxPagesToShow + 1;
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
        }
        
        return pageNumbers;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading delicious foods...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : "All Delicious Foods"}
                    </h1>
                    <p className="text-gray-600">
                        {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'} found
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                </div>

                {filteredFoods.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                            <FiShoppingCart className="w-full h-full" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Foods Found</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {searchQuery 
                                ? `No foods found matching "${searchQuery}". Try searching for something else.`
                                : "No foods available at the moment."}
                        </p>
                        {searchQuery && (
                            <Link 
                                to="/AllProducts" 
                                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                View All Foods
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                            {currentFoods.map((food) => {
                                const rating = food?.rating || 4.5;
                                return (
                                    <div
                                        key={food._id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group transform hover:-translate-y-1"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={food?.photo || "https://via.placeholder.com/400x300?text=Food"}
                                                alt={food?.food_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/400x300?text=Food+Image";
                                                }}
                                            />
                                            
                                           
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                                    {food?.category || "Food"}
                                                </span>
                                            </div>
                                            
                                           
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                    {food?.price}
                                                </span>
                                            </div>
                                            
                                          
                                            {!food?.available && (
                                                <div className="absolute bottom-3 left-3">
                                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
                                                {food?.name || food?.food_name}
                                            </h3>

                                           
                                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                                                <FiMapPin className="text-gray-400" />
                                                <span className="line-clamp-1">{food?.restaurant_name} • {food?.restaurant_location}</span>
                                            </div>

                                          
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {getShortDescription(food?.description)}
                                            </p>

                                            
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {getRatingStars(rating)}
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-semibold">
                                                        {rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                    <FiClock className="text-gray-400" />
                                                    <span>{food?.preparation_time}</span>
                                                </div>
                                            </div>

                                            
                                            <Link
                                                to={`/ProductsDetails/${food._id}`}
                                                className="block w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-center py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    
                                    <div className="text-gray-600">
                                        Showing <span className="font-semibold text-gray-900">{indexOfFirstItem + 1}</span> to{" "}
                                        <span className="font-semibold text-gray-900">
                                            {Math.min(indexOfLastItem, filteredFoods.length)}
                                        </span> of{" "}
                                        <span className="font-semibold text-gray-900">{filteredFoods.length}</span> items
                                    </div>

                                    
                                    <div className="flex items-center gap-2">
                                        
                                        
                                        <button
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            title="Previous Page"
                                        >
                                            <FaChevronLeft className="w-4 h-4" />
                                        </button>

                                        
                                        <div className="flex items-center gap-1">
                                            {getPageNumbers().map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => goToPage(pageNum)}
                                                    className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
                                                        currentPage === pageNum
                                                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md"
                                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            ))}
                                        </div>

                                       
                                        <button
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                            title="Next Page"
                                        >
                                            <FaChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Page Selector */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Go to:</span>
                                        <select
                                            value={currentPage}
                                            onChange={(e) => goToPage(Number(e.target.value))}
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            {[...Array(totalPages)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    Page {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AllProducts;