"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./ComplaintMap"), {
  ssr: false,
  loading: () => <div className="map-placeholder" style={{ height: 250, background: "var(--bg-2)", borderRadius: "var(--radius-md)", marginTop: 16 }} />,
});

export default function ComplaintMapWrapper({ lat, lng }: { lat: number; lng: number }) {
  return <Map lat={lat} lng={lng} />;
}
