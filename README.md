# Polygon Map Engine
### A High-Performance Geospatial Mapping Toolkit

> **Created & Maintained by:** Anselm Wrenna ([@anselm1234-eng](https://github.com/anselm1234-eng))

**Polygon** is a modern, performant, and framework-agnostic geospatial mapping engine built from the ground up. Designed to handle complex data visualizations without the massive file bloat of traditional SVG maps, Polygon utilizes **GeoJSON** and **D3.js** to render interactive, data-rich world maps instantly in the browser.

Whether you are building a data dashboard, a strategy game, or an interactive article, Polygon provides the tools to create stunning map experiences with a beautiful, built-in UI.

---

## 📖 Table of Contents
1. [Features](#-features)
2. [Architecture & Tech Stack](#-architecture--tech-stack)
3. [Installation & Quick Start](#-installation--quick-start)
4. [Advanced API Methods](#-advanced-api-methods)
5. [Data Architecture & Drill-Down](#-data-architecture--drill-down)
6. [Roadmap](#-roadmap)
7. [License](#-license)

---

## 🌟 Features

Polygon is packed with features designed for modern web applications and data journalists.

*   **Lightning Fast Rendering**: Powered by D3-geo. No massive DOM nodes—just pure, calculated vector paths dynamically drawn from GeoJSON data.
*   **TypeScript First**: Fully typed API for a flawless developer experience and autocomplete support.
*   **Multiple Projections**: Switch seamlessly between 2D map projections (Natural Earth, Mercator, Equirectangular) and a fully interactive **3D Orthographic Globe**.
*   **Modern UI Built-in**: Ships with a sleek, draggable glassmorphism control panel, animated space background (for globe mode), and native dark/light mode support.
*   **Dynamic Drill-Down**: Click on major countries (USA, Russia, Canada, etc.) to dynamically fetch, filter, and render their internal provinces/states.
*   **Live Data Integration**: A built-in API connector fetches real-time population data to instantly update map colors.
*   **Data Export**: Export the current map state as a high-res **PNG**, a scalable **SVG**, or raw data as a **CSV**.
*   **Custom Overlays**: Built-in support for animated **Trade Routes (Arcs)**, pulsing **Geopolitical Event markers**, and custom Lat/Lng **Markers**.
*   **Comparison Mode**: Select up to 5 countries to generate a real-time D3 bar chart comparison.
*   **Smart Tooltips**: Hover over countries to see population sparklines (mini charts), official languages, civilization history, and top 3 religions (with intelligent color-coding for major world religions).
*   **Framework-Agnostic**: Use it in Vanilla JS, or use our included **React Wrapper** for seamless integration.

---

## 🏗️ Architecture & Tech Stack

Polygon uses a modern modular architecture designed for speed and scalability:

*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Mapping Engine**: [D3.js](https://d3js.org/) (`d3-geo`, `d3-selection`, `d3-zoom`, `d3-drag`, `d3-scale`, `d3-shape`)
*   **Data Format**: [GeoJSON](https://geojson.org/) / TopoJSON

By rendering GeoJSON through D3, the browser calculates paths dynamically on the fly, making it infinitely scalable, highly performant, and far lighter on memory than traditional SVG map libraries.

---

## 🚀 Installation & Quick Start

### NPM (Recommended)
```bash
npm install polygon-map-engine

---

🛠️ Usage (Vanilla JS / TypeScript)
typescript
import { PolygonMap } from 'polygon-map-engine';

// Ensure you have a container div in your HTML
// <div id="my-map" style="width: 100vw; height: 100vh;"></div>

const map = new PolygonMap('my-map');
⚛️ Usage (React)
A dedicated React wrapper is included for seamless integration into React applications.

tsx
import React from 'react';
import { PolygonMapReact } from 'polygon-map-engine/dist/PolygonMapReact';

const App = () => {
    return (
        <div>
            <PolygonMapReact width="100vw" height="100vh" />
        </div>
    );
};

export default App;
🔧 Advanced API Methods
The PolygonMap class exposes several powerful methods that you can call from your application to control the map programmatically.

fetchLiveData()
Asynchronously fetches up-to-date population data from the REST Countries API, recalculates the color scale, and updates the map instantly.

toggleCompareMode(forceState?: boolean)
Activates or deactivates the Comparison Mode panel. Users can click up to 5 countries to generate a live D3 bar chart comparing their populations.

drillDown(countryCode: string)
Manually triggers the province drill-down logic. It fetches the global 10m Natural Earth administrative boundary dataset, filters it for the specific country code, and changes the map view to show internal provinces.

resetToWorld()
Reverts the map from a drilled-down province state back to the global world view.

exportCSV()
Generates a CSV file containing the loaded country data (Code, Name, Region, Population, Sovereignty).

downloadPNG() / downloadSVG()
Exports the current map state as an image or vector file.

🗺️ Data Architecture & Drill-Down
Polygon cleanly separates the geometry (the shapes) from the metadata (the statistics).

Map Geometry (world.geojson): Loaded dynamically. D3 handles the projection and fits it perfectly to your screen.

Country Metadata (public/data/country-data.json): Contains ISO codes, names, population, sovereignty, and nested province/state data.

Events Layer (public/data/events.json): A custom GeoJSON feature collection used to plot pulsing markers for recent geopolitical events.

The Province Drill-Down System
When a user clicks a country, the engine automatically fetches the highly detailed 10m Natural Earth Global Administrative Boundaries dataset, filters it to the clicked country, changes the projection to geoMercator, and renders the provinces as new interactive SVG paths.

Time Controls & Sparklines
Polygon features a built-in timeline slider to visualize historical population growth. Hovering over countries generates an inline D3 line chart based on historical data. The sparklines use a Seeded Random Generator so every country has a unique, historically plausible curve that remains consistent across renders.

📝 Roadmap
☑ Implement TypeScript support.
☑ Add nested province data support.
☑ Add 3D Orthographic Globe with drag-to-rotate.
☑ Add custom Geopolitical Event overlays.
☑ Add Live Data integration (REST Countries API).
☑ Add Comparison Mode (Bar Charts).
☑ Add Data Export (PNG, SVG, CSV).
☑ Add Custom GeoJSON Uploader.
☑ Build React Wrapper.
□ Future: Implement WebGL rendering for incredibly large custom GeoJSON datasets.
□ Future: Add real-time WebSocket support for live event tracking.
□ Future: Add Vue and Svelte wrappers.

📄 License
Polygon Map Engine is available under the MIT license.

Copyright (c) 2026 Anselm Wrenna.