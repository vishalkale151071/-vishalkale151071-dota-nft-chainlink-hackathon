import React, { useEffect, useState } from 'react';
import './styles/style.css'

const ItemCard = ({ Id, contract}) => {
    
    const [item, setItem] = useState(null);
    const itemObject = {
        "itemCode": '0',
        "damage": '1',
        "strength": '2',
        "agility": '3',
        "intelligence": '4',
        "hitPoints": '5',
        "mana": '6',
        "movementSpeed": '7',
        "enhancement": '8'
    }
    useEffect(() => {
        contract.methods.getItem(Id).call().then((result) => {
            console.log(result);
            setItem(result);
        });   
    }, [Id, contract.methods])
    
    return(
        (item)?(
       <figure className="card card--normal">
            <div className="card__image-container">
                <img src="https://cdn.bulbagarden.net/upload/thumb/f/fd/134Vaporeon.png/1200px-134Vaporeon.png" alt="Vaporeon" className="card__image" />   
            </div>
            <figcaption className="card__caption">
                <h1 className="card__name">{item[itemObject.name]}</h1>

                <table className="card__stats">
                <tbody>
                <tr>
                    <th>HP</th>
                    <td>{item[itemObject.hitPoints]}</td>
                </tr>

                <tr>
                    <th>Mana</th>
                    <td>{item[itemObject.mana]}</td>
                </tr>

                <tr>
                    <th>Strength</th>
                    <td>{item[itemObject.strength]}</td>
                </tr>

                <tr>
                    <th>Agility</th>
                    <td>{item[itemObject.agility]}</td>
                </tr>

                <tr>
                    <th>Intelligence</th>
                    <td>{item[itemObject.intelligence]}</td>
                </tr>

                <tr>
                    <th>Damage</th>
                    <td>{item[itemObject.damage]}</td>
                </tr>

                <tr>
                    <th>Movement Speed</th>  
                    <td>{item[itemObject.movementSpeed]}</td>
                </tr>
                </tbody></table>
                
                <div className="card__abilities">
                <h4 className="card__ability">
                    <span className="card__label">Enhancement</span>
                    {item[itemObject.enhancement]}
                </h4>
                </div>
            </figcaption> 
       </figure>):(
           <h3>Loading your item</h3>
       )
    );
}

export default ItemCard