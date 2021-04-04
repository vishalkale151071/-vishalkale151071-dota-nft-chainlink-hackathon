import React, { useEffect, useState } from 'react';
import './styles/style.css'

const ItemCard = ({ Id, contract, metaData}) => {
    
    const [item, setItem] = useState(null); // item variable to hold item
    const [itemData, setItemData] = useState({}); // itemData variable to hold item metaData
    
    useEffect(() => {
        contract.methods.getItem(Id).call().then(async (result) => { //get Item from smart contract
            setItem(result);
            setItemData(metaData[result["0"]])
        }); 
    }, [Id, contract.methods, metaData])
    
    return(
        (item)?(
       <figure className="card card--electric">
            <div className="card__image-container">
                <img className="Item-image" src={itemData.image} alt={item['0']} />   
            </div>
            <figcaption className="card__caption">
                <h1 className="card__name">{itemData.name}</h1>

                <table className="card__stats">
                    <tbody>
                        {(itemData.Strength) && (<tr><th>Streangth</th><td>{itemData.Strength}</td></tr>)}
                        {(itemData.Agility) && (<tr><th>Agility</th><td>{itemData.Agility}</td></tr>)}
                        {(itemData.Intelligence) && (<tr><th>Intelligence</th><td>{itemData.Intelligence}</td></tr>)}
                        {(itemData.damage) && (<tr><th>Damage</th><td>{itemData.damage}</td></tr>)}
                    </tbody>
                </table>
                <div class="card__abilities">
                    {(itemData.Active) && (
                        <h4 class="card__ability">
                            Active
                            <span class="card__label">{itemData.Active}</span>
                        </h4>
                    )}
                    {(itemData.Passive) && (
                        <h4 class="card__ability">
                            Passive
                            <span class="card__label">{itemData.Passive}</span>
                    </h4>    
                    )}
                </div>
            </figcaption> 
       </figure>):(
           <h3>Loading your item</h3>
       )
    );
}

export default ItemCard