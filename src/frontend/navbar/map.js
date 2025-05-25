import React, { useEffect, useRef, useState } from "react";
import { loadModules } from "esri-loader";
import "./map.css";
import Navbar from "../navbar";
import Footer from "../footer";

const Map = () => {
  const mapRef = useRef(null);
  const [view, setView] = useState(null);
  const [layer, setLayer] = useState(null);
  const [filter, setFilter] = useState("null");

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
            layer.refresh();
          }
        });
      })
      .catch(err => console.error("ArcGIS API loading error: ", err));

    return () => {
      if (view) view.destroy();
    };
  }, []);

  const findNearMe = () => {
    if (!view) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        view.goTo({
          center: [coords.longitude, coords.latitude],
          zoom: 14
        });
      },
      (err) => console.error("Error getting location", err)
    );
  };

  const filterByCategory = (categorie) => {
    if (!layer) return;
    layer.definitionExpression = categorie !== 'null' ? `categorie = '${categorie}'` : null;
  };

  return (
    <div className="map-page">
      <Navbar />

      <div className="map-container-with-footer">
        <div className="map-content" ref={mapRef}></div>

        <div className="filter-box">
          <h2>Map Filters</h2>
          <p>Find clinics, parks, and hotels for pets.</p>
          <button onClick={findNearMe}>Nearby</button>
          <select
            value={filter}
            onChange={(e) => {
              const selected = e.target.value;
              filterByCategory(selected);
              setFilter(selected);
            }}
          >
            <option value="null">All types</option>
            <option value="clinica">Clinics</option>
            <option value="parc">Parks</option>
            <option value="hotel">Hotels</option>
          </select>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Map;
