import React from 'react';
import { FiTruck, FiStar, FiShield, FiClock } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiTruck className="text-3xl" />,
      title: "Fast Delivery",
      description: "30 minutes delivery guaranteed or get 50% off",
      color: "from-indigo-600 to-purple-600"
    },
    {
      icon: <FiStar className="text-3xl" />,
      title: "Top Rated",
      description: "4.8+ average customer rating from 10K+ reviews",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Safe & Secure",
      description: "Contactless delivery and hygienic packaging",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: "24/7 Service",
      description: "Order anytime, we deliver 24 hours a day",
      color: "from-purple-600 to-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">

       
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Why Choose FoodLovers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            We deliver excellence in every bite with our premium service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="
                bg-white 
                p-7 rounded-2xl 
                shadow-lg 
                border 
                border-indigo-100 
                hover:shadow-2xl 
                transition-all 
                duration-300 
                transform 
                group-hover:-translate-y-3
                hover:border-indigo-300
              ">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2 group-hover:text-indigo-600 transition">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="
            inline-flex items-center gap-6 
            bg-white 
            p-8 rounded-2xl 
            shadow-xl 
            border border-indigo-200
            backdrop-blur-sm
          ">
            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-600">Happy Customers</div>
            </div>

            <div className="h-14 w-px bg-indigo-200"></div>

            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-gray-600">Food Items</div>
            </div>

            <div className="h-14 w-px bg-indigo-200"></div>

            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-gray-600">Restaurants</div>
            </div>

            <div className="h-14 w-px bg-indigo-200"></div>

            <div className="text-center">
              <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                30min
              </div>
              <div className="text-gray-600">Avg Delivery</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
