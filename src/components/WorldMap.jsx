import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import axios from "axios";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Select from "react-select";
import "leaflet/dist/leaflet.css";

countries.registerLocale(enLocale);

// Helper to map ISO2 to ISO3 codes (World Bank uses ISO2, geojson ISO3)
const iso2to3 = {
  AF: "AFG",
  AL: "ALB",
  DZ: "DZA",
  // add all needed mappings here or import a complete map from somewhere
  IN: "IND",
  US: "USA",
  DE: "DEU",
  MV: "MDV",
  // ... ideally import a complete list or build programmatically
};

// Color scale for GDP (in USD)
const getColor = (value) => {
  if (!value) return "#ccc"; // no data - gray
  return value > 1e12
    ? "#00429d"
    : value > 5e11
    ? "#4771b2"
    : value > 1e11
    ? "#73a2c6"
    : value > 1e10
    ? "#a5d5d8"
    : value > 1e9
    ? "#ffffe0"
    : value > 1e8
    ? "#fdae61"
    : value > 1e7
    ? "#f46d43"
    : value > 1e6
    ? "#d73027"
    : "#a50026";
};

const metricsOptions = [
  { value: "NY.GDP.MKTP.CD", label: "GDP (current US$)" },
  // You can add more metrics here
];

const WorldMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [countryGDP, setCountryGDP] = useState({});
  const [selectedMetric, setSelectedMetric] = useState(metricsOptions[0]);

  // Load GeoJSON countries
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("Failed to load geojson:", err));
  }, []);

  // Fetch GDP data from World Bank API for 2021
 useEffect(() => {
  const fetchGDP = async () => {
    try {
      const url = `https://api.worldbank.org/v2/country/all/indicator/${selectedMetric.value}?format=json&date=2021&per_page=300`;
      const response = await axios.get(url);
      if (response.data && response.data[1]) {
        const data = response.data[1];
        const mappedData = {};
        data.forEach((item) => {
          const iso2 = item.country.id;
          const iso3 = countries.alpha2ToAlpha3(iso2);
          if (iso3 && item.value != null) {
            mappedData[iso3.toUpperCase()] = item.value;
            console.log(`Mapped: ${iso2} -> ${iso3.toUpperCase()} with GDP: ${item.value}`);
          }
        });
        setCountryGDP(mappedData);
      } else {
        console.warn("No GDP data found");
      }
    } catch (error) {
      console.error("Error fetching GDP data:", error);
    }
  };

  fetchGDP();
}, [selectedMetric]);

const onEachCountry = (feature, layer) => {
  const iso3 = feature.properties.iso_a3 ? feature.properties.iso_a3.toUpperCase() : null;
const value = iso3 ? countryGDP[iso3] : null;
  const color = getColor(value);
    console.log(`Country: ${feature.properties.name}, GDP: ${value}`);

  layer.setStyle({
    fillColor: color,
    fillOpacity: 0.7,
    color: "#555",
    weight: 1,
  });

  const gdpText = value ? `$${value.toLocaleString()}` : "Data not available";
  layer.bindTooltip(`<b>${feature.properties.name}</b><br/>${selectedMetric.label}: ${gdpText}`, {
    sticky: true,
  });

  layer.on({
    mouseover: (e) => {
      e.target.setStyle({
        weight: 3,
        color: "#333",
        fillOpacity: 0.9,
      });
    },
    mouseout: (e) => {
      e.target.setStyle({
        weight: 1,
        color: "#555",
        fillOpacity: 0.7,
      });
    },
  });
};

  return (
    <div className="card p-4" style={{ backgroundColor: "#222", color: "white" }}>
      <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
        🌍 World Map - Country GDP (2021)
      </h2>

      <div style={{ marginBottom: "1rem", maxWidth: "300px" }}>
        <Select
          options={metricsOptions}
          value={selectedMetric}
          onChange={setSelectedMetric}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#333",
              color: "white",
              borderColor: "#555",
            }),
            singleValue: (base) => ({ ...base, color: "white" }),
            menu: (base) => ({ ...base, backgroundColor: "#333", color: "white" }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#555" : "#333",
              color: "white",
            }),
          }}
          isSearchable={false}
        />
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "600px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachCountry} />}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
