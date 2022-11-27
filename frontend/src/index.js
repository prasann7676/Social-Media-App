import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux';
import store from './store';
//We have to use provider for using react-alert as well
// This is used as a custom template for alerts
import {Provider as AlertProvider,positions,transitions} from 'react-alert';
import AlertTemplate  from 'react-alert-template-basic';

//These are options for react alert template
const options={
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  transition: transitions.SCALE
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // This provider is to rap the store to all components of <app />.
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <App />
      </AlertProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
