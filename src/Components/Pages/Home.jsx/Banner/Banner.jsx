import React from 'react';
import BaImg1 from '../../../../assets/B2.jpg';
import BaImg2 from '../../../../assets/B4.jpg';
import BaImg3 from '../../../../assets/B5.jpg';
import BaImg4 from '../../../../assets/B6.jpg';

const Banner = () => {

    return (
        <div className="w-full mx-auto">
           
            <div className="carousel w-full h-[70vh] rounded-2xl overflow-hidden">
                <div id="slide1" className="carousel-item relative w-full">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img src={BaImg1} className="w-full object-cover" alt="Food" />
                    <div className="absolute z-20 text-white w-full text-center top-1/2 transform -translate-y-1/2 px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
                            Taste the Perfect <span className="text-amber-400 block">Flavors</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                            Experience culinary excellence with our handcrafted dishes made from the freshest ingredients.
                        </p>
                    </div>
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide4" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide2" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

                <div id="slide2" className="carousel-item relative w-full">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img src={BaImg2} className="w-full object-cover" alt="Fresh Ingredients" />
                    <div className="absolute z-20 text-white w-full text-center top-1/2 transform -translate-y-1/2 px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
                            Fresh & Organic <span className="text-green-400 block">Ingredients</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                            We source only the finest organic ingredients to create healthy and delicious meals for you.
                        </p>
                    </div>
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide1" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide3" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

                <div id="slide3" className="carousel-item relative w-full">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img src={BaImg3} className="w-full object-cover" alt="Chef" />
                    <div className="absolute z-20 text-white w-full text-center top-1/2 transform -translate-y-1/2 px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
                            Master Chefs <span className="text-red-400 block">At Work</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                            Our experienced chefs bring passion and creativity to every dish they create.
                        </p>
                    </div>
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide2" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide4" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>

                <div id="slide4" className="carousel-item relative w-full">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img src={BaImg4} className="w-full object-cover" alt="Dining" />
                    <div className="absolute z-20 text-white w-full text-center top-1/2 transform -translate-y-1/2 px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
                            Unforgettable <span className="text-purple-400 block">Dining Experience</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                            Create lasting memories with our exceptional ambiance and world-class service.
                        </p>
                    </div>
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-30">
                        <a href="#slide3" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❮</a>
                        <a href="#slide1" className="btn btn-circle bg-black/50 hover:bg-black/70 border-none text-white">❯</a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Banner;