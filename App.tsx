import React, { useState, useEffect } from 'react';
import type { Appointment, MileageEntry, JournalEntry } from './types';

import Appointments from './components/Appointments';
import MileageTracker from './components/MileageTracker';
import LocationFinder from './components/LocationFinder';
import Faq from './components/Faq';
import ElectronicJournal from './components/ElectronicJournal';

type Tab = 'appointments' | 'mileage' | 'location' | 'journal' | 'faq';

const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [appointments, setAppointments] = usePersistentState<Appointment[]>('notary_appointments', []);
  const [mileageEntries, setMileageEntries] = usePersistentState<MileageEntry[]>('notary_mileage', []);
  const [journalEntries, setJournalEntries] = usePersistentState<JournalEntry[]>('notary_journal', []);
  const [isDarkMode, setIsDarkMode] = usePersistentState<boolean>('notary_dark_mode', false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: new Date().toISOString() };
    setAppointments(prev => [newAppointment, ...prev]);
  };
  
  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => 
      prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app)
    );
  };

  const addMileageEntry = (entry: Omit<MileageEntry, 'id'>) => {
    const newEntry = { ...entry, id: new Date().toISOString() };
    setMileageEntries(prev => [newEntry, ...prev]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: new Date().toISOString() };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <Appointments appointments={appointments} addAppointment={addAppointment} updateAppointment={updateAppointment} />;
      case 'mileage':
        return <MileageTracker entries={mileageEntries} addEntry={addMileageEntry} />;
      case 'location':
        return <LocationFinder />;
      case 'journal':
        return <ElectronicJournal entries={journalEntries} addEntry={addJournalEntry} />;
      case 'faq':
        return <Faq />;
      default:
        return null;
    }
  };

  const getTabClass = (tabName: Tab) => 
    `flex-1 p-2 flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
      activeTab === tabName 
        ? 'text-primary-600 dark:text-primary-400' 
        : 'text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'
    }`;
  
  const getTabIconColor = (tabName: Tab) => activeTab === tabName ? 'currentColor' : '#64748b'; // slate-500
  
  const PageTitle: Record<Tab, string> = {
    appointments: 'Appointments',
    mileage: 'Mileage Tracker',
    location: 'Location Finder',
    journal: 'E-Journal',
    faq: 'FAQ'
  };


  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Notary Ally</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <main className="p-4 pb-24">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">{PageTitle[activeTab]}</h2>
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-t-lg flex">
        <button onClick={() => setActiveTab('appointments')} className={getTabClass('appointments')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTabIconColor('appointments')} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span className="text-xs font-medium">Appointments</span>
        </button>
        <button onClick={() => setActiveTab('mileage')} className={getTabClass('mileage')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTabIconColor('mileage')} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-xs font-medium">Mileage</span>
        </button>
        <button onClick={() => setActiveTab('location')} className={getTabClass('location')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTabIconColor('location')} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-xs font-medium">Location</span>
        </button>
        <button onClick={() => setActiveTab('journal')} className={getTabClass('journal')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTabIconColor('journal')} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          <span className="text-xs font-medium">Journal</span>
        </button>
        <button onClick={() => setActiveTab('faq')} className={getTabClass('faq')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTabIconColor('faq')} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-xs font-medium">FAQ</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
