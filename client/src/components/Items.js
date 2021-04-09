import React, { useEffect, useState } from 'react';
import ItemCard from './ItemCard';

const Items = ({ account, contract}) => {
    const [items, setItems] = useState(0);
    const [metaDate, setItemMetaData] = useState(null);

    useEffect(() => {
        fetch("https://gateway.pinata.cloud/ipfs/QmRDZDm7zu9kpo2VAdB4GktB9PMKW3SUNJHGLciRoJTfuq")
        .then(response => response.json())
        .then(async (data) => {
            await setItemMetaData(data);
        })
    }, []);

    useEffect(() => {
        contract.methods.getItemCount().call()
        .then(result => {
            setItems(result)
        })
    },[contract.methods]);

    return (
        <div className="cards">
            <h2 className="heading">DOTA items</h2>
            {(items > 0)?(
                [...Array(parseInt(items))].map((_,id) => (
                <ItemCard key={"I"+id} account={account} contract={contract} Id={id} metaData={metaDate}/>
            ))
            ):
            (
                <h3>No Items added yet</h3>
            )}
        </div>
    )
}

export default Items