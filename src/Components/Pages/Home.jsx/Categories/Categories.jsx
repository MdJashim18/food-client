import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';

const Categories = () => {
  const axiosSecure = UseAxiosSecure();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosSecure.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, [axiosSecure]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Popular Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide variety of food categories. Something for every taste!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={`/AllProducts?category=${category.name.toLowerCase()}`}
              className="group block"
            >
              <div className="
                bg-white 
                p-6 
                rounded-2xl 
                shadow-lg 
                border 
                border-gray-200 
                hover:shadow-2xl 
                transition-all 
                duration-300 
                transform 
                group-hover:-translate-y-2 
                h-full
                hover:border-indigo-500
              ">

                <h3 className="text-lg font-bold text-gray-900 mb-1 text-center group-hover:text-indigo-600 transition-all">
                  {category.name}
                </h3>

                <p className="text-gray-600 text-sm text-center">
                  {category.count}
                </p>
                <div className="mt-3 text-center">
                  <span className="
                    inline-block 
                    px-3 
                    py-1 
                    bg-gradient-to-r 
                    from-green-500 
                    to-blue-500 
                    text-white 
                    rounded-full 
                    text-xs 
                    font-medium 
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  ">
                    View All
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/AllProducts"
            className="
              inline-flex 
              items-center 
              gap-2 
              px-7 
              py-3 
              bg-gradient-to-r 
              from-indigo-600 
              to-purple-600 
              text-white 
              font-semibold 
              rounded-xl 
              hover:shadow-2xl 
              transition-all 
              duration-300 
              transform 
              hover:-translate-y-1
            "
          >
            <span>View All Categories</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Categories;
