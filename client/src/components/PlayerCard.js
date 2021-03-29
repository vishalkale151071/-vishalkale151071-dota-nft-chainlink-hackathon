import React from 'react';
import './styles/style.css'

const PlayerCard = () => {
    return(
       <figure className="card card--normal">
            <div className="card__image-container">
                <img src="https://cdn.bulbagarden.net/upload/thumb/f/fd/134Vaporeon.png/1200px-134Vaporeon.png" alt="Vaporeon" className="card__image" />   
            </div>
            <figcaption className="card__caption">
                <h1 className="card__name">Vaporeon</h1>

                <h3 className="card__type">
                water
                </h3>

                <table className="card__stats">
                <tbody><tr>
                    <th>HP</th>
                    <td>130</td>
                </tr>
                <tr>
                    <th>Attack</th>
                    <td>65</td>
                </tr>
                
                <tr>
                    <th>Defense</th>
                    <td>60</td>
                </tr>

                <tr>
                    <th>Special Attack</th>
                    <td>110</td>
                </tr>
                <tr>
                    <th>Special Defense</th>
                    <td>95</td>
                </tr>
                <tr>
                    <th>Speed</th>  
                    <td>65</td>
                </tr>
                </tbody></table>
                
                <div className="card__abilities">
                <h4 className="card__ability">
                    <span className="card__label">Ability</span>
                    Absorb
                </h4>
                <h4 className="card__ability">
                    <span className="card__label">Hidden Ability</span>
                    Hydration
                </h4>
                </div>
            </figcaption> 
       </figure>
    );
}

export default PlayerCard