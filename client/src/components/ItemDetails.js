import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Row, Col} from 'react-bootstrap';
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
        (metaData) && (<>
            <Row>
                <h2 className="heading">DOTA heros</h2>
            </Row>
            <Row>
                <Col lg={3} md={6}>
                    <ItemCard key={"I"+id} Id={parseInt(id)} contract={contract} metaData={metaData}/>
                </Col>
                <Col lg={9} md={6}>
                    <div className="owner">
                        <h3>Owned by : {owner}</h3>
                        <hr color="white"></hr>
                        <br />
                        <br />
                        <Row>
                        </Row>
                    </div>
                </Col>
            </Row>
        </>)
    );
}

export default ItemDetails