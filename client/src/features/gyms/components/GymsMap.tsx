import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Gym, NearbyGymsCoordinates } from "../types/gym_types";

function makeCircleIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;background:${color};border:2.5px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.45);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -14],
  });
}

const USER_ICON = makeCircleIcon("#3b82f6");
const GYM_ICON = makeCircleIcon("#1f8a50");
const GYM_ICON_ACTIVE = makeCircleIcon("#34d399");

type BoundsControllerProps = {
  coordinates: NearbyGymsCoordinates;
  gyms: Gym[];
};

function BoundsController({ coordinates, gyms }: BoundsControllerProps) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [
      [coordinates.lat, coordinates.lng],
      ...gyms.map((g): [number, number] => [g.lat, g.lng]),
    ];

    if (points.length === 1) {
      map.setView([coordinates.lat, coordinates.lng], 14);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48] });
    }
  }, [map, coordinates, gyms]);

  return null;
}

type GymsMapProps = {
  coordinates: NearbyGymsCoordinates;
  gyms: Gym[];
  selectedGymId: string | null;
  onSelectGym: (id: string) => void;
};

export default function GymsMap({ coordinates, gyms, selectedGymId, onSelectGym }: GymsMapProps) {
  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsController coordinates={coordinates} gyms={gyms} />
      <Marker position={[coordinates.lat, coordinates.lng]} icon={USER_ICON}>
        <Popup>Your location</Popup>
      </Marker>
      {gyms.map((gym) => {
        const key = gym.id || `${gym.name}-${gym.lat}-${gym.lng}`;
        const isActive = gym.id === selectedGymId;
        return (
          <Marker
            key={key}
            position={[gym.lat, gym.lng]}
            icon={isActive ? GYM_ICON_ACTIVE : GYM_ICON}
            eventHandlers={{ click: () => onSelectGym(gym.id) }}
          >
            <Popup>
              <strong>{gym.name || "Gym"}</strong>
              {gym.address && (
                <>
                  <br />
                  {gym.address}
                </>
              )}
              {gym.rating != null && (
                <>
                  <br />
                  Rating: {gym.rating.toFixed(1)}
                </>
              )}
              <br />
              {gym.open_now === true
                ? "Open now"
                : gym.open_now === false
                ? "Closed now"
                : "Hours unavailable"}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
