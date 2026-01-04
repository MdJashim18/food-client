import React from 'react';
import Banner from '../Banner/Banner';
import ShowProducts from '../../Products/ShowProducts';
import Footer from '../../../Footer/Footer';
import { Link } from 'react-router';
import Features from '../Features/Features';
import Services from '../Services/Services';
import Testimonials from '../Testimonials/Testimonials';
import Newsletter from '../Newsletter/Newsletter';
import Categories from '../Categories/Categories';
import Blogs from '../Blogs/Blogs';



const Home = () => {
    return (
        <div className='w-[99%]  mx-auto'>
            <Banner></Banner>
            <ShowProducts></ShowProducts>
            <Categories></Categories>
            <Features></Features>
            <Services></Services>
            <Blogs></Blogs>
            <Testimonials></Testimonials>
            <Newsletter></Newsletter>
        </div>
    );
};

export default Home;
