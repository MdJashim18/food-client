import React from "react";
import { FaRegClock, FaUser } from "react-icons/fa";

const Blogs = () => {

    const blogPosts = [
        {
            title: "10 Easy Summer Recipes",
            author: "Sarah Johnson",
            date: "Jan 12, 2026",
            category: "Recipe",
            image: "https://i.ibb.co.com/sJvgPLbm/Paneer-Butter-Masala.jpg",
            excerpt:
                "Discover quick and delicious summer recipes to enjoy with your family and friends.",
        },
        {
            title: "Smoothies for Every Mood",
            author: "Mike Chen",
            date: "Feb 5, 2026",
            category: "Healthy",
            image: "https://i.ibb.co.com/Lh1B0x4m/Beef-Burrito-Bowl.jpg",
            excerpt:
                "Boost your energy and stay fit with these easy-to-make healthy smoothies."
        },
        {
            title: "Top 5 Food Trends in 2026",
            author: "Emma Wilson",
            date: "Mar 20, 2026",
            category: "Trends",
            image: "https://i.ibb.co.com/jZy3p9k3/Spicy-Chicken-Tikka.jpg",
            excerpt:
                "Stay ahead in the culinary world by exploring the hottest food trends this year."
        },
        {
            title: "10 Easy Summer Recipes",
            author: "Sarah Johnson",
            date: "Jan 12, 2026",
            category: "Recipe",
            image: "https://i.ibb.co.com/sJvgPLbm/Paneer-Butter-Masala.jpg",
            excerpt:
                "Discover quick and delicious summer recipes to enjoy with your family and friends.",
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
               
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Food Blog Insights</h2>
                <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                    Explore our latest recipes, food trends, and tips for a healthy and delicious lifestyle.
                </p>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {blogPosts.map((post, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 group"
                        >
                            
                            <div className="overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded-t-3xl transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            
                            <span className="absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md">
                                {post.category}
                            </span>

                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-indigo-600 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>

                                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaUser /> {post.author}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaRegClock /> {post.date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blogs;
