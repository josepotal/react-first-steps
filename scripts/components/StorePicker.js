/*
  StorePicker
  make  <StorePicker/>
*/

import React from 'react';
import { History } from 'react-router';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';


@autobind
class StorePicker extends React.Component {

  goToStore(event) {
    event.preventDefault();
    //get data from input
    var storeId = this.refs.storeId.value 
    //go to app
    this.history.pushState(null, `/store/${storeId}`);
  }

  render() {
    return (
      <form className="store-selector" onSubmit = {this.goToStore}>
        <h2>Please enter a store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
        <input type="Submit" />
      </form>
      )
  }
}

reactMixin.onClass(StorePicker, History)


export default StorePicker;