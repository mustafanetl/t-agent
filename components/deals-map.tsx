'use client';

import * as React from 'react';
import mapboxgl from 'mapbox-gl';
import type { Deal } from '@/lib/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

type Props = {
  deals: Deal[];
  selectedDealId?: string | null;
  onSelect: (deal: Deal) => void;
};

export const DealsMap = ({ deals, selectedDealId, onSelect }: Props) => {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstance = React.useRef<mapboxgl.Map | null>(null);
  const markersRef = React.useRef<Record<string, mapboxgl.Marker>>({});

  React.useEffect(() => {
    if (!mapRef.current || mapInstance.current || !mapboxgl.accessToken) {
      return;
    }

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [12.4964, 41.9028],
      zoom: 3.8
    });

    mapInstance.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  React.useEffect(() => {
    const map = mapInstance.current;
    if (!map) {
      return;
    }

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    deals.forEach((deal) => {
      const el = document.createElement('button');
      el.className = `price-pill ${deal.id === selectedDealId ? 'ring-2 ring-white' : ''}`;
      el.innerText = `€${deal.minPrice}`;
      el.setAttribute('aria-label', `${deal.destination} from €${deal.minPrice}`);
      el.onclick = () => onSelect(deal);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([deal.lng, deal.lat])
        .addTo(map);

      markersRef.current[deal.id] = marker;
    });
  }, [deals, selectedDealId, onSelect]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
        Mapbox access token missing. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to enable the interactive map.
      </div>
    );
  }

  return <div ref={mapRef} className="map-container rounded-3xl" />;
};
