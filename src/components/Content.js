import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./content/Home";
import Level1 from "./content/Level1";
import Contact from "./content/Contact";
 
class Menubar extends Component {
  render() {
    return (
      <HashRouter>
        <div className="row mt-5">
    		<div class="col-sm-2">
	        	<ul className="navbar-nav px-3">
		            <li><NavLink exact to="/">Home</NavLink></li>
		            <li><NavLink to="/level1">Level 1 - Lottery</NavLink></li>
		            <li><NavLink to="/contact">Contact</NavLink></li>
	          	</ul>
	        </div>
	        <div class="col-sm-10 pr-sm-5">
	        	<Route exact path="/" component={Home}/>
	            <Route path="/level1" component={Level1}/>
	            <Route path="/contact" component={Contact}/>
	        </div>
        </div>
      </HashRouter>
    );
  }
}
 
export default Menubar;

// import React, { Component } from 'react'
// // import { connect } from 'react-redux'
// // import { exchangeSelector } from '../store/selectors'
// // import { loadAllOrders, subscribeToEvents } from '../store/interactions'
// // import OrderBook from './OrderBook'
// // import Trades from './Trades'
// // import MyTransactions from './MyTransactions'
// // import PriceChart from './PriceChart'
// // import Balance from './Balance'
// // import NewOrder from './NewOrder'

// class Content extends Component {
//   componentWillMount() {
//     this.loadBlockchainData(this.props)
//   }

//   async loadBlockchainData(props) {
//     const { dispatch, exchange } = props
//     await loadAllOrders(exchange, dispatch)
//     await subscribeToEvents(exchange, dispatch)
//   }

//   render() {
//     return (
//       <div className="content">
//         <div className="vertical-split">
//           <Balance />
//           <NewOrder />
//         </div>
//         <OrderBook />
//         <div className="vertical-split">
//           <PriceChart />
//           <MyTransactions />
//         </div>
//         <Trades />
//       </div>
//     )
//   }
// }

// function mapStateToProps(state) {
//   return {
//     exchange: exchangeSelector(state)
//   }
// }

// export default connect(mapStateToProps)(Content)