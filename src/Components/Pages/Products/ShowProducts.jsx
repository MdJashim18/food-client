import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { Link } from "react-router";
import { FaStar, FaEye } from "react-icons/fa";
import { FiClock, FiMapPin, FiShoppingBag } from "react-icons/fi";

const ShowProducts = () => {
  const axiosSecure = UseAxiosSecure();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOption, setSortOption] = useState("latest"); 

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    axiosSecure.get("/foods")
      .then((res) => {
        setFoods(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [axiosSecure]);

  useEffect(() => {
    let filtered = [...foods];

    
    if (searchQuery) {
      filtered = filtered.filter(food =>
        food.food_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    
    if (categoryFilter) {
      filtered = filtered.filter(food => food.category === categoryFilter);
    }

   
    filtered = filtered.filter(food =>
      food.price >= priceFilter[0] && food.price <= priceFilter[1]
    );

    
    if (ratingFilter > 0) {
      filtered = filtered.filter(food =>
        food.rating >= ratingFilter 
      );
    }

    
    if (sortOption === "priceLow") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHigh") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredFoods(filtered);
    setCurrentPage(1); 
  }, [foods, searchQuery, categoryFilter, priceFilter, ratingFilter, sortOption]);

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
    return words.slice(0, 8).join(" ") + (words.length > 8 ? "..." : "");
  };

  const paginatedFoods = filteredFoods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading delicious foods...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search foods..."
            className="px-4 py-2 rounded-xl border w-full md:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="px-4 py-2 rounded-xl border"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {Array.from(new Set(foods.map(f => f.category))).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 rounded-xl border"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
          >
            <option value={0}>All Ratings</option>
            <option value={1}>1 Stars</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>

          <select
            className="px-4 py-2 rounded-xl border"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {paginatedFoods.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No foods found.</p>
          )}
          {paginatedFoods.map((food) => {
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      to={`/ProductsDetails/${food._id}`}
                      className="bg-white text-indigo-600 p-3 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg"
                      title="Quick View"
                    >
                      <FaEye size={20} />
                    </Link>
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
                    {food?.food_name}
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
                      <span>{food?.preparation_time || "20 min"}</span>
                    </div>
                  </div>
                  <Link
                    to={`/ProductsDetails/${food._id}`}
                    className="block w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-center py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mb-12">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ShowProducts;
