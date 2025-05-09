import React, { useEffect, useRef, useState } from "react";
import {Link} from "react-router-dom"
import { loadModules } from "esri-loader";
import "./map.css"

const Map = () => {

    const mapRef = useRef(null);
    const [view, setView] = useState(null);
    const [layer, setLayer] = useState(null);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        let view;

        loadModules(["esri/WebMap", "esri/views/MapView"], { css: true })
        .then(([WebMap, MapView]) => {
            const webmap = new WebMap({
            portalItem: {
                id: "c791b507525b4d4795270002b3f2c003"
            }
            });

            view = new MapView({
            container: mapRef.current,
            map: webmap,
            center: [26.1, 44.4],
            zoom: 12 
            });

            setView(view);
            view.when(() => {
                const layer = view.map.allLayers.items.find(l => l.type === "feature");
                setLayer(layer);
                if (layer) {
                    layer.refresh(); // Aici layer e FeatureLayer-ul din WebMap
                }
            });
        })
        .catch(err => console.error("ArcGIS API loading error: ", err));

        return () => {
        if (view) {
            view.destroy();
        }
        };
    }, []);

    const findNearMe = () => {
        if (!view)
            return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                view.goTo({
                    center: [longitude, latitude],
                    zoom: 14
                });
            },
            (err) => {
                console.error("Error getting location", err);
            }
        );
    };

    const filterByCategory = (categorie) => {
        if (!layer)
            return;

        if (categorie !== 'null') {
            layer.definitionExpression = `categorie = '${categorie}'`;
        } else {
            layer.definitionExpression = null;
        }
    };

    return (
        <div className="map-page">
            <nav className="navbar-map">
                <div className="logo-map">
                    MyVet
                </div>
                <div className="navbar-map-buttons">
                    <Link to="/about" className="nav-map-button">
                        About Us
                    </Link>
                    <Link to="/petinfo" className="nav-map-button">
                        Find more about your pet!
                    </Link>
                    <Link to="/pharmacy" className="nav-map-button">
                        Pharmacy&Accesories
                    </Link>
                    <Link to="/" className="nav-map-button">
                        Home
                    </Link> 
                </div>
                <div className="auth-map-buttons">
                    <Link to="/login" className="login-map-button">
                        Login
                    </Link>
                    <Link to="/accountType" className="sign-up-map-button">
                        Sign up
                    </Link>
                </div>
            </nav>
            <div className="content-map">
                <div className="left-content">
                    <h1>Check Out Our Cool Map!</h1>
                    <p>Discover a world of care and fun! From trusted clinics and animal hospitals to joyful parks and comfortable hotels — everything your furry friend could ever dream of!</p>
                    <div className="filter-buttons">
                        <button onClick={findNearMe}>Nearby Locations</button>
                        <select value={filter} onChange={(e) => {const selectedFilter = e.target.value;
                                                                 filterByCategory(selectedFilter);
                                                                 setFilter(selectedFilter)}} >
                            <option value="null">Choose location type</option>
                            <option value="clinica">Clinics</option>
                            <option value="parc">Parks</option>
                            <option value="hotel">Hotels</option>
                        </select>                    
                    </div>
                </div>
                <div className="right-map" ref={mapRef}></div>
            </div>
            <footer className="footer">
                <div className="footer-column">
                    <h2 className="footer-logo">MyVet</h2>
                    <p>+40 712 345 678</p>
                    <p>support@myvet.com</p>
                    <p>Str. Animăluțelor nr. 5, București</p>
                    <div className="social-icons">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagini/instagram.png" alt="Instagram" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagini/facebook.png" alt="Facebook" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <img src="/imagini/tiktok.png" alt="TikTok" />
                    </a>
                    </div>
                </div>

                <div className="footer-column">
                   <ul className="quick-links">
                   <h4>Quick Links</h4>    
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/petinfo">Find more about your pet!</a></li>
                    <li><a href="/pharmacy">Pharmacy</a></li>
                    <li><a href="/">Home</a></li>
                    </ul>       
                </div>

                <div className="footer-column">
                    <ul className="quick-links">
                    <li><a href="/privacypolicy">Privacy Policy</a></li>
                    <li><a href="/accessibility">Accessibility</a></li>
                    <li><a href="/terms">Terms & Conditions</a></li>
                    </ul>
                    <p className="copyright">© 2025 by MyVet</p>
                </div>
            </footer>
        </div>
    )
};

export default Map;
