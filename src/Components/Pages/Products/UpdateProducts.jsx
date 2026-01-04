import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FiUpload, FiClock, FiTag, FiMapPin, FiStar } from "react-icons/fi";
import { MdRestaurant, MdDescription } from "react-icons/md";

const UpdateProducts = () => {
    const { id } = useParams();
    const axiosSecure = UseAxiosSecure();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [preview, setPreview] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get(`/foods/${id}`);
                const productData = res.data;
                setProduct(productData);

                reset({
                    food_name: productData.food_name || productData.name,
                    description: productData.description,
                    category: productData.category,
                    price: productData.price,
                    available: productData.available,
                    restaurant_name: productData.restaurant_name,
                    restaurant_location: productData.restaurant_location,
                    preparation_time: productData.preparation_time,
                    rating: productData.rating,
                    ingredients: productData.ingredients?.join(", ") || "",
                    views: productData.review?.views || 0,
                    orders: productData.review?.orders || 0,
                    featured: productData.featured || false
                });

                setPreview(productData.image || productData.photo);
                setImageURL(productData.image || productData.photo);
            } catch (error) {
                console.error("Error loading product:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to load product data",
                    icon: "error",
                    confirmButtonColor: "#3b82f6"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, axiosSecure, reset]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                title: "File Too Large!",
                text: "Please upload an image smaller than 5MB",
                icon: "warning",
                confirmButtonColor: "#3b82f6"
            });
            return;
        }

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                title: "Invalid File!",
                text: "Please upload an image file",
                icon: "warning",
                confirmButtonColor: "#3b82f6"
            });
            return;
        }

        const tempPreview = URL.createObjectURL(file);
        setPreview(tempPreview);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const uploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST}`;

            const res = await fetch(uploadURL, { method: "POST", body: formData });
            const data = await res.json();

            if (data.success) {
                setImageURL(data.data.url);
                Swal.fire({
                    title: "Success!",
                    text: "Image uploaded successfully",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            Swal.fire({
                title: "Upload Failed!",
                text: "Failed to upload image. Please try again.",
                icon: "error",
                confirmButtonColor: "#3b82f6"
            });
            setPreview(product?.image || "");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const updateData = {
                ...data,
                price: parseFloat(data.price),
                rating: parseFloat(data.rating),
                views: parseInt(data.views) || 0,
                orders: parseInt(data.orders) || 0,
                featured: data.featured === "true",
                ingredients: data.ingredients.split(",").map(item => item.trim()).filter(item => item),
                image: imageURL || product?.image,
                updatedAt: new Date().toISOString(),
                review: {
                    views: parseInt(data.views) || 0,
                    orders: parseInt(data.orders) || 0,
                    ...(product?.review || {})
                }
            };

            const res = await axiosSecure.patch(`/foods/${id}`, updateData);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Success!",
                    text: "Product updated successfully",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate("/dashboard/AllProductsAdmin");
                });
            } else {
                Swal.fire({
                    title: "No Changes",
                    text: "Product information remains the same",
                    icon: "info",
                    confirmButtonColor: "#3b82f6"
                });
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update product. Please try again.",
                icon: "error",
                confirmButtonColor: "#ef4444"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading product details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Update Product</h1>
                            <p className="text-gray-600 mt-2">
                                Edit and update product information
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/dashboard/AllProductsAdmin")}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       
                        <div className="lg:col-span-1">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Current Product Image</h3>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                    <img
                                        src={preview}
                                        alt={product?.name || "Product"}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                       
                        <div className="lg:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Product Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p className="font-medium">{new Date(product?.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Updated</p>
                                    <p className="font-medium">{new Date(product?.updatedAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product?.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {product?.available ? "Available" : "Not Available"}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Featured</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product?.featured ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                                        {product?.featured ? "Featured" : "Regular"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                                    Basic Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <FiTag className="mr-2" />
                                                Product Name *
                                            </div>
                                        </label>
                                        <input
                                            {...register("name", { 
                                                required: "Product name is required",
                                                minLength: {
                                                    value: 3,
                                                    message: "Name must be at least 3 characters"
                                                }
                                            })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter product name"
                                        />
                                        {errors.food_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.food_name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            {...register("category", { required: "Category is required" })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Burger">Burger</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Drinks">Drinks</option>
                                            <option value="Dessert">Dessert</option>
                                            <option value="Appetizer">Appetizer</option>
                                            <option value="Main Course">Main Course</option>
                                            <option value="Breakfast">Breakfast</option>
                                            <option value="Lunch">Lunch</option>
                                            <option value="Dinner">Dinner</option>
                                            <option value="Snacks">Snacks</option>
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price (BDT) *
                                        </label>
                                        <div className="relative">
                                            <input
                                                {...register("price", { 
                                                    required: "Price is required",
                                                    min: { value: 0, message: "Price must be positive" }
                                                })}
                                                type="number"
                                                step="0.01"
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <FiStar className="mr-2" />
                                                Rating (1-5)
                                            </div>
                                        </label>
                                        <input
                                            {...register("rating", { 
                                                min: { value: 1, message: "Minimum rating is 1" },
                                                max: { value: 5, message: "Maximum rating is 5" }
                                            })}
                                            type="number"
                                            step="0.1"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="4.5"
                                        />
                                        {errors.rating && (
                                            <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <FiClock className="mr-2" />
                                                Preparation Time
                                            </div>
                                        </label>
                                        <input
                                            {...register("preparation_time")}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="e.g., 15 minutes"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Availability
                                        </label>
                                        <select
                                            {...register("available")}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        >
                                            <option value="true">Available</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Views Count
                                        </label>
                                        <input
                                            {...register("views", { min: 0 })}
                                            type="number"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Orders Count
                                        </label>
                                        <input
                                            {...register("orders", { min: 0 })}
                                            type="number"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Featured Product
                                        </label>
                                        <select
                                            {...register("featured")}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                                    Restaurant Information
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <MdRestaurant className="mr-2" />
                                                Restaurant Name *
                                            </div>
                                        </label>
                                        <input
                                            {...register("restaurant_name", { required: "Restaurant name is required" })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter restaurant name"
                                        />
                                        {errors.restaurant_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.restaurant_name.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <FiMapPin className="mr-2" />
                                                Restaurant Location *
                                            </div>
                                        </label>
                                        <input
                                            {...register("restaurant_location", { required: "Location is required" })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                            placeholder="Enter location"
                                        />
                                        {errors.restaurant_location && (
                                            <p className="mt-1 text-sm text-red-600">{errors.restaurant_location.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                                    Details
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-6">
                                   
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <MdDescription className="mr-2" />
                                                Description *
                                            </div>
                                        </label>
                                        <textarea
                                            {...register("description", { 
                                                required: "Description is required",
                                                minLength: {
                                                    value: 20,
                                                    message: "Description must be at least 20 characters"
                                                }
                                            })}
                                            rows="4"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                            placeholder="Enter detailed description about the product..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ingredients (comma separated)
                                        </label>
                                        <textarea
                                            {...register("ingredients")}
                                            rows="3"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                                            placeholder="e.g., Beef, Lettuce, Tomato, Cheese, Bun"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                                    Product Image
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Upload New Image</p>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="imageUpload"
                                                disabled={uploading}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className={`inline-flex items-center px-6 py-2.5 border border-gray-300 text-sm font-medium rounded-lg cursor-pointer ${uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiUpload className="mr-2" />
                                                        Choose Image
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {preview && (
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="font-medium text-gray-700">Preview</p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPreview(product?.image || "");
                                                        setImageURL(product?.image || "");
                                                    }}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Reset to Original
                                                </button>
                                            </div>
                                            <div className="flex justify-center">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-h-64 rounded-lg shadow"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/dashboard/all-products")}
                                        className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || uploading}
                                        className={`px-8 py-3 font-medium rounded-lg transition-colors flex items-center justify-center ${isSubmitting || uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Product"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default UpdateProducts;