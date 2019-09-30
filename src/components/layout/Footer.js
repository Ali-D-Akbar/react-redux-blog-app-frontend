import React from 'react';
import './Footer.css'


const Footer = () => {
    return (
        <footer className="footer page-footer font-small blue">
            <div className="footer-copyright text-center py-3">
                &copy; {new Date().getFullYear()} Copyright: Ali Akbar
            </div>
        </footer>
    );
};

export default Footer;
