import React from 'react';
import about from '../../../../assets/about.png'

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3">About Us</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        We deliver fresh, organic and high-quality foods right to your doorstep.
                    </p>
                </div>

               
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Who We Are</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Welcome to our online food marketplace — your trusted destination for the ﬁnest 
                            fish, meat, fruits, honey and organic products. We are committed to offering
                            fresh, safe and premium-quality foods sourced directly from trusted farms and
                            suppliers.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Our mission is simple — to make healthy living effortless. By delivering fresh,
                            chemical-free and hygienic foods, we aim to build a healthier community and a
                            modern e-commerce experience for every customer.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800">Why Choose Us?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 text-lg">
                            <li>100% Fresh and Organic Foods</li>
                            <li>Fast & Secure Delivery</li>
                            <li>Premium Quality at the Best Price</li>
                            <li>Hygienic Packaging</li>
                            <li>24/7 Customer Support</li>
                        </ul>
                    </div>

                  
                    <div>
                        <img 
                            src={about} 
                            alt="Fresh Foods"
                            className="rounded-3xl shadow-lg w-full object-cover"
                        />
                    </div>
                </div>

                <div className="mt-14 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Freshness You Can Trust</h2>
                    <p className="text-gray-600 text-lg">
                        Every order is packed with care and delivered with love — because your health matters.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;