import React from "react";

const NewsletterSection = () => {
  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-lg md:text-xl mb-10 text-indigo-100">
          Stay updated with exclusive offers, product news & delicious drink recipes.
        </p>

        <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-6 md:p-10 border border-white/20">

          <form className="flex flex-col md:flex-row gap-4 justify-center">

            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full md:w-2/3 px-5 py-4 rounded-xl bg-white/20 border border-white/30 
                         placeholder-white/80 text-white focus:outline-none focus:ring-2 
                         focus:ring-blue-300"
            />

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r 
                         from-green-500 to-emerald-600 text-white font-semibold 
                         shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Subscribe
            </button>
          </form>

          <p className="text-sm text-indigo-200 mt-4">
            We respect your privacy. No spam, ever.
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-3 opacity-60">
          <div className="w-3 h-3 rounded-full bg-blue-300"></div>
          <div className="w-3 h-3 rounded-full bg-purple-300"></div>
          <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
        </div>

      </div>
    </section>
  );
};

export default NewsletterSection;
