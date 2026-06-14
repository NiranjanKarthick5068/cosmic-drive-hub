import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type LatLng = { lat: number; lng: number };

export function LiveMap({
  pickup,
  drop,
  driver,
  className,
}: {
  pickup: LatLng;
  drop: LatLng;
  driver?: LatLng | null;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const pathRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([pickup.lat, pickup.lng], 14);
    mapRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19, subdomains: "abcd" },
    ).addTo(map);

    const pickupIcon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;border-radius:9999px;background:oklch(0.86 0.21 130);box-shadow:0 0 0 4px oklch(0.86 0.21 130 / 0.3)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    const dropIcon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;border-radius:4px;background:oklch(0.65 0.25 295);box-shadow:0 0 0 4px oklch(0.65 0.25 295 / 0.3)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    const driverIcon = L.divIcon({
      className: "",
      html: `<div style="width:22px;height:22px;border-radius:9999px;background:oklch(0.65 0.25 295);border:3px solid white;box-shadow:0 0 16px oklch(0.65 0.25 295 / 0.8)"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(map);
    L.marker([drop.lat, drop.lng], { icon: dropIcon }).addTo(map);

    pathRef.current = L.polyline(
      [
        [pickup.lat, pickup.lng],
        [drop.lat, drop.lng],
      ],
      {
        color: "oklch(0.65 0.25 295)",
        weight: 3,
        dashArray: "6 8",
        opacity: 0.7,
      },
    ).addTo(map);

    driverMarkerRef.current = L.marker([pickup.lat, pickup.lng], {
      icon: driverIcon,
    }).addTo(map);

    map.fitBounds(
      L.latLngBounds([pickup.lat, pickup.lng], [drop.lat, drop.lng]).pad(0.3),
    );

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!driver || !driverMarkerRef.current) return;
    driverMarkerRef.current.setLatLng([driver.lat, driver.lng]);
  }, [driver?.lat, driver?.lng]);

  return <div ref={ref} className={className} style={{ background: "#0a0a18" }} />;
}
