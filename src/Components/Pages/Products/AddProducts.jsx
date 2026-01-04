import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import axios from "axios";
import { 
  FiUpload, 
  FiImage, 
  FiTag, 
  FiDollarSign, 
  FiStar, 
  FiClock, 
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiHome,
  FiInfo,
  FiPlus,
  FiSave,
  FiRefreshCw
} from "react-icons/fi";
import { FaHamburger } from "react-icons/fa";

const AddProducts = () => {
  const axiosSecure = UseAxiosSecure();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [preparationTimes, setPreparationTimes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  const availability = watch("available");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        
        const categoriesRes = await axiosSecure.get("/categories");
       
        setCategories(categoriesRes.data)
       
        const foodsRes = await axiosSecure.get("/foods");
        const times = [...new Set(foodsRes.data
            .map(food => food.preparation_time)
            .filter(time => time && time.trim() !== '')
          )];
        times.sort((a,b) => parseInt(a) - parseInt(b));
        setPreparationTimes(times);

      } catch (error) {
        console.error("Error fetching data:", error);
        
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, [axiosSecure]);
  console.log(categories)
  console.log(preparationTimes.sort())

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const refreshCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await axiosSecure.get("/categories");
      if (res.data && Array.isArray(res.data)) {
        const categoryNames = res.data.map(cat => cat.name).filter(name => name);
        setCategories(categoryNames);
        Swal.fire({
          icon: 'success',
          title: 'Categories Refreshed',
          text: `Loaded ${categoryNames.length} categories`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error refreshing categories:", error);
      Swal.fire({
        icon: 'error',
        title: 'Refresh Failed',
        text: 'Could not load categories',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const refreshPreparationTimes = async () => {
    try {
      const res = await axiosSecure.get("/foods");
      if (res.data && Array.isArray(res.data)) {
        const times = [...new Set(res.data
          .map(food => food.preparation_time)
          .filter(time => time && time.trim() !== '')
        )];
        
        if (times.length > 0) {
          setPreparationTimes(times.sort());
          Swal.fire({
            icon: 'success',
            title: 'Times Refreshed',
            text: `Loaded ${times.length} preparation times`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing preparation times:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      let imageURL = data.imageUrl || "";
      
      if (data.image && data.image[0]) {
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const imgBBurl = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMAGE_HOST
        }`;

        const imgRes = await axios.post(imgBBurl, formData);
        imageURL = imgRes.data.data.url;
      }

      const productData = {
        photo: imageURL,
        food_name: data.food_name,
        restaurant_name: data.restaurant_name,
        restaurant_location: data.restaurant_location,
        rating: Number(data.rating),
        price: Number(data.price),
        description: data.description,
        available: data.available === "true",
        preparation_time: data.preparation_time,
        category: data.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        review: {
          count: 0,
          average: 0,
          comments: [],
        },
        views: 0,
        orders: 0,
        featured: data.featured || false,
        ingredients: data.ingredients?.split(',').map(item => item.trim()) || []
      };

      const res = await axiosSecure.post("/foods", productData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Product Added Successfully!',
          html: `
            <div class="text-left">
              <p><strong>Product Name:</strong> ${data.food_name}</p>
              <p><strong>Category:</strong> ${data.category}</p>
              <p><strong>Price:</strong> ${data.price}</p>
              <p><strong>Available:</strong> ${data.available === "true" ? 'Yes' : 'No'}</p>
            </div>
          `,
          showConfirmButton: false,
          timer: 2000,
          background: '#10b981',
          color: 'white',
          iconColor: 'white'
        });
        reset();
        setPreviewImage(null);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Product',
        text: error.message || 'Please try again',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setUploading(false);
    }
  };

  

  const defaultTimeOptions = [
    "5 minutes", "10 minutes", "15 minutes", "20 minutes", 
    "25 minutes", "30 minutes", "35 minutes", "40 minutes", 
    "45 minutes", "50 minutes", "55 minutes", "1 hour"
  ];

  const timeOptions = preparationTimes.length > 0 ? preparationTimes : defaultTimeOptions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
       
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
              <FiPlus className="text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-gray-600">Add delicious food items to your menu</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaHamburger className="text-indigo-600" />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Food Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FaHamburger />
                      </div>
                      <input
                        {...register("food_name", { 
                          required: "Food name is required",
                          minLength: { value: 3, message: "Minimum 3 characters" }
                        })}
                        className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Chicken Alfredo Pasta"
                      />
                    </div>
                    {errors.food_name && (
                      <p className="mt-1 text-red-500 text-sm">{errors.food_name.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-700 font-semibold">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={refreshCategories}
                        disabled={loadingCategories}
                        className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      >
                        <FiRefreshCw className={`w-3 h-3 ${loadingCategories ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiTag />
                      </div>
                      {loadingCategories ? (
                        <div className="w-full border border-gray-300 p-3 pl-10 rounded-xl bg-gray-50 flex items-center">
                          <span className="text-gray-500">Loading categories...</span>
                        </div>
                      ) : (
                        <select
                          {...register("category", { required: "Category is required" })}
                          className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    {errors.category && (
                      <p className="mt-1 text-red-500 text-sm">{errors.category.message}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {categories.length} categories loaded from database
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiHome className="text-indigo-600" />
                  Restaurant Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Restaurant Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiHome />
                      </div>
                      <input
                        {...register("restaurant_name", { 
                          required: "Restaurant name is required"
                        })}
                        className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Food Lovers Cafe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiMapPin />
                      </div>
                      <input
                        {...register("restaurant_location", { 
                          required: "Location is required"
                        })}
                        className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Khulna, Bangladesh"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiDollarSign className="text-indigo-600" />
                  Pricing & Rating
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Price (BDT) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiDollarSign />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        {...register("price", { 
                          required: "Price is required",
                          min: { value: 1, message: "Price must be greater than 0" }
                        })}
                        className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., 480"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-red-500 text-sm">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiStar />
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        {...register("rating", { 
                          required: "Rating is required",
                          min: { value: 0, message: "Minimum 0" },
                          max: { value: 5, message: "Maximum 5" }
                        })}
                        className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., 4.7"
                      />
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-red-500 text-sm">{errors.rating.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-gray-700 font-semibold">
                        Prep Time <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={refreshPreparationTimes}
                        className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      >
                        <FiRefreshCw className="w-3 h-3" />
                        Refresh
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <FiClock />
                      </div>
                      <select
                        {...register("preparation_time", { required: "Preparation time is required" })}
                        className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Select Time</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {timeOptions.length} time options loaded
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiInfo className="text-indigo-600" />
                  Description
                </h2>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Food Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description", { 
                      required: "Description is required",
                      minLength: { value: 20, message: "Minimum 20 characters" }
                    })}
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="6"
                    placeholder="Describe your delicious food item in detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-red-500 text-sm">{errors.description.message}</p>
                  )}
                  
                </div>

                <div className="mt-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Key Ingredients (Optional)
                  </label>
                  <textarea
                    {...register("ingredients")}
                    className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter ingredients separated by commas, e.g., Chicken, Pasta, Cream, Cheese"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiImage className="text-indigo-600" />
                  Product Image
                </h2>
                
                <div className="mb-6">
                  <div className={`w-full h-48 rounded-xl overflow-hidden border-2 border-dashed ${previewImage ? 'border-gray-300' : 'border-gray-200'} flex items-center justify-center mb-4`}>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Image preview will appear here</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Upload Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        {...register("image", { 
                          required: "Image is required",
                          onChange: handleImageChange
                        })}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-colors duration-200"
                      >
                        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-600 font-medium">Click to upload</span>
                        <span className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</span>
                      </label>
                    </div>
                    {errors.image && (
                      <p className="mt-1 text-red-500 text-sm">{errors.image.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Or paste image URL
                  </label>
                  <input
                    type="text"
                    {...register("imageUrl")}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCheckCircle className="text-indigo-600" />
                  Status & Availability
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3">
                      Availability Status
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`cursor-pointer rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-200 ${availability === "true" ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          {...register("available")}
                          value="true"
                          className="hidden"
                        />
                        <div className="text-center">
                          <FiCheckCircle className={`w-6 h-6 mx-auto mb-1 ${availability === "true" ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`font-medium ${availability === "true" ? 'text-green-700' : 'text-gray-600'}`}>
                            Available
                          </span>
                        </div>
                      </label>
                      
                      <label className={`cursor-pointer rounded-xl p-4 border-2 flex items-center justify-center transition-all duration-200 ${availability === "false" ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          {...register("available")}
                          value="false"
                          className="hidden"
                        />
                        <div className="text-center">
                          <FiXCircle className={`w-6 h-6 mx-auto mb-1 ${availability === "false" ? 'text-red-600' : 'text-gray-400'}`} />
                          <span className={`font-medium ${availability === "false" ? 'text-red-700' : 'text-gray-600'}`}>
                            Out of Stock
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("featured")}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 font-medium">Mark as Featured Product</span>
                    </label>
                    <p className="text-gray-500 text-sm mt-2">
                      Featured products appear on the homepage
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    uploading
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <FiSave className="text-xl" />
                      Add Product
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center text-gray-500 text-sm">
                  <p>Make sure all information is accurate before submitting</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;