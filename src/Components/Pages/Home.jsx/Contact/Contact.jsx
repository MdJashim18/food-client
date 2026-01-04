import React from 'react';
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-20">
            
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Contact Us
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
               
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
                    <div className='flex justify-center items-center gap-2 mb-2'>
                        <FaPhoneAlt className="text-xl text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-800">Phone</h3>
                    </div>
                    <p className="text-gray-600">+880 1992578305</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
                    <div className='flex justify-center items-center gap-2 mb-2'>
                        <FaEnvelope className="text-xl text-red-600" />
                        <h3 className="text-xl font-bold text-gray-800">Email</h3>
                    </div>
                    <p className="text-gray-600">mdjashimuddinjnn22990@gmail.com</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
