import React, { useEffect, useState } from 'react';
import './styles/style.css'

const HeroCard = ({ Id, contract}) => {
    
    const [hero, setHero] = useState(null);
    const [PA, setPA] = useState(null)
    const heroObject = {
        "heroCode": '0',
        "name": '1',
        "level": '2',
        "damage": '3',
        "strength": '4',
        "agility": '5',
        "intelligence": '6',
        "hitPoints": '7',
        "mana": '8',
        "movementSpeed": '9'
    }
    useEffect(() => {
        contract.methods.getHero(Id).call().then((result) => {
            console.log(result);
            setHero(result);
            let herocode = parseInt(result[heroObject.heroCode]);
            if(herocode<5){setPA("Strength")}
            else if(herocode<9){setPA("Agility")}
            else{setPA("Intelligent")}
        });   
    }, [Id, contract.methods, heroObject.heroCode])
    
    return(
        (hero)?(
       <figure className="card card--normal">
            <div className="card__image-container">
                <img src="http://bafybeibvudboupc3f434bpsineothblcwfziwwqty5nzeuv55pa2l2ede4.ipfs.localhost:8080/?filename=PA.png" alt="Vaporeon" className="card__image" />   
            </div>
            <figcaption className="card__caption">
                <h1 className="card__name">{hero[heroObject.name]}</h1>

                <h3 className="card__type">
                {PA}
                </h3>

                <table className="card__stats">
                <tbody>
                <tr>
                    <th>HP</th>
                    <td>{hero[heroObject.hitPoints]}</td>
                </tr>

                <tr>
                    <th>Mana</th>
                    <td>{hero[heroObject.mana]}</td>
                </tr>

                <tr>
                    <th>Strength</th>
                    <td>{hero[heroObject.strength]}</td>
                </tr>

                <tr>
                    <th>Agility</th>
                    <td>{hero[heroObject.agility]}</td>
                </tr>

                <tr>
                    <th>Intelligence</th>
                    <td>{hero[heroObject.intelligence]}</td>
                </tr>

                <tr>
                    <th>Damage</th>
                    <td>{hero[heroObject.damage]}</td>
                </tr>

                <tr>
                    <th>Movement Speed</th>  
                    <td>{hero[heroObject.movementSpeed]}</td>
                </tr>
                </tbody></table>
                
                <div className="card__abilities">
                {/* <h4 className="card__ability">
                    <span className="card__label">Ability</span>
                    Absorb
                </h4>
                <h4 className="card__ability">
                    <span className="card__label">Hidden Ability</span>
                    Hydration
                </h4> */}
                </div>
            </figcaption> 
       </figure>):(
           <h3>Loading your hero</h3>
       )
    );
}

export default HeroCard