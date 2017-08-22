import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import random from 'lodash/random';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import { enableBatching } from 'redux-batched-actions';
import { Provider } from 'react-redux';

import './styles/app.scss';
import App from './containers/app'
import reducers from './reducers';

const store = createStore(
	enableBatching( reducers ),
	compose(
	applyMiddleware(thunk)//,
	//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
		)
	);
// store.dispatch(createLevel(1));
// store.dispatch(setDungeonLevel(1));

ReactDOM.render(
	<Provider store = {store}>
		<App />
	</Provider>,
	document.getElementById('root'));