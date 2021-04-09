import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import HeroCard from './HeroCard';
import Button from 'react-bootstrap/Button';
import  Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../components/styles/owner.css';

const HeroDetails = ({contract, account}) => {
    const {id} = useParams();
    const history = useHistory();
    const[metaData, setHeroMetaData] = useState(null);
    const [owner, setOwner] = useState('')

    useEffect(() => {
        fetch("https://gateway.pinata.cloud/ipfs/QmVNdiUfYGZhfAcBpFj87KmaYDU9rbSU25Wjgnu1aJHwDu")
        .then(response => response.json())
        .then((data) => {
            setHeroMetaData(data);
            //console.log(data);
        });
    },[])

    useEffect(() => {
        contract.methods.getItemOwner(id).call().then((result) => {
            setOwner(result);
        })
    },[contract.methods, id]);

    function levelUp(_tokenId){
        contract.methods.levelUp(_tokenId).send({from: account});
    }

    function equip(){
        history.push(`/hero/equip/${id}`);
    }

    return(
        <>
            <Row>
                    <h2 className="heading">DOTA heros</h2>
            </Row>
            <Row>
                <Col lg={3} md={6}>
                    <HeroCard key={"H"+id} Id={parseInt(id)} contract={contract} metaData={metaData}/>
                </Col>
                <Col lg={9} md={6}>
                    <div className="owner">
                        <h3>Owned by : {owner}</h3>
                        <hr color="white"></hr>
                        <Button variant="success" onClick={() => levelUp(id)}>
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
                            <Button variant="danger" onClick={() => equip()}>
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
                            <Button variant="primary" onClick={() => equip()}>
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
    )
}

export default HeroDetails