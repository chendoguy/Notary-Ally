import React, { useState } from 'react';
import type { MileageEntry } from '../types';
import { getMilesBetweenLocations } from '../services/geminiService';

interface MileageTrackerProps {
  entries: MileageEntry[];
  addEntry: (entry: Omit<MileageEntry, 'id'>) => void;
}

const MileageTracker: React.FC<MileageTrackerProps> = ({ entries, addEntry }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [calculatedMiles, setCalculatedMiles] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculateMiles = async () => {
    if (!startLocation || !endLocation) {
      setError("Please enter both start and end locations.");
      return;
    }
    setIsCalculating(true);
    setError(null);
    setCalculatedMiles(null);
    try {
      const miles = await getMilesBetweenLocations(startLocation, endLocation);
      setCalculatedMiles(miles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && startLocation && endLocation && calculatedMiles !== null && calculatedMiles > 0) {
      addEntry({ date, startLocation, endLocation, miles: calculatedMiles });
      setStartLocation('');
      setEndLocation('');
      setCalculatedMiles(null);
      setError(null);
    } else if (calculatedMiles === null) {
        setError('Please calculate miles before logging the trip.');
    }
  };
  
  const totalMiles = entries.reduce((acc, entry) => acc + entry.miles, 0);

  const handleExport = () => {
    if (entries.length === 0) {
      alert("No mileage entries to export.");
      return;
    }
  
    const headers = ['ID', 'Date', 'Start Location', 'End Location', 'Miles'];
    
    const sanitize = (str: string) => `"${str.replace(/"/g, '""')}"`;

    const csvRows = entries.map(entry => 
      [
        sanitize(entry.id),
        sanitize(entry.date),
        sanitize(entry.startLocation),
        sanitize(entry.endLocation),
        entry.miles.toFixed(1)
      ].join(',')
    );
  
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'mileage_log.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Log Mileage</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <input type="text" placeholder="Start Location" value={startLocation} onChange={e => setStartLocation(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <input type="text" placeholder="End Location" value={endLocation} onChange={e => setEndLocation(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md space-y-2 text-center">
            <button type="button" onClick={handleCalculateMiles} disabled={isCalculating || !startLocation || !endLocation} className="w-full sm:w-auto bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors duration-300 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto">
              {isCalculating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Calculating...
                  </>
                ) : 'Calculate Miles'}
            </button>
            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
            {calculatedMiles !== null && (
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{calculatedMiles.toFixed(1)} miles</p>
            )}
          </div>

          <button type="submit" disabled={!calculatedMiles} className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300 disabled:bg-primary-400 disabled:cursor-not-allowed">Log Trip</button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-baseline gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mileage Log</h2>
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">Total: {totalMiles.toFixed(1)} mi</p>
            </div>
            {entries.length > 0 && (
                <button onClick={handleExport} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
            )}
        </div>
        {entries.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No mileage logged.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-slate-600 dark:text-slate-300">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{entry.startLocation} → {entry.endLocation}</p>
                  </div>
                  <p className="font-bold text-lg text-primary-600 dark:text-primary-400">{entry.miles.toFixed(1)} mi</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MileageTracker;