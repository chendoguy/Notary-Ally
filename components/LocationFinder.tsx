
import React, { useState } from 'react';
import type { LocationInfo } from '../types';
import { getCountyFromCoords } from '../services/geminiService';

const LocationFinder: React.FC = () => {
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const findLocation = () => {
    setIsLoading(true);
    setLocationInfo(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const county = await getCountyFromCoords(latitude, longitude);
          setLocationInfo({ latitude, longitude, county });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          setLocationInfo({ latitude: 0, longitude: 0, county: '', error: `API Error: ${errorMessage}` });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setLocationInfo({ latitude: 0, longitude: 0, county: '', error: `Geolocation Error: ${error.message}` });
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Find My Location & County</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Press the button below to get your current geographic coordinates and county.</p>
        <button 
          onClick={findLocation}
          disabled={isLoading}
          className="bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-300 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto mx-auto"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding...
            </>
          ) : (
            'Get Current Location'
          )}
        </button>
      </div>

      {locationInfo && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          {locationInfo.error ? (
            <div className="text-center text-red-500 dark:text-red-400">
              <h3 className="font-bold text-lg">Error</h3>
              <p>{locationInfo.error}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center">Your Location</h3>
              <div className="flex justify-around text-center">
                  <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Latitude</p>
                      <p className="font-mono text-lg text-primary-600 dark:text-primary-400">{locationInfo.latitude.toFixed(4)}</p>
                  </div>
                  <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Longitude</p>
                      <p className="font-mono text-lg text-primary-600 dark:text-primary-400">{locationInfo.longitude.toFixed(4)}</p>
                  </div>
              </div>
              <div className="text-center pt-2">
                 <p className="text-sm text-slate-500 dark:text-slate-400">County</p>
                 <p className="font-bold text-2xl text-slate-700 dark:text-slate-200">{locationInfo.county}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationFinder;
