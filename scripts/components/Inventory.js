/*
  Inventory
  <Inventory/>
*/

import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';

import firebase from 'firebase';
import config from '../firebaseConfig';

firebase.initializeApp(config)

@autobind
class Inventory extends React.Component {
  
  constructor() {
    super();
    this.state = {
      uid: ''
    }
  }

  authenticate() {
    console.log("Trying to auth with" )
    const provider = new firebase.auth.GithubAuthProvider()
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log(result.user)

      console.log(this.props.params.storeId)
      const storeRef = firebase.database().ref(`${this.props.params.storeId}`)
      console.log(storeRef)

      storeRef.on('value', (snapshot) => {
        console.log(snapshot)
        var data = snapshot.val() || {}
        console.log(data)
        if(!data.owner) {
          storeRef.set({
            owner : result.user.uid
          })
        }
        this.setState ({
          uid: result.user.uid,
          owner : data.owner || result.user.uid
        })
      })
    }).catch(error => console.log(`Error: ${error.code}: ${error.message}`))

  }


  renderLogin () {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={this.authenticate}>Log In with Github</button>
      </nav>
    )
  }

  renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
          <input type="text" valueLink={linkState('fishes.'+ key +'.name')} />
          <input type="text" valueLink={linkState('fishes.'+ key +'.price')} />
          <select valueLink={linkState('fishes.'+ key +'.status')}>
              <option value ="unavailable">Sold Out!</option>
              <option value ="available">Fresh!</option>
          </select>
          <textarea type="text" valueLink={linkState('fishes.'+ key +'.desc')}></textarea>
          <input type="text" valueLink={linkState('fishes.'+ key +'.image')} />
          <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    let logoutButton = <button>Log Out!</button>

    // check if they are logged in
    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }
    //check if they are the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store</p>
          {logoutButton}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
    addFish : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    fishes : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeFish : React.PropTypes.func.isRequired
}

export default Inventory;