import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Circle, Fill, Stroke } from "ol/style";
import { defaults as defaultControls } from "ol/control";
import { MapBrowserEvent } from "ol";
import "../styles/OpenMaps.module.scss";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  showControls?: boolean;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
}

const CanadianMapComponent: React.FC<MapComponentProps> = ({
  center = [-75.6972, 45.4215],
  zoom = 11,
  showControls = true,
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipCoords, setTooltipCoords] = useState<{
    lat: number;
    lng: number;
    x: number;
    y: number;
  } | null>(null);
  const userClickedRef = useRef(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create OSM base layer (fallback for areas without Canadian coverage)
    const osmLayer = new TileLayer({
      source: new OSM(), // Open source map base layer
      // opacity: 0.5, // use to set opacity for optional layers
    });

    // Create Canadian government WMS layer from GeoGratis - optional
    // use 'import TileWMS from "ol/source/TileWMS";'
    // const canadianLayer = new TileLayer({
    //   source: new TileWMS({
    //     url: "https://maps.geogratis.gc.ca/wms/canvec_en",
    //     params: {
    //       LAYERS: "canvec",
    //       TILED: true,
    //       VERSION: "1.3.0",
    //     },
    //     serverType: "geoserver",
    //     transition: 0,
    //   }),
    // });

    // Create map with both layers
    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer], // use canadianLayer optionally in the array
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
      controls: showControls
        ? defaultControls()
        : defaultControls({ zoom: false, rotate: false }),
    });

    // Create marker
    const marker = new Feature({
      geometry: new Point(fromLonLat(center)),
    });

    const markerStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#2563eb" }),
        stroke: new Stroke({ color: "white", width: 2 }),
      }),
    });

    marker.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    // Add click handler
    map.on("click", (evt: MapBrowserEvent<any>) => {
      const coords = toLonLat(evt.coordinate);

      userClickedRef.current = true;

      // Center map on clicked position with animation
      map.getView().animate({
        center: evt.coordinate,
        duration: 500,
      });

      // Update marker position
      if (markerLayerRef.current) {
        const source = markerLayerRef.current.getSource();
        const features = source?.getFeatures();
        if (features && features.length > 0) {
          const geometry = features[0].getGeometry();
          if (geometry instanceof Point) {
            geometry.setCoordinates(evt.coordinate);
          }
        }
      }

      if (onMapClick) {
        onMapClick({
          lng: parseFloat(coords[0].toFixed(6)),
          lat: parseFloat(coords[1].toFixed(6)),
        });
      }
    });

    // Add pointer move handler for tooltip
    map.on("pointermove", (evt: MapBrowserEvent<any>) => {
      const coords = toLonLat(evt.coordinate);
      const pixel = evt.pixel;
      setTooltipCoords({
        lng: parseFloat(coords[0].toFixed(6)),
        lat: parseFloat(coords[1].toFixed(6)),
        x: pixel[0],
        y: pixel[1],
      });
    });

    mapInstanceRef.current = map;
    markerLayerRef.current = vectorLayer;
    setIsLoading(false);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Update center and zoom when props change (only if user hasn't clicked)
  useEffect(() => {
    if (mapInstanceRef.current && !userClickedRef.current) {
      const map = mapInstanceRef.current;
      const view = map.getView();

      view.animate({
        center: fromLonLat(center),
        zoom: zoom,
        duration: 1000,
      });

      if (markerLayerRef.current) {
        const source = markerLayerRef.current.getSource();
        const features = source?.getFeatures();
        if (features && features.length > 0) {
          const geometry = features[0].getGeometry();
          if (geometry instanceof Point) {
            geometry.setCoordinates(fromLonLat(center));
          }
        }
      }
    }
    // Reset the flag when center prop changes (city button clicked)
    userClickedRef.current = false;
  }, [center, zoom]);

  return (
    <div className="relative inner-map-container">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="rounded-lg shadow-lg border border-gray-300"
        style={{ height: "100%", width: "100%" }}
      />
      {tooltipCoords && (
        <div
          className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg pointer-events-none z-20"
          style={{
            left: `${tooltipCoords.x + 15}px`,
            top: `${tooltipCoords.y - 10}px`,
            transform: "translateY(-100%)",
          }}
        >
          <div className="font-mono">
            <div>Lat: {tooltipCoords.lat}</div>
            <div>Lng: {tooltipCoords.lng}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const OpenMaps = () => {
  const [selectedCity, setSelectedCity] = useState<string>("ottawa");
  const [clickedCoords, setClickedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const cities: Record<string, [number, number]> = {
    ottawa: [-75.6972, 45.4215],
    toronto: [-79.3832, 43.6532],
    vancouver: [-123.1207, 49.2827],
    montreal: [-73.5673, 45.5017],
    calgary: [-114.0719, 51.0447],
  };

  return (
    <div className="open-maps-container">
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Canadian Government Open Maps
          </h1>
          <p className="text-gray-600 mb-6">
            Reusable React TypeScript component using OpenLayers
          </p>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select a City:
            </label>
            <div className="flex gap-3 flex-wrap">
              {Object.keys(cities).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCity === city
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <CanadianMapComponent
            center={cities[selectedCity]}
            zoom={11}
            height="500px"
            showControls={true}
            onMapClick={(coords) => setClickedCoords(coords)}
          />

          {clickedCoords && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Last Clicked Location:
              </h3>
              <div className="text-sm text-purple-800 space-y-1">
                <p>
                  <strong>Latitude:</strong> {clickedCoords.lat}
                </p>
                <p>
                  <strong>Longitude:</strong> {clickedCoords.lng}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Installation:</h3>
            <pre className="text-xs text-blue-800 bg-blue-100 p-3 rounded overflow-x-auto">
              npm install ol
            </pre>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Component Props:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <strong>center:</strong> [longitude, latitude] coordinates
              </li>
              <li>
                <strong>zoom:</strong> Initial zoom level (default: 11)
              </li>
              <li>
                <strong>height:</strong> Map height (default: "500px")
              </li>
              <li>
                <strong>width:</strong> Map width (default: "100%")
              </li>
              <li>
                <strong>showControls:</strong> Show/hide map controls (default:
                true)
              </li>
              <li>
                <strong>onMapClick:</strong> Callback function that returns
                clicked coordinates
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenMaps;
export { CanadianMapComponent };

/**
 * Add Canadian government WMS layers to your map:
 *
 * import TileWMS from 'ol/source/TileWMS';
 * const wmsLayer = new TileLayer({
 *     source: new TileWMS({
 *     url: 'https://maps.geogratis.gc.ca/wms/canvec_en',
 *     params: {'LAYERS': 'canvec', 'TILED': true}
 *   })
 * });
 *
 * map.addLayer(wmsLayer);
 */
