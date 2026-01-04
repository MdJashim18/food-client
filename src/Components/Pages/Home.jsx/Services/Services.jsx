import React from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";

const Services = () => {
  const steps = [
    {
      number: "01",
      title: "Browse & Select",
      description: "Explore our menu and choose your favorite dishes",
      icon: <FiSearch className="text-3xl text-white" />,
      color: "from-indigo-600 to-purple-600"
    },
    {
      number: "02",
      title: "Add to Cart",
      description: "Select quantity and add items to your shopping cart",
      icon: <FiShoppingCart className="text-3xl text-white" />,
      color: "from-green-500 to-emerald-600"
    },
    {
      number: "03",
      title: "Enter Details",
      description: "Provide delivery address and contact information",
      icon: <FiMapPin className="text-3xl text-white" />,
      color: "from-blue-500 to-indigo-500"
    },
    {
      number: "04",
      title: "Confirm Order",
      description: "Review your order and confirm for delivery",
      icon: <FiCheckCircle className="text-3xl text-white" />,
      color: "from-purple-600 to-indigo-600"
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">

        
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-lg mt-2">
            Get your favorite food delivered in 4 simple steps
          </p>
        </div>

        <div className="relative">

          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 
            bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 
            transform -translate-y-1/2 opacity-40 rounded-full z-0">
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative">

                <div className="
                  bg-white 
                  p-8 
                  rounded-3xl 
                  shadow-lg 
                  border border-indigo-100
                  hover:shadow-2xl 
                  hover:-translate-y-2 
                  hover:scale-[1.02] 
                  transition-all duration-300 text-center">

                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                    {step.icon}
                  </div>

                  <div className={`absolute -top-4 left-5 -translate-x-1/2 w-12 h-12 rounded-full 
                    bg-gradient-to-r ${step.color} 
                    flex items-center justify-center 
                    text-white font-bold shadow-md`}>
                    {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mt-5">
                    <span className={`inline-block px-4 py-1 bg-gradient-to-r ${step.color} text-white rounded-full text-sm font-medium`}>
                      Step {step.number}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-10 shadow-inner border border-indigo-100">
          <div className="grid md:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                30min
              </div>
              <div className="text-gray-600">Average Delivery Time</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-600">Support Available</div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;
