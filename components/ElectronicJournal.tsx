import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import type { JournalEntry } from '../types';
import { NotarizationType } from '../types';
import SignaturePad from './SignaturePad';

interface ElectronicJournalProps {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
}

const ElectronicJournal: React.FC<ElectronicJournalProps> = ({ entries, addEntry }) => {
  const [notarizationType, setNotarizationType] = useState<NotarizationType>(NotarizationType.ACKNOWLEDGMENT);
  const [signerName, setSignerName] = useState('');
  const [signerIdNumber, setSignerIdNumber] = useState('');
  const [signerIdState, setSignerIdState] = useState('');
  const [signerIdIssueDate, setSignerIdIssueDate] = useState('');
  const [signerIdExpirationDate, setSignerIdExpirationDate] = useState('');
  const [signerAddress, setSignerAddress] = useState('');
  const signatureRef = useRef<SignatureCanvas>(null);

  const clearForm = () => {
    setSignerName('');
    setSignerIdNumber('');
    setSignerIdState('');
    setSignerIdIssueDate('');
    setSignerIdExpirationDate('');
    setSignerAddress('');
    signatureRef.current?.clear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert('Please provide a signature.');
      return;
    }
    if (signerName && signerIdNumber && signerAddress && signerIdState && signerIdIssueDate && signerIdExpirationDate) {
      const signatureDataUrl = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
      addEntry({
        date: new Date().toISOString(),
        notarizationType,
        signerName,
        signerIdNumber,
        signerIdState,
        signerIdIssueDate,
        signerIdExpirationDate,
        signerAddress,
        signatureDataUrl
      });
      clearForm();
    }
  };

  const handleExport = () => {
    if (entries.length === 0) {
      alert("No journal entries to export.");
      return;
    }
  
    const headers = [
      'ID', 'Date', 'Notarization Type', 'Signer Name', 'Signer Address', 
      'Signer ID Number', 'Signer ID State', 'Signer ID Issue Date', 'Signer ID Expiration Date'
    ];
    
    const sanitize = (str: string) => `"${str.replace(/"/g, '""')}"`;

    const csvRows = entries.map(entry => 
      [
        sanitize(entry.id),
        sanitize(new Date(entry.date).toISOString()),
        sanitize(entry.notarizationType),
        sanitize(entry.signerName),
        sanitize(entry.signerAddress),
        sanitize(entry.signerIdNumber),
        sanitize(entry.signerIdState),
        sanitize(entry.signerIdIssueDate),
        sanitize(entry.signerIdExpirationDate)
      ].join(',')
    );
  
    const csvString = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'journal_entries.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">New Journal Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type of Notarization</label>
            <select value={notarizationType} onChange={e => setNotarizationType(e.target.value as NotarizationType)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
              {Object.values(NotarizationType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Signer's Full Name" value={signerName} onChange={e => setSignerName(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          <input type="text" placeholder="Signer's Address" value={signerAddress} onChange={e => setSignerAddress(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Signer's ID Number" value={signerIdNumber} onChange={e => setSignerIdNumber(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            <input type="text" placeholder="State of ID Issuance" value={signerIdState} onChange={e => setSignerIdState(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID Issue Date</label>
              <input type="date" value={signerIdIssueDate} onChange={e => setSignerIdIssueDate(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID Expiration Date</label>
              <input type="date" value={signerIdExpirationDate} onChange={e => setSignerIdExpirationDate(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" required />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Signer's Signature</label>
            <SignaturePad signatureRef={signatureRef} />
            <button type="button" onClick={() => signatureRef.current?.clear()} className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-2">Clear Signature</button>
          </div>

          <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300">Save Journal Entry</button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Journal History</h2>
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
          <p className="text-slate-500 dark:text-slate-400">No journal entries found.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <p className="font-bold text-lg text-primary-600 dark:text-primary-400">{entry.signerName}</p>
                <p className="text-slate-600 dark:text-slate-300">{entry.notarizationType} on {new Date(entry.date).toLocaleString()}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Address: {entry.signerAddress}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                    <p>ID: {entry.signerIdNumber} ({entry.signerIdState})</p>
                    <p>Issued: {new Date(entry.signerIdIssueDate).toLocaleDateString()} | Expires: {new Date(entry.signerIdExpirationDate).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <img src={entry.signatureDataUrl} alt="Signer's signature" className="h-16 w-auto mix-blend-darken dark:mix-blend-lighten" />
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ElectronicJournal;