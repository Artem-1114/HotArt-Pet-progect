import React from 'react';
import './Home.css';
import Slider from '../../components/Slider';
import FeaturedSection from '../../components/FeaturedSection';


const Home = () => {
    return (
        <div className="home-page">
            <Slider />

            <div className="container">
                <FeaturedSection />
            </div>
        </div>
    );
};

export default Home;