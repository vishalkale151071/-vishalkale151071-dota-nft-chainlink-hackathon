import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Row, Col, Button} from 'react-bootstrap';
import '../components/styles/owner.css';
import ItemCard from './ItemCard';
const ItemDetails = ({account, contract}) => {
    const {id} = useParams();
    const [metaData, setItemMetaData] = useState(null);
    const [owner, setOwner] = useState('');
    
     useEffect(() => {
        fetch("https://gateway.pinata.cloud/ipfs/QmRDZDm7zu9kpo2VAdB4GktB9PMKW3SUNJHGLciRoJTfuq")
        .then(response => response.json())
        .then((data) => {
            setItemMetaData(data);
            //console.log(data);
        })
    }, []);

    useEffect(() => {
        contract.methods.getItemOwner(id).call()
        .then(result => {setOwner(result)});
    },[contract.methods, id])
    return (
        <>
            <Row>
                <center>
                    <h2 className="heading">DOTA heros</h2>
                </center>
            </Row>
            <Row>
                <Col lg={3} md={6}>
                    <ItemCard key={"I"+id} Id={parseInt(id)} contract={contract} metaData={metaData}/>
                </Col>
                <Col lg={9} md={6}>
                    <div className="owner">
                        <h3>Owned by : {owner}</h3>
                        <hr color="white"></hr>
                        <Button variant="success">
                            Battle
                        </Button>
                        <br />
                        <br />
                        <h4>
                            after Btteling your hero will get experience to level up.
                        </h4>
                        <hr color="white"/>
                        <Row>
                        <Col sm={6}>
                            <Button variant="danger">
                                Equip Item
                            </Button>
                            <br />
                            <div className="description">
                                <h4>1&#41;After Doing this the item will be added in the player's item slot.</h4>
                                <h4>2&#41;Then all the attribute of item will be added in hero's attribute.</h4>
                                <h4>3&#41;You can not tranfer that item to any one.</h4>
                                <h4>4&#41;To do so you need to remove the item.</h4>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <Button variant="primary">
                                Remove Item
                            </Button>
                            <br />
                            <div className="description">
                                <h4>1&#41;Doing this will let you trade this item.</h4>
                                <h4>2&#41;All the item's attribute will be removed from hero's attribute.</h4>
                            </div>
                        </Col>
                    </Row>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default ItemDetails