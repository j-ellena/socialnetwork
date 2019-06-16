import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import reduxPromise from 'redux-promise';
import { init } from './socket';
import reducer from './reducers';
import Welcome from './Welcome';
import App from './App';

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);


ReactDOM.render(
    (location.pathname === '/welcome')
        ? <Welcome />
        : (
            init(store),
            (
                <Provider store={store}>
                    <App />
                </Provider>
            ))
    ,
    document.querySelector('main')
);
