import React, { useEffect, useState } from 'react';
import '../App.css';
import './styles/style.css';
import HeroCard from './HeroCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ItemCard from './ItemCard';
import Web3 from 'web3';
import swal from 'sweetalert';
// import * as heroData from '../metaData/Heros.json'; heros json data from local file
// import * as itemData from '../metaData/Items.json'; items json data from local file

const Home = ({account, contract}) => {

    const [items, setItems] = useState([]); //items to hold all users items
    const [heros, setHeros] = useState([]); //heros to hold all users heros
    const [heroMetaData, setHeroMetaData] = useState(false); // metadata of heros
    const [itemMetaData, setitemMetaData] = useState(false); // metadata od items
    const [playerLoading, setPlayerLoading] = useState(false);
    const [itemLoading, setItemLoading] = useState(false);
    const animation = (<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>)
    useState(() => {}, [playerLoading, itemLoading]); // for loading animation
    
    useEffect(() => {
        //setHeroMetaData(heroData.default); heros json data from local file
        //setitemMetaData(itemData.default); items json data from local file
         fetch("https://gateway.pinata.cloud/ipfs/QmVNdiUfYGZhfAcBpFj87KmaYDU9rbSU25Wjgnu1aJHwDu")
        .then(response => response.json())
        .then((data) => {
            setHeroMetaData(data);
            //console.log(data);
        })

        fetch("https://gateway.pinata.cloud/ipfs/QmRDZDm7zu9kpo2VAdB4GktB9PMKW3SUNJHGLciRoJTfuq")
        .then(response => response.json())
        .then((data) => {
            setitemMetaData(data);
            //console.log(data);
        })
    }, []);

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
    }, [account, contract.methods])

    async function requestHero(){ // request new hero using provided value
        const seed = parseInt(document.getElementById('heroSeed').value);
        const name = document.getElementById('heroName').value;
        if(!Number.isInteger(seed)){
            alert("Seed must be a Number.");
            return
        }

        contract.methods.requestHero(seed, name).send({from: account, value: Web3.utils.toWei("0.001", 'ether')}).on('error', (error, receipt) => {
            swal({
                icon: "error",
                title: "Oh snap",
                text: `Something went wrong.`
            });
            setPlayerLoading(false);
        });
        
        setPlayerLoading(true);

        await contract.events.HeroCreated(
            {fromBlock:0},
                (error, event) => {
                if(!error){
                    swal({
                        title: "congratulations.",
                        text: `You got ${heroMetaData[(event.returnValues._code).toString()].name}`,
                        button: "Aww yiss!"
                    }).then(() => (window.location.reload()));
                }
            }
        )
    }

    async function requestItem(){ // request new item using provided value
        const seed = parseInt(document.getElementById('itemSeed').value);
        if(!Number.isInteger(seed)){
            alert("Seed must be a Number.");
            return
        }

        contract.methods.requestItem(seed).send({from: account, value: Web3.utils.toWei("0.001", 'ether')}).on('error', (error, receipt) => {
            swal({
                icon: "error",
                title: "Oh snap",
                text: `Something went wrong.`
            });
            setItemLoading(false);
        });
        
        setItemLoading(true);

        await contract.events.ItemCreated(
            {fromBlock:0},
                (error, event) => {
                if(!error){
                    //console.log(event.returnValues._code);
                    swal({
                        title: "congratulations.",
                        text: `You got ${itemMetaData[(event.returnValues._code).toString()].name}`,
                        button: "Aww yiss!"
                    }).then(() => (window.location.reload()));
                }else{
                    console.log(error);
                }
            }
        )
    }
    
    return(
        (heroMetaData && itemMetaData) && (<div>
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
                                {playerLoading && animation} Create Player
                            </Button>
                        </Form>
                        <hr color="white"/>
                        <div className="cards">
                            {(heros.length > 0) ? (
                                heros.map((hero) => (
                                    <HeroCard key={"H"+hero} account={account} Id={parseInt(hero)} metaData={heroMetaData} contract={contract} />
                                ))
                            ) : (
                                <h3>You have not created any heroes</h3>
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
                            {itemLoading && animation} Create Item
                            </Button>
                        </Form>
                        <br />
                        <br />
                        <hr color="white"/>
                        <div className="cards">
                            {(items.length > 0) ? (
                                items.map((item) => (
                                    <ItemCard key={"I"+item} Id={parseInt(item)} metaData={itemMetaData} contract={contract} />
                                ))
                            ) : (
                                <h3>You have not created any Item</h3>
                            )}

                        </div>
                    </center>
                </Col>
            </Row>
        </div>)
        );
}

export default Home