import React from 'react';
import {HashLink as Link} from 'react-router-hash-link';
import {SocialIcon} from 'react-social-icons';

const Footer = () => {
    return(
        <footer className="footer">
            <div className="footer-left col-md-4 col-sm-6">
                <p className="about">
                <span> About the Project</span> In this project I am trying to increase the value of single Nfts by combining it with other NFT. we are creating 2 NFTS, 
                First Player NFT and second Item NFT. both will have their own attributes and items will have random enhancements. when we infuse an item in player, player's attributes will be upgraded based on item's attributes and player will be able to use item's enhancement.
                </p>
                <div className="icons">
                <SocialIcon url='https://twitter.com/Vishalkale1494'/>
                <SocialIcon url="https://www.linkedin.com/in/vishalkale1494"/>
                <SocialIcon url="https://github.com/vishalkale151071" />
                <SocialIcon url="https://discordapp.com/users/527946249345957919"/>
                </div>
            </div>
            <div className="footer-center col-md-4 col-sm-6">
                <div>
                <i className="fa fa-map-marker"></i>
                <p><span></span> Maharashtra, India</p>
                </div>
                <div>
                <i className="fa fa-phone"></i>
                <p></p>
                </div>
                <div>
                <i className="fa fa-envelope"></i>
                <p><a href = "mailto: vishalkale151071@gmail.com">vishalkale151071@gmail.com</a></p>
                </div>
            </div>
            <div className="footer-right col-md-4 col-sm-6">
                <h2> DOTA -<span> NFT</span></h2>
                <p className="menu">
                <Link to="/"> Home</Link> | 
                <Link to="/heros"> Heros</Link> | 
                <Link to="/items"> Items</Link>
                </p>
                <p className="name"> DOTA - NFT &copy; { new Date().getFullYear() }</p>
            </div>
            </footer>
    );
}

export default Footer