import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { FiEye, FiTrash2, FiEdit, FiStar, FiSearch, FiFilter } from "react-icons/fi";
import { MdRestaurant, MdLocationOn, MdEmail, MdPerson } from "react-icons/md";
import Swal from "sweetalert2";
import { FaStar } from "react-icons/fa";

const SeeAllReviews = () => {
  const axiosSecure = UseAxiosSecure();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/review");
      const sortedReviews = res.data.sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time)
      );
      setReviews(sortedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      Swal.fire("Error!", "Failed to load reviews.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let queryParams = [];
      if (searchTerm) queryParams.push(`search=${searchTerm}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await axiosSecure.get(`/reviews${queryString}`);
      const sortedReviews = res.data.sort(
        (a, b) => new Date(b.date_time) - new Date(a.date_time)
      );
      setReviews(sortedReviews);
    } catch (error) {
      console.error("Error searching reviews:", error);
      Swal.fire("Error!", "Failed to search reviews.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (review) => {
    Swal.fire({
      title: "Review Details",
      html: `
        <div class="text-left space-y-3">
          <div class="flex items-start">
            <strong class="w-32 flex-shrink-0">Product:</strong>
            <span>${review.food_name}</span>
          </div>
          <div class="flex items-start">
            <strong class="w-32 flex-shrink-0">Restaurant:</strong>
            <span>${review.restaurant_name}</span>
          </div>
          <div class="flex items-start">
            <strong class="w-32 flex-shrink-0">Location:</strong>
            <span>${review.location}</span>
          </div>
          <div class="flex items-start">
            <strong class="w-32 flex-shrink-0">Reviewer:</strong>
            <div>
              <div>${review.userName}</div>
              <div class="text-sm text-gray-600">${review.email}</div>
            </div>
          </div>
          <div class="flex items-center">
            <strong class="w-32 flex-shrink-0">Rating:</strong>
            <div class="flex items-center text-yellow-500">
              ${Array.from({ length: 5 }, (_, i) =>
        i < review.star_rating
          ? '<span class="text-xl">★</span>'
          : '<span class="text-xl text-gray-300">★</span>'
      ).join('')}
              <span class="ml-2 text-gray-700">(${review.star_rating}/5)</span>
            </div>
          </div>
          <div class="flex items-start">
            <strong class="w-32 flex-shrink-0">Review:</strong>
            <span class="italic">"${review.review_text}"</span>
          </div>
          <div class="flex items-start">
            <strong class="w-32 flex-shrink-0">Date:</strong>
            <span>${review.date_time}</span>
          </div>
        </div>
      `,
      width: 600,
      showCloseButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#3b82f6",
    });
  };

  const handleDelete = async (reviewId) => {

    try {
      await axiosSecure.delete(`/review/${reviewId}`);
      Swal.fire({
        title: "Deleted!",
        text: "Review has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      Swal.fire("Error!", "Failed to delete review.", "error");
    }

  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-lg ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            <FaStar></FaStar>
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all customer feedback and ratings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-800">{reviews.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiStar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>


          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">5 Star Reviews</p>
                <p className="text-3xl font-bold text-gray-800">
                  {reviews.filter(r => r.star_rating === 5).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiStar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unique Products</p>
                <p className="text-3xl font-bold text-gray-800">
                  {[...new Set(reviews.map(r => r.food_name))].length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <MdRestaurant className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center gap-4">
            <div className="w-[80%]">
              
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter food name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            

            <div className="flex items-end space-x-4 w-[20%]">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiSearch className="mr-2" />
                Search
              </button>
              
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <FiStar className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg">No reviews found</p>
                        <p className="text-sm">Reviews will appear here when customers submit them</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reviews.map((review, index) => (
                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-start">
                          
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.food_name}
                            </div>
                           
                          </div>
                        </div>
                      </td>
                      <td className=" py-4">
                        <div className="font-medium text-gray-900">
                          <div className="flex items-center">
                            {review.userName}
                          </div>
                        </div>
                        
                      </td>
                      <td className="px-6 py-4">
                        {renderStars(review.star_rating)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-gray-900 line-clamp-2">
                            "{review.review_text}"
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(review.date_time).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.date_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleView(review)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            title="View Details"
                          >
                            <FiEye className="mr-2" />
                            View
                          </button>
                         
                          <button
                            onClick={() => handleDelete(review._id, review.food_name)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                            title="Delete Review"
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

          {reviews.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{reviews.length}</span> of{" "}
                  <span className="font-medium">{reviews.length}</span> reviews
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-gray-100">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
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

export default SeeAllReviews;