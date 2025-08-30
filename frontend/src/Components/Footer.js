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
                        <h2>Help center</h2>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">Whatsapp</a></li>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h2>Legal</h2>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© 2025 <a href="/">Aliraza</a>. All Rights Reserved.</span>
                <div className="footer-socials">
                    <a href="#">FB</a>
                    <a href="#">Tiktok</a>
                    <a href="#">Instagram</a>
                    <a href="#">LinkedIn</a>
                </div>
            </div>
        </footer>

    )
}

export default Footer
