import React, { useEffect, useState } from 'react';
import './styles/style.css'

const HeroCard = ({ Id, contract, metaData}) => {

    const [heroFirstHalf, setHeroFirstHalf] = useState(null); //hero variavle to hold hero data
    const [heroSecondHalf, setHeroSecondHalf] = useState(null); //hero variavle to hold hero data
    const heroObject = { // mapping from function return index from solidity to attribute for easier operations
        "heroCode": '0',
        "name": '1',
        "level": '2',
        "damage": '3',
        "strength": '4',
        "agility": '5',
        "intelligence": '0',
        "hitPoints": '1',
        "mana": '2',
        "movementSpeed": '3',
        "armor": '4',
        "tokenId": '5'
    }
    

    useEffect(() => {
        contract.methods.getHeroFirstHalf(Id).call().then((result) => { // get hero from smart contract
            setHeroFirstHalf(result);
            //console.log("First : ", result);
        });
        
        contract.methods.getHeroSecondHalf(Id).call().then((result) => { // get hero from smart contract
            setHeroSecondHalf(result);
            //console.log("Second : ", result);
        });

    }, [Id, contract.methods, heroObject.heroCode])
    
    return(
        (heroFirstHalf && heroSecondHalf)?(
       <figure className={"card " + metaData[heroFirstHalf[heroObject.heroCode]].primaryAttribute}>
            <div className="card__image-container">
                <img src={metaData[heroFirstHalf[heroObject.heroCode]].image} alt="Vaporeon" className="card__image" />
                <h3 className="card-level">{heroFirstHalf[heroObject.level]}</h3>   
            </div>
            <figcaption className="card__caption">
                <h1 className="card__name">{heroFirstHalf[heroObject.name] + " (" + metaData[heroFirstHalf[heroObject.heroCode]].name + ")"}</h1>

                <h3 className="card__type">{metaData[heroFirstHalf[heroObject.heroCode]].primaryAttribute}</h3>
                
                <table className="card__stats">
                <tbody>
                <tr>
                    <th>Health</th>
                    <td>{heroSecondHalf[heroObject.hitPoints]}</td>
                    <th>Mana</th>
                    <td>{heroSecondHalf[heroObject.mana]}</td>
                </tr>

                <tr>
                    <th>Strength</th>
                    <td>{heroFirstHalf[heroObject.strength]}</td>
                    <th>Armor</th>
                    <td>{heroSecondHalf[heroObject.armor]}</td>
                </tr>

                <tr>
                    <th>Agility</th>
                    <td>{heroFirstHalf[heroObject.agility]}</td>
                </tr>

                <tr>
                    <th>Intelligence</th>
                    <td>{heroSecondHalf[heroObject.intelligence]}</td>
                </tr>

                <tr>
                    <th>Damage</th>
                    <td>{heroFirstHalf[heroObject.damage]}</td>
                </tr>

                <tr>
                    <th>Speed</th>  
                    <td>{heroSecondHalf[heroObject.movementSpeed]}</td>
                </tr>
                </tbody></table>
                
                <div className="card__abilities">
                <table>
                    <tbody>
                        <tr>
                            <th><img className="ability_image" alt={metaData[heroFirstHalf[heroObject.heroCode]].ability1.name} src={metaData[heroFirstHalf[heroObject.heroCode]].ability1.image} 
                                title={
                                       " Name : " + metaData[heroFirstHalf[heroObject.heroCode]].ability1.name + " \n" +
                                        "Description: " + metaData[heroFirstHalf[heroObject.heroCode]].ability1.description
                                }
                            /></th>
                            <th><img className="ability_image" alt={metaData[heroFirstHalf[heroObject.heroCode]].ability2.name} src={metaData[heroFirstHalf[heroObject.heroCode]].ability2.image} 
                                title={
                                    " Name : " + metaData[heroFirstHalf[heroObject.heroCode]].ability2.name + " \n" +
                                     "Description: " + metaData[heroFirstHalf[heroObject.heroCode]].ability2.description
                             }
                            /></th>
                            <th><img className="ability_image" alt={metaData[heroFirstHalf[heroObject.heroCode]].ability3.name} src={metaData[heroFirstHalf[heroObject.heroCode]].ability3.image} 
                                title={
                                    " Name : " + metaData[heroFirstHalf[heroObject.heroCode]].ability3.name + " \n" +
                                     "Description: " + metaData[heroFirstHalf[heroObject.heroCode]].ability3.description
                             }
                            /></th>
                            <th><img className="ability_image" alt={metaData[heroFirstHalf[heroObject.heroCode]].ability4.name} src={metaData[heroFirstHalf[heroObject.heroCode]].ability4.image} 
                                title={
                                    " Name : " + metaData[heroFirstHalf[heroObject.heroCode]].ability4.name + " \n" +
                                     "Description: " + metaData[heroFirstHalf[heroObject.heroCode]].ability4.description
                             }
                            /></th>
                        </tr>
                    </tbody>
                </table>
                </div>
            </figcaption> 
       </figure>):(
           <h3>Loading your hero</h3>
       )
    );
}

export default HeroCard