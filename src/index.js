import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store'; // Імпортуйте Redux store
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Обгортка Redux */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
