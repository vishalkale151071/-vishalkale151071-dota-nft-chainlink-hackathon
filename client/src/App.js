import React, { Component,} from "react";
import Dota from "./contracts/Dota.json";
import getWeb3 from "./components/getWeb3";
import { Switch, Route, BrowserRouter as Router} from "react-router-dom";
import "./App.css";
import "./components/styles/bg.css"
import './components/styles/footer.css'
import Home from "./components/home";
import Header from "./components/navbar";
import Heros from "./components/Heros";
import Footer from "./components/Footer";
import Items from "./components/Items";
import HeroDetails from "./components/HeroDetails";
import EquipItem from "./components/EquipItem";
import ItemDetails from "./components/ItemDetails";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Dota.networks[networkId];
      const instance = new web3.eth.Contract(
        Dota.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log("contract address : ",instance._address);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;
    // await contract.methods.withdrawLink().send({from: accounts[0]})
    // await contract.methods.requestHero(123456, "Peekaboo").send({from: accounts[0]});
    // await contract.methods.requestHero(345612, "Rexy").send({from: accounts[0]});
    // await contract.methods.requestHero(561234, "Woody").send({from: accounts[0]});
    // await contract.methods.requestItem(561234).send({from: accounts[0]});
    // await contract.methods.requestItem(213561234).send({from: accounts[0]});
    // await contract.methods.requestItem(52361234).send({from: accounts[0]});
    // await contract.methods.requestItem(5641234).send({from: accounts[0]});
    // await contract.methods.requestItem(56211234).send({from: accounts[0]});
    // await contract.methods.requestItem(56132234).send({from: accounts[0]});
    // await contract.methods.requestItem(561123234).send({from: accounts[0]});
  };

  render() {
    if (!this.state.web3) {
      return(<div>Loading Web3, accounts, and contract...</div>);
    }
    return (
      <div className="main">
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <Router>
          <Header account={this.state.accounts[0]}/>
          <Switch>
            <Route path = '/' exact component={() => (<Home account={this.state.accounts[0]} contract={this.state.contract}></Home>)}></Route>
            <Route path = '/heroes' exact component={() => (<Heros account={this.state.accounts[0]} contract={this.state.contract}/>)}></Route>
            <Route path = '/heroes/:id' exact component={() => (<HeroDetails contract={this.state.contract} account={this.state.accounts[0]}/>)}></Route>
            <Route path = '/hero/equip/:id' exact component={() => (<EquipItem contract={this.state.contract} account={this.state.accounts[0]}/>)}></Route>
            <Route path = '/items' exact component={() => (<Items account={this.state.accounts[0]} contract={this.state.contract}/>)}></Route>
            <Route path = '/items/:id' exact component={() => (<ItemDetails account={this.state.accounts[0]} contract={this.state.contract}/>)}></Route>
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
