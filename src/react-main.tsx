import React from 'react';
import { createRoot } from 'react-dom/client';
import { PolygonMapReact } from './PolygonMapReact';
import './style.css'; // <-- Import the CSS

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <PolygonMapReact width="100vw" height="100vh" />
        </React.StrictMode>
    );
}