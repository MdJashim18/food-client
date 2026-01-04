import React, { useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Blogger",
      review:
        "The best food delivery service I've ever used! The quality is always excellent and delivery is super fast. Highly recommended!",
      rating: 5,
      avatar: "SJ",
      date: "2 days ago",
    },
    {
      name: "Mike Chen",
      role: "Regular Customer",
      review:
        "I order from FoodLovers every week. The consistency in quality and taste is amazing. Their customer service is top-notch!",
      rating: 5,
      avatar: "MC",
      date: "1 week ago",
    },
    {
      name: "Emma Wilson",
      role: "Home Chef",
      review:
        "As a chef, I appreciate the freshness of ingredients and authentic flavors. This is my go-to food app for busy days!",
      rating: 5,
      avatar: "EW",
      date: "3 days ago",
    },
    {
      name: "David Miller",
      role: "Office Manager",
      review:
        "We order team lunches from here regularly. Always on time, delicious food, and great packaging. Perfect for office meals!",
      rating: 4,
      avatar: "DM",
      date: "5 days ago",
    },
    {
      name: "Lisa Anderson",
      role: "Fitness Enthusiast",
      review:
        "Their healthy food options are amazing! Fresh, tasty, and perfect for my diet. Love the nutritional information provided.",
      rating: 5,
      avatar: "LA",
      date: "1 month ago",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 via-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from our loyal food lovers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 hover:shadow-2xl transition-all duration-300 p-10">
            
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {currentTestimonial.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentTestimonial.name}
                  </h3>
                  <p className="text-gray-600">{currentTestimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-xl ${
                      i < currentTestimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-lg text-gray-700 italic border-l-4 border-indigo-400 pl-4 leading-relaxed">
              "{currentTestimonial.review}"
            </p>

            <div className="flex justify-between items-center mt-8">
              <div className="text-gray-500 text-sm">
                Posted {currentTestimonial.date}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 shadow"
                >
                  <FiChevronLeft className="text-indigo-700" />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-indigo-600 w-6"
                          : "bg-indigo-200 w-2"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 shadow"
                >
                  <FiChevronRight className="text-indigo-700" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {testimonials.slice(0, 3).map((t, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="cursor-pointer bg-white p-6 rounded-xl border border-purple-100 hover:border-indigo-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-blue-100 text-indigo-700 font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-gray-600 text-sm">{t.role}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  "{t.review}"
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`text-sm ${
                          i < t.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
