import React, { useState, useRef } from 'react';
import type { Appointment } from '../types';

interface AppointmentsProps {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, addAppointment, updateAppointment }) => {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const clearForm = () => {
    setClientName('');
    setDate('');
    setTime('');
    setLocation('');
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointmentId(appointment.id);
    setClientName(appointment.clientName);
    setDate(appointment.date);
    setTime(appointment.time);
    setLocation(appointment.location);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingAppointmentId(null);
    clearForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName && date && time && location) {
      if (editingAppointmentId) {
        updateAppointment({ id: editingAppointmentId, clientName, date, time, location });
      } else {
        addAppointment({ clientName, date, time, location });
      }
      setEditingAppointmentId(null);
      clearForm();
    }
  };

  const handleExport = () => {
    if (appointments.length === 0) {
      alert("No appointments to export.");
      return;
    }
  
    const headers = ['ID', 'Client Name', 'Date', 'Time', 'Location'];
    
    const sanitize = (str: string) => `"${str.replace(/"/g, '""')}"`;

    const csvRows = appointments.map(app => 
      [
        sanitize(app.id),
        sanitize(app.clientName),
        sanitize(app.date),
        sanitize(app.time),
        sanitize(app.location)
      ].join(',')
    );
  
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'appointments.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div ref={formRef} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          {editingAppointmentId ? 'Edit Appointment' : 'Add New Appointment'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <div className="flex gap-2">
            {editingAppointmentId && (
              <button type="button" onClick={handleCancelEdit} className="w-full bg-slate-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-300">Cancel</button>
            )}
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300">
              {editingAppointmentId ? 'Update Appointment' : 'Add Appointment'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Upcoming Appointments</h2>
            {appointments.length > 0 && (
                <button onClick={handleExport} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2 px-3 rounded-lg text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                </button>
            )}
        </div>
        {appointments.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">No appointments scheduled.</p>
        ) : (
          appointments.map(app => (
            <div key={app.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-primary-600 dark:text-primary-400">{app.clientName}</p>
                    <p className="text-slate-600 dark:text-slate-300">{new Date(app.date).toLocaleDateString()} at {app.time}</p>
                    <p className="text-slate-500 dark:text-slate-400">{app.location}</p>
                  </div>
                  <button onClick={() => handleEditClick(app)} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;