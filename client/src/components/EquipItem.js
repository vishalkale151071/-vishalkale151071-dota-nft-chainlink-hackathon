import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import '../components/styles/style.css'
import ItemCard from './ItemCard';


const EquipItem = ({contract, account}) => {
    const {id} = useParams();
    const [items, setItems] = useState([]);
    const [metaData, setItemMetaData] = useState(false)

    useEffect(() => {
        fetch("https://gateway.pinata.cloud/ipfs/QmRDZDm7zu9kpo2VAdB4GktB9PMKW3SUNJHGLciRoJTfuq")
        .then(response => response.json())
        .then(data => {
            setItemMetaData(data);
        })
    }, [])

    useEffect(() => {
        contract.methods.getItemNFTs(account).call()
        .then(result => {
            setItems(result);
        })
    },[contract.methods, account]);

    async function equipItem(_id){
        let itemCode = await contract.methods.getItem(_id).call();
        let {Strength, Agility, Intelligence, damage, Armor, MovementSpeed, mana} = await metaData[itemCode["0"]]
        console.log(id/*hero*/, _id/*item*/, Strength||0, Agility||0, Intelligence||0, damage||0, Armor||0, mana||0, MovementSpeed||0);
        contract.methods.equipItem(id/*hero*/, _id/*item*/, Strength||0, Agility||0, Intelligence||0, damage||0, Armor||0, mana||0, MovementSpeed||0).send({from: account}).then(result => (console.table(result)));
    }
    return(
        (metaData) && (
            <>
                <Row>
                    <Col sm={12} >
                        <h2 className="heading">Equip item {id}</h2>
                    </Col>
                </Row>
                <Row>
                    {items.map((_id) => (
                        <Col key={"C"+_id}>
                                <ItemCard key={"I"+_id} Id={_id} contract={contract} account={account} metaData={metaData}/>
                                <center><Button key={"B"+_id} variant="danger" onClick={() => equipItem(_id)}>Equip</Button></center>
                        </Col>
                    ))}
                </Row>
            </>
        )
    );
}

export default EquipItem