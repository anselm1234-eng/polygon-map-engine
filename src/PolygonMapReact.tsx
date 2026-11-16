import React, { useEffect, useRef } from 'react';
import { PolygonMap } from './main'; 

interface PolygonMapProps {
    width?: string;
    height?: string;
}

export const PolygonMapReact: React.FC<PolygonMapProps> = ({ 
    width = '100vw', 
    height = '100vh' 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (containerRef.current && !mapInstanceRef.current) {
            const uniqueId = `polygon-map-${Math.random().toString(36).substring(2, 9)}`;
            containerRef.current.id = uniqueId;
            
            mapInstanceRef.current = new PolygonMap(uniqueId);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            mapInstanceRef.current = null;
        };
    }, []);

    return (
        <div style={{ position: 'relative', width, height }}>
            {/* The Map Container */}
            <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

            {/* The UI Panels */}
            <div className="navbar">
                <h1>Polygon<span>.</span></h1>
                <div className="search-container">
                    <input type="text" id="search-input" className="search-bar" placeholder="Search country..." autoComplete="off" />
                    <div id="autocomplete-list" className="autocomplete-dropdown"></div>
                </div>
                <button id="theme-toggle" className="theme-toggle-btn" title="Toggle Theme">
                    <svg id="theme-icon" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
                </button>
            </div>

            <div id="loading-overlay">
                <div className="loader-box" id="loader-text">Loading Data...</div>
            </div>

            <div className="ui-panel panel-layers" id="layers-panel">
                <div className="panel-header" id="panel-drag-handle">
                    <h2>Map Controls</h2>
                    <button className="toggle-btn" onClick={() => document.getElementById('layers-panel')?.classList.toggle('collapsed')}>−</button>
                </div>
                <div className="panel-content">
                    <button id="back-btn" className="action-btn back-btn" onClick={() => mapInstanceRef.current?.resetToWorld()}>← Back to World Map</button>

                    <select id="projection-select" className="form-select">
                        <option value="geoNaturalEarth1">Natural Earth (Default)</option>
                        <option value="geoMercator">Mercator</option>
                        <option value="geoEquirectangular">Equirectangular</option>
                        <option value="geoOrthographic">Orthographic (Globe)</option>
                    </select>

                    <div className="layer-toggle" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        <span style={{ color: 'var(--compare-gold)' }}>Compare Mode (Max 5)</span>
                        <label className="switch"><input type="checkbox" id="compare-checkbox" /><span className="slider" style={{ '--accent-teal': 'var(--compare-gold)' } as React.CSSProperties}></span></label>
                    </div>

                    <div className="layer-toggle"><span>Show Labels</span><label className="switch"><input type="checkbox" id="labels-checkbox" /><span className="slider"></span></label></div>
                    <div className="layer-toggle"><span>Show Antarctica</span><label className="switch"><input type="checkbox" id="antarctica-checkbox" defaultChecked /><span className="slider"></span></label></div>
                    <div className="layer-toggle"><span>Show Microstates</span><label className="switch"><input type="checkbox" id="microstates-checkbox" defaultChecked /><span className="slider"></span></label></div>
                    <div className="layer-toggle"><span>Show Ocean</span><label className="switch"><input type="checkbox" id="ocean-checkbox" defaultChecked /><span className="slider"></span></label></div>
                    <div className="layer-toggle"><span>Recent Events</span><label className="switch"><input type="checkbox" id="events-checkbox" /><span className="slider"></span></label></div>
                    <div className="layer-toggle"><span>Trade Routes (Arcs)</span><label className="switch"><input type="checkbox" id="arcs-checkbox" /><span className="slider"></span></label></div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <button className="action-btn" onClick={() => mapInstanceRef.current?.downloadPNG()}>Export PNG</button>
                        <button className="action-btn" onClick={() => mapInstanceRef.current?.downloadSVG()}>Export SVG</button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button className="action-btn" style={{ background: '#3B82F6' }} onClick={() => mapInstanceRef.current?.exportCSV()}>Export CSV</button>
                        <button className="action-btn" style={{ background: '#10B981' }} onClick={() => mapInstanceRef.current?.fetchLiveData()}>Fetch Live Data</button>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                        <button className="action-btn" style={{ background: '#64748B', marginTop: 0 }} onClick={() => mapInstanceRef.current?.resetView()}>Reset View</button>
                        <button className="action-btn" style={{ background: '#8B5CF6' }} onClick={() => document.getElementById('file-upload')?.click()}>Upload GeoJSON</button>
                        <input type="file" id="file-upload" style={{ display: 'none' }} accept=".json,.geojson" />
                    </div>

                    <div className="legend-container">
                        <div className="legend-title">Population Groups</div>
                        <div className="legend-scale">
                            <div className="legend-item"><div className="color-box" style={{ background: '#EF4444' }}></div> Over 500 Million</div>
                            <div className="legend-item"><div className="color-box" style={{ background: '#1E40AF' }}></div> 100M - 500M</div>
                            <div className="legend-item"><div className="color-box" style={{ background: '#4ADE80' }}></div> 50M - 100M</div>
                            <div className="legend-item"><div className="color-box" style={{ background: '#FDE047' }}></div> 10M - 50M</div>
                            <div className="legend-item"><div className="color-box" style={{ background: '#FEF08A' }}></div> Under 10 Million</div>
                            <div className="legend-item"><div className="color-box" style={{ background: '#334155' }}></div> No Data</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="time-controls">
                <button className="time-play-btn" id="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
                <input type="range" className="time-slider" id="time-slider" min="0" max="5" defaultValue="5" step="1" />
                <div className="time-date" id="time-date">2026</div>
                <div className="time-extra">
                    <select id="speed-select" className="time-speed">
                        <option value="2500">0.5x</option>
                        <option value="1200" defaultValue="1200">1x</option>
                        <option value="600">2x</option>
                    </select>
                    <label className="loop-label"><input type="checkbox" id="loop-checkbox" /> Loop</label>
                </div>
            </div>

            <div className="floating-actions">
                <button className="floating-btn" id="fullscreen-btn" title="Toggle Fullscreen" onClick={() => {
                    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                    else if (document.exitFullscreen) document.exitFullscreen();
                }}><svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg></button>
            </div>

            <div className="compare-panel" id="compare-panel">
                <div className="compare-header">
                    <h3>Country Comparison</h3>
                    <button className="compare-close" onClick={() => mapInstanceRef.current?.toggleCompareMode(false)}>×</button>
                </div>
                <div className="compare-body">
                    <svg id="compare-chart" width="100%" height="100%"></svg>
                </div>
            </div>

            <div id="map-tooltip" className="tooltip"></div>
        </div>
    );
};