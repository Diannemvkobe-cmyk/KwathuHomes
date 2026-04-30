/*
Purpose
- Placeholder for the "Near Me" feature.
- Displays a construction state with a back button.

How It Works
- Simple UI with Framer Motion animations.
- Provides a back button to return to the home view.

Where It Fits
- Shown when the user clicks the "Near Me" button in the Hero section.
*/
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, Sparkles, Navigation, Home, Search, Loader2, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom User Marker Icon
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map centering when location changes
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 14);
  return null;
};

const NearMe = ({ onBack, properties, onSelectProperty }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          setLoading(false);
          // Simulation delay for the radar effect
          setTimeout(() => setScanning(false), 2500);
        },
        (err) => {
          setError("Location access denied. Please enable location to find homes near you.");
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const nearbyProperties = useMemo(() => {
    if (!userLocation || !properties.length) return [];
    
    return properties.slice(0, 8).map((prop, idx) => {
      // Simulate real coordinates around user for demonstration
      // In production, these coordinates would come from the database
      const offsetLat = (Math.random() - 0.5) * 0.015;
      const offsetLng = (Math.random() - 0.5) * 0.015;
      return {
        ...prop,
        lat: userLocation.lat + offsetLat,
        lng: userLocation.lng + offsetLng,
        distance: (Math.random() * 3 + 0.2).toFixed(1)
      };
    });
  }, [userLocation, properties]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-emerald-500/20 rounded-full -z-10 blur-xl"
          />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Accessing GPS Data...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 relative flex flex-col overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-6 flex items-center justify-between pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20 text-slate-500 hover:text-emerald-600 font-black text-xs transition-all group"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="flex flex-col items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl px-6 py-2 rounded-2xl shadow-2xl border border-white/20">
          <h1 className="text-xs font-black text-slate-900 dark:text-white tracking-tighter uppercase">Live Street View</h1>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Radar Active</p>
          </div>
        </div>
        
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-10">
        {userLocation && (
          <MapContainer 
            center={[userLocation.lat, userLocation.lng]} 
            zoom={14} 
            scrollWheelZoom={true}
            className="h-full w-full"
            zoomControl={false} // Custom zoom buttons look better
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <ChangeView center={[userLocation.lat, userLocation.lng]} />

            {/* User Marker */}
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup className="custom-popup">
                <div className="text-center p-1">
                  <p className="text-xs font-black uppercase text-emerald-600">You are here</p>
                </div>
              </Popup>
            </Marker>

            {/* Proximity Circle / Radar */}
            <Circle 
              center={[userLocation.lat, userLocation.lng]}
              radius={2000}
              pathOptions={{ 
                fillColor: '#10b981', 
                fillOpacity: scanning ? 0.2 : 0.05, 
                color: '#10b981', 
                weight: 1,
                dashArray: '5, 10'
              }}
            />

            {/* Property Markers */}
            {!scanning && nearbyProperties.map((prop) => (
              <Marker 
                key={prop._id} 
                position={[prop.lat, prop.lng]}
                eventHandlers={{
                  click: () => {},
                }}
              >
                <Popup maxWidth={200}>
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100">
                      <img src={prop.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase truncate">{prop.title}</h3>
                      <p className="text-[10px] text-emerald-600 font-bold mb-2">{prop.price}</p>
                      <button 
                        onClick={() => onSelectProperty(prop)}
                        className="w-full bg-slate-900 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Scanning Overlay Effect */}
        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 pointer-events-none bg-emerald-500/5 backdrop-blur-[1px] flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-96 h-96 bg-emerald-500 rounded-full blur-3xl"
              />
              <div className="absolute bottom-24 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Mapping Local Area...</p>
                </div>
                <div className="w-48 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1/2 h-full bg-emerald-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Panel / Found List */}
      <div className="absolute bottom-6 left-6 right-6 z-[1000] pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <AnimatePresence>
            {!scanning && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-2xl border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nearby Results</p>
                  <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                    {nearbyProperties.length} Homes
                  </div>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {nearbyProperties.map((prop) => (
                    <button
                      key={prop._id}
                      onClick={() => onSelectProperty(prop)}
                      className="flex-shrink-0 w-48 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 transition-all text-left group"
                    >
                      <div className="w-full h-24 rounded-xl overflow-hidden mb-3">
                        <img src={prop.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate mb-1">{prop.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] text-emerald-600 font-black tracking-tight">{prop.price}</p>
                        <p className="text-[8px] text-slate-400 font-bold">{prop.distance} km</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <div className="absolute inset-0 z-[2000] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Info className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-4 tracking-tighter">Location Access Required</h2>
          <p className="text-slate-500 text-sm max-w-xs mb-8 font-medium">{error}</p>
          <button
            onClick={onBack}
            className="bg-slate-900 text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default NearMe;
