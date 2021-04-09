import React, { useEffect, useState } from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import { useHistory } from 'react-router';
import '../components/styles/owner.css'
const Inventory = ({ contract, id}) => {
    const [inventory, setInventory] = useState([]);
    const [ids, setIds] = useState([]);
    const [itemMetaData, setitemMetaData] = useState(false);
    const history = useHistory();
    useEffect(() => {
        fetch("https://gateway.pinata.cloud/ipfs/QmRDZDm7zu9kpo2VAdB4GktB9PMKW3SUNJHGLciRoJTfuq")
        .then(response => response.json())
        .then((data) => {
            setitemMetaData(data);
            //console.table(data);
        })
    },[])
    
    useEffect(() => {
        contract.methods.getEquippedItems(id).call().then((result) => {
            setInventory(result[1]);
            setIds(result[0])
            console.table(result);
        })
    },[contract.methods, id]);

    function goToDetails(_id) {
        history.push(`/items/${_id}`);
    }
    return(
        (inventory.length > 0 && itemMetaData) && (
            <Container>
            <h4>Inventory</h4>
            <Row className="slots">
                {inventory.map((item, index) => (
                    <Col  className='inventory' key={index+"Inv"+item} sm={3}>
                        <img onClick={() => goToDetails(ids[index])} className="slot" src={itemMetaData[item].image} alt={itemMetaData[item].image} title={`${itemMetaData[item].name}\n${itemMetaData[item].description}`}/>
                    </Col>
                ))}
            </Row>
        </Container>
        )
    );
}

export default Inventory