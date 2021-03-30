import React, { useEffect, useState } from 'react';
import '../App.css';
import HeroCard from './HeroCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './styles/style.css';
import Form from 'react-bootstrap/Form';
import ItemCard from './ItemCard';
const Home = ({account, contract}) => {

    const [items, setItems] = useState([]);
    const [heros, setHeros] = useState([]);
    useEffect(() => {
        contract.methods.getItemNFTs(account).call((error, result) => {
            if(result){
                setItems(result);
            }
            if(error){
                console.log(error);
            }
        });

        contract.methods.getHeroNFTs(account).call((error, result) => {
            if(result){
                setHeros(result);
            }
            if(error){
                console.log(error);
            }
        });
    }, [account, contract.methods])

    async function requestHero(){
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

    async function requestItem(){
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
                        <Form>
                            <Form.Group as={Row} controlId="heroSeed">
                                <Form.Label column sm={2}>Seed value</Form.Label>
                                <Col  sm={10}>
                                    <Form.Control type="text" placeholder="78934590243789234789345" />
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
                            {heros.map((hero) => (
                                <HeroCard key={"H"+hero} Id={parseInt(hero)} contract={contract} />
                            ))}
                        </div>
                    </center>
                </Col>
                <Col>
                    <center>
                        <Form>
                            <Form.Group as={Row} controlId="itemSeed">
                                <Form.Label column sm={2}>Seed value</Form.Label>
                                <Col  sm={10}>
                                    <Form.Control type="text" placeholder="9345902434578923478978" />
                                </Col>
                            </Form.Group>
                            
                            <Button variant="success" onClick={requestItem}>
                                Create Item
                            </Button>
                        </Form>
                        <hr/>
                        <div className="cards">
                            {items.map((item) => (
                                <ItemCard key={"I"+item} Id={parseInt(item)} contract={contract} />
                            ))}
                        </div>
                    </center>
                </Col>
            </Row>
        </div>
    );
}

export default Home