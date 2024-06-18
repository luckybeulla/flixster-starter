import React from 'react';
import './Header.css';
import movieIcon from '../assets/movieIcon.jpg'; 

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <img src={movieIcon} alt="Film Icon" className="header-icon" />
                <h1 className="header-title">Flixster</h1>
            </div>
        </header>
    );
};

export default Header;
