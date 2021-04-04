import React, { useEffect, useState } from 'react';
import '../App.css';
import './styles/style.css';
import HeroCard from './HeroCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ItemCard from './ItemCard';
// import * as heroData from '../metaData/Heros.json'; heros json data from local file
// import * as itemData from '../metaData/Items.json'; items json data from local file

const Home = ({account, contract}) => {

    const [items, setItems] = useState([]); //items to hold all users items
    const [heros, setHeros] = useState([]); //heros to hold all users heros
    const [heroMetaData, setHeroMetaData] = useState(null); // metadata of heros
    const [itemMetaData, setitemMetaData] = useState(null); // metadata od items
    
    useEffect(() => {
        contract.methods.getItemNFTs(account).call((error, result) => {
            if(result){
                setItems(result);
            }
            if(error){
                console.log(error);
            }
        });// get all yours heros

        contract.methods.getHeroNFTs(account).call((error, result) => {
            if(result){
                setHeros(result);
            }
            if(error){
                console.log(error);
            }
        });// get users all items

        //setHeroMetaData(heroData.default); heros json data from local file
        //setitemMetaData(itemData.default); items json data from local file
        fetch("https://gateway.pinata.cloud/ipfs/QmVNdiUfYGZhfAcBpFj87KmaYDU9rbSU25Wjgnu1aJHwDu")
        .then(response => response.json())
        .then(async (data) => {
            await setHeroMetaData(data);
            //console.log(data);
        })

        fetch("https://gateway.pinata.cloud/ipfs/QmRDZDm7zu9kpo2VAdB4GktB9PMKW3SUNJHGLciRoJTfuq")
        .then(response => response.json())
        .then((data) => {
            setitemMetaData(data);
            //console.log(data);
        })
    }, [account, contract.methods])

    async function requestHero(){ // request new hero using provided value
        const seed = parseInt(document.getElementById('heroSeed').value);
        const name = document.getElementById('heroName').value;
        if(!Number.isInteger(seed)){
            alert("Seed must be a Number.");
            return
        }

        contract.methods.requestHero(seed, name).send({from: account}).on('transactionHash', (hash) => {
            console.log("Transaction started : ", hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            console.log('Transaction confirmed : ', confirmationNumber, receipt);
        }).on('error', (error, receipt) => {
            console.log("Transaction Failed", error, receipt);
        });
    }

    async function requestItem(){ // request new item using provided value
        const seed = parseInt(document.getElementById('itemSeed').value);
        if(!Number.isInteger(seed)){
            alert("Seed must be a Number.");
            return
        }

        contract.methods.requestItem(seed).send({from: account}).on('transactionHash', (hash) => {
            console.log("Transaction started : ", hash);
        }).on('confirmation', (confirmationNumber, receipt) => {
            console.log('Transaction confirmed : ', confirmationNumber, receipt);
        }).on('error', (error, receipt) => {
            console.log("Transaction Failed", error, receipt);
        });
    }
    
    return(
        <div>
            <Row>
                <Col>
                    <center>
                        <Form className="seed_form">
                            <Form.Group as={Row} controlId="heroSeed">
                                <Form.Label column sm={2}>Seed value</Form.Label>
                                <Col  sm={10}>
                                    <Form.Control type="text" placeholder="789345902" />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="heroName">
                                <Form.Label column sm={2}>Hero Name</Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="text" placeholder="Mike Tyson" />
                                </Col>    
                            </Form.Group>
                            
                            <Button variant="success" onClick={requestHero}>
                                Create Player
                            </Button>
                        </Form>
                        <hr/>
                        <div className="cards">
                            {(heros) ? (
                                heros.map((hero) => (
                                    <HeroCard key={"H"+hero} Id={parseInt(hero)} metaData={heroMetaData} contract={contract} />
                                ))
                            ) : (
                                <h3>You have not created any hero</h3>
                            )}
                        </div>
                    </center>
                </Col>
                <Col>
                    <center>
                        <Form className="seed_form">
                            <Form.Group as={Row} controlId="itemSeed">
                                <Form.Label column sm={2}>Seed value</Form.Label>
                                <Col  sm={10}>
                                    <Form.Control type="text" placeholder="93459434" />
                                </Col>
                            </Form.Group>
                            
                            <Button variant="success" onClick={requestItem}>
                                Create Item
                            </Button>
                        </Form>
                        <hr/>
                        <div className="cards">
                            {(items) ? (
                                items.map((item) => (
                                    <ItemCard key={"I"+item} Id={parseInt(item)} metaData={itemMetaData} contract={contract} />
                                ))
                            ) : (
                                <h3>You have not created any hero</h3>
                            )}

                        </div>
                    </center>
                </Col>
            </Row>
        </div>
    );
}

export default Home