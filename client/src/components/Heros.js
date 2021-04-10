import React, { useEffect, useState } from "react";
import HeroCard from "./HeroCard";
import '../components/styles/style.css'
const Heros = ({contract, account}) => {
    const [heros, setHeros] = useState(0);
    const [metaDate, setHeroMetaData] = useState(null);
    
    useEffect(() => {
        fetch("https://gateway.pinata.cloud/ipfs/QmVNdiUfYGZhfAcBpFj87KmaYDU9rbSU25Wjgnu1aJHwDu")
        .then(response => response.json())
        .then(async (data) => {
            await setHeroMetaData(data);
            //console.log(data);
        })
    },[]);

    useEffect(() => {        
        contract.methods.getHeroCount().call()
        .then(result => {
            setHeros(result);
        });
    },[contract.methods])
    
    return(
        (metaDate) && (<div className="cards">
            <h2 className="heading">DOTA heros</h2>
            {(heros > 0)?(
                [...Array(parseInt(heros))].map((_,id) => (
                    <HeroCard key={"H"+id} account={account} contract={contract} Id={id} metaData={metaDate}/>
            ))
            ):
            (
                <h3>No heros added yet</h3>
            )}
        </div>)
    );
}

export default Heros;