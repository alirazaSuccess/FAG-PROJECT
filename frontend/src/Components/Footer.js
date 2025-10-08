/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h2>Pages</h2>
                        <ul>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact Us</a></li>

                        </ul>
                    </div>
                    <div className="footer-section">
                        <h2>Legal</h2>
                        <ul>
                            <li><a href="/privacy_policy">Privacy Policy</a></li>
                            <li><a href="/term_condition">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer
