import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import './styles/style.css'

const ItemCard = ({ Id, contract, metaData}) => {
    const history = useHistory();
    const [item, setItem] = useState(false); // item variable to hold item
    //const [itemData, setItemData] = useState({}); // itemData variable to hold item metaData 

    useEffect(() => {
        contract.methods.getItem(Id).call().then((result) => { //get Item from smart contract
            setItem(result[0]);
            //setItemData(metaData[result[0]]);
        }); 
    }, [Id, contract.methods])
    
    function goToDetails() {
        history.push(`/items/${Id}`);
    }
    return(
        (item)?(
            <figure onClick={goToDetails} className="vishal card--electric">
                <div className="card__image-container">
                    <img className="Item-image" src={metaData[item].image} alt={metaData[item].name} />   
                </div>
                <figcaption className="card__caption">
                    <h1 className="card__name">{metaData[item].name}</h1>
                    {metaData[item].description}
                    <table className="card__stats">
                        <tbody>
                            {(metaData[item].Strength) && (<tr><th>Streangth</th><td>{metaData[item].Strength}</td></tr>)}
                            {(metaData[item].Agility) && (<tr><th>Agility</th><td>{metaData[item].Agility}</td></tr>)}
                            {(metaData[item].Intelligence) && (<tr><th>Intelligence</th><td>{metaData[item].Intelligence}</td></tr>)}
                            {(metaData[item].damage) && (<tr><th>Damage</th><td>{metaData[item].damage}</td></tr>)}
                            {(metaData[item].Armor) && (<tr><th>Armor</th><td>{metaData[item].Armor}</td></tr>)}
                            {(metaData[item].HealthRegeneration) && (<tr><th>Health Regeneration</th><td>{metaData[item].HealthRegeneration}</td></tr>)}
                            {(metaData[item].mana) && (<tr><th>Mana</th><td>{metaData[item].mana}</td></tr>)}
                            {(metaData[item].MovementSpeed) && (<tr><th>Movement Speed</th><td>{metaData[item].MovementSpeed}</td></tr>)}
                        </tbody>
                    </table>
                    <div className="card__abilities">
                        {(metaData[item].Active) && (
                            <h4 className="card__ability">
                                Active
                                <span className="card__label">{metaData[item].Active}</span>
                            </h4>
                        )}
                        {(metaData[item].Passive) && (
                            <h4 className="card__ability">
                                Passive
                                <span className="card__label">{metaData[item].Passive}</span>
                        </h4>    
                        )}
                    </div>
                </figcaption> 
            </figure>):(
           <h3>Loading your item</h3>
       )
    )
}

export default ItemCard