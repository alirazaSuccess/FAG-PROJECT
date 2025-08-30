import React from 'react';
import '../styling/about.css';
import About_img from '../assets/about.jpeg'
import Footer from '../Components/Footer';

const About = () => {
    return (
        <>
            <section className='about_main'>
                <div className="sub_about_main" role="main">
                    <div className="overlay">
                        <img src={About_img} alt="About us"/>
                        <div className="content">
                            <div>
                                <h1>ABOUT US</h1>
                                <p>Together, We Build the Future.</p>
                            </div>
                        </div>
                    </div>
                    <div className='about-text'>
                        <p>
                            At FAG, we believe in shaping the future through bold ideas, smart investments, and sustainable innovation. Our mission is to empower individuals, communities, and industries by investing in technologies and solutions that drive long-term growth and positive impact. Whether it's blockchain, renewable energy, or cutting-edge digital infrastructure, FAG is committed to building a better tomorrow—together.
                        </p>
                        <p>
                            Rooted in transparency, trust, and forward-thinking strategies, we bridge the gap between opportunity and innovation. Join us as we create pathways to a smarter, more sustainable world.
                        </p>
                        <button onClick={() => window.location.href = '/login'} className="btn btn-primary">REGISTER</button>
                    </div>
                </div>
            </section>
            <div className='Work_Client'>
                <div className="client-section">
                    <section className="client-card">
                        <div className='main-card'>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                <article className="believe_card">
                                    <div className="icon-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path d="M3 12h3l3 8 4-16 3 10h4" />
                                        </svg>
                                    </div>
                                    <h3>Our Mission</h3>
                                    <p>To drive sustainable progress by investing in transformative technologies and empowering communities to thrive in the digital and decentralized future.</p>
                                </article>

                                <article className="believe_card">
                                    <div className="icon-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M8 12l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3>Our Vision</h3>
                                    <p>To be a global leader in future-focused investments, shaping a world where innovation, equity, and sustainability define the new standard of success.</p>
                                </article>

                                <article className="believe_card">
                                    <div className="icon-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path d="M8 7v10M16 7v6M4 15c3 3 9 3 12 0" />
                                        </svg>
                                    </div>
                                    <h3>Our Values</h3>
                                    <p>At FAG, we value integrity, innovation, sustainability, collaboration, and excellence in every step we take toward a smarter future.</p>
                                </article>

                                <article className="believe_card">
                                    <div className="icon-container">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path d="M6 20V8.6a7 7 0 0 1 12 4.86M6 14.5V3h12v8" />
                                        </svg>
                                    </div>
                                    <h3>Our Team</h3>
                                    <p>
                                        Meet the experts, innovators, and visionaries behind FAG—committed to turning forward-thinking strategies into real-world impact.</p>
                                </article>
                            </div>
                        <div className='about-text'>
                        <div className="heading">
                            <h1>Ready to invest in a smarter future?</h1>
                        </div>
                        <div className="about-content">
                            <article>Partner with FAG and be part of tomorrow’s innovation, today.
                            </article>
                        </div>
                        </div>
                        </div>
                    </section>
                                <Footer />
                </div>
            </div>
        </>
    );
}

export default About;