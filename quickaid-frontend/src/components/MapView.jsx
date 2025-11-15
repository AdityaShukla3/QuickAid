import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function MapView({ lat, lng }) {
  return (
    <APIProvider apiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <Map
        style={{ height: "300px" }}
        defaultZoom={14}
        defaultCenter={{ lat, lng }}
      >
        <Marker position={{ lat, lng }} />
      </Map>
    </APIProvider>
  );
}
