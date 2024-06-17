import React from 'react';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Routing from './Routing/Routing';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Routing />
)

reportWebVitals();
