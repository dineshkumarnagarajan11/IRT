
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Filter, Navigation, Star, Loader2, RefreshCw } from 'lucide-react';

export const ExploreMap: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Real data for map pins (centered around Jaipur for demo)
  const pins = [
    { id: 1, lat: 26.9239, lng: 75.8267, title: 'Hawa Mahal', type: 'Attraction', rating: 4.8, image: 'https://picsum.photos/200/200?random=10' },
    { id: 2, lat: 26.9196, lng: 75.8256, title: 'Johri Bazaar', type: 'Food', rating: 4.5, image: 'https://picsum.photos/200/200?random=11' },
    { id: 3, lat: 26.9855, lng: 75.8513, title: 'Amer Fort', type: 'History', rating: 4.9, image: 'https://picsum.photos/200/200?random=12' },
    { id: 4, lat: 26.9535, lng: 75.8462, title: 'Jal Mahal', type: 'Nature', rating: 4.7, image: 'https://picsum.photos/200/200?random=13' },
    { id: 5, lat: 26.9370, lng: 75.8155, title: 'Nahargarh Fort', type: 'View', rating: 4.6, image: 'https://picsum.photos/200/200?random=14' },
  ];

  useEffect(() => {
    let intervalId: any;
    
    const initializeMap = () => {
      // Check if mappls is available and map container exists
      // Explicitly check window object
      const mappy = (window as any).mappls;

      if (mappy && mapContainerRef.current && !mapInstanceRef.current) {
        try {
            console.log("Initializing Mappls Map...");
            // Use ref element directly instead of ID string
            const mapObj = new mappy.Map(mapContainerRef.current, {
                center: { lat: 26.9124, lng: 75.7873 },
                zoom: 12,
                zoomControl: false,
                geolocation: false,
                clickableIcons: false
            });

            mapObj.on('load', () => {
                console.log("Map Loaded Successfully");
                setIsMapReady(true);
                
                // Close bottom sheet when clicking on map
                mapObj.addListener('click', () => {
                    setSelectedPin(null);
                });
                
                // Add Markers
                pins.forEach(pin => {
                    // Create standard marker
                    const marker = new mappy.Marker({
                        map: mapObj,
                        position: { lat: pin.lat, lng: pin.lng },
                        // fitbounds: true, // Removed to prevent map jumping around
                        popupHtml: `<div style="padding:5px; font-weight:bold;">${pin.title}</div>`
                    });

                    marker.addListener('click', () => {
                        setSelectedPin(pin.id);
                        mapObj.panTo({ lat: pin.lat, lng: pin.lng });
                    });
                });
            });

            mapInstanceRef.current = mapObj;
            return true;
        } catch (e) {
            console.error("Error initializing Mappls map:", e);
            return false;
        }
      }
      return false;
    };

    // Attempt to initialize immediately or poll
    if (!initializeMap()) {
      let attempts = 0;
      intervalId = setInterval(() => {
        attempts++;
        if (initializeMap()) {
          clearInterval(intervalId);
        } else if (attempts > 20) { // Poll for 10 seconds (20 * 500ms)
          clearInterval(intervalId);
          if (!mapInstanceRef.current) {
            setLoadError(true);
          }
        }
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (mapInstanceRef.current) {
          try {
             // Attempt cleanup if supported
             if (mapInstanceRef.current.remove) {
                mapInstanceRef.current.remove();
             }
          } catch(e) { console.warn("Map cleanup warning", e); }
          mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-screen w-full relative bg-slate-100 overflow-hidden flex flex-col">
      {/* Real Map Container */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 z-0 bg-slate-200" 
      />

      {/* Loading / Error Overlay */}
      {(!isMapReady || loadError) && (
        <div className="absolute inset-0 z-10 bg-slate-100 flex items-center justify-center flex-col">
             {loadError ? (
                <div className="text-center px-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <MapPin size={32} className="opacity-50" />
                    </div>
                    <h3 className="font-bold text-dark mb-2">Map Unavailable</h3>
                    <p className="text-sm text-slate-500 mb-6">We couldn't load the map data. Please check your connection.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-brand text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 mx-auto hover:bg-[#eebb33] transition-colors"
                    >
                        <RefreshCw size={18} />
                        Reload Page
                    </button>
                </div>
             ) : (
                <>
                    <Loader2 className="animate-spin text-brand mb-2" size={32} />
                    <p className="text-slate-500 text-sm font-medium">Loading Map...</p>
                </>
             )}
             
             {/* Background Pattern */}
             <div 
                className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)',
                    backgroundSize: '30px 30px'
                }}
             />
        </div>
      )}

      {/* Header Overlay - Always visible unless error */}
      {!loadError && (
        <div className="absolute top-0 left-0 w-full p-5 z-20 flex gap-3 bg-gradient-to-b from-white/90 to-transparent pb-10">
            <button 
            onClick={() => navigate(-1)} 
            className="bg-white p-3.5 rounded-full shadow-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
            <ArrowLeft size={24} />
            </button>
            <div className="flex-1 bg-white rounded-full shadow-lg flex items-center px-5">
            <Search size={20} className="text-slate-400 mr-3" />
            <input 
                type="text" 
                placeholder="Search attractions..." 
                className="flex-1 h-12 outline-none text-slate-700 font-medium bg-transparent"
            />
            </div>
            <button className="bg-white p-3.5 rounded-full shadow-lg text-slate-700 hover:bg-slate-50 transition-colors">
            <Filter size={24} />
            </button>
        </div>
      )}

      {/* Bottom Sheet for Selected Pin */}
      {selectedPin && (
        <div className="absolute bottom-6 left-5 right-5 z-30 animate-in slide-in-from-bottom-4 fade-in duration-300">
          {(() => {
            const pin = pins.find(p => p.id === selectedPin);
            if (!pin) return null;
            return (
              <div className="bg-white rounded-2xl shadow-2xl p-4 flex gap-4 items-center">
                <img src={pin.image} alt={pin.title} className="w-24 h-24 rounded-xl object-cover bg-slate-100 shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-dark truncate">{pin.title}</h3>
                        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">{pin.type}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedPin(null)} 
                        className="text-slate-300 hover:text-slate-500 p-1"
                      >
                        ✕
                      </button>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                      <Star size={14} className="text-brand fill-brand" />
                      <span className="text-sm font-bold text-dark">{pin.rating}</span>
                      <span className="text-xs text-slate-400">(120 reviews)</span>
                  </div>

                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`, '_blank')}
                    className="w-full bg-brand text-black text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-100 hover:bg-[#eebb33] transition-colors"
                  >
                    <Navigation size={16} />
                    Get Directions
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
