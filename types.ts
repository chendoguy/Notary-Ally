export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  location: string;
}

export interface MileageEntry {
  id: string;
  date: string;
  startLocation: string;
  endLocation: string;
  miles: number;
}

export enum NotarizationType {
  ACKNOWLEDGMENT = 'Acknowledgment',
  JURAT = 'Jurat',
  COPY_CERTIFICATION = 'Copy Certification',
  OATH_OR_AFFIRMATION = 'Oath or Affirmation',
}

export interface JournalEntry {
  id: string;
  date: string;
  notarizationType: NotarizationType;
  signerName: string;
  signerIdNumber: string;
  signerIdState: string;
  signerIdIssueDate: string;
  signerIdExpirationDate: string;
  signerAddress: string;
  signatureDataUrl: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  county: string;
  error?: string;
}
