// Base interface for common fields
interface BaseEntity {
  id: string;
  createdAt: Date;
}

// User Model
export interface User extends BaseEntity {
  name: string;
  username: string;
  email: string;
  password: string;
  patients?: Patient[]; // Optional relation
}

// Patient Model
export interface Patient extends BaseEntity {
  name: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  userId: string;
  user?: User; // Optional relation
  appointments?: Appointment[];
  diseases?: Disease[];
}

// Appointment Model
export interface Appointment extends BaseEntity {
  date: Date;
  diagnosis: string;
  symptoms: string;
  temperature?: number | null;
  bloodPressure?: string | null;
  heartRate?: number | null;
  oxygenSaturation?: number | null;
  instructions?: string | null;
  followUpInDays?: number | null;
  patientId: string;
  patient?: Patient; // Optional relation
  aiAnalysis?: any; // Using any for Json type, consider more specific typing
}

// Disease Model
export interface Disease extends BaseEntity {
  name: string;
  patientId: string;
  patient?: Patient; // Optional relation
}

export interface voicePatient extends BaseEntity {
  name: string;
  voiceAppointments?: voiceAppointment[];
}

// Voice Doctor Model
export interface voiceDoctor extends BaseEntity {
  name: string;
  voiceAppointments?: voiceAppointment[];
}

// Voice Appointment Model
export interface voiceAppointment extends BaseEntity {
  date: Date;
  patientId: string;
  doctorId: string;
  patient?: voicePatient; // Optional relation
  doctor?: voiceDoctor; // Optional relation
}

// Create DTOs (for creating new entities)
export interface CreateUser {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface CreatePatient {
  name: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  userId: string;
}

export interface CreateAppointment {
  date: Date;
  diagnosis: string;
  symptoms: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  oxygenSaturation?: number;
  instructions?: string;
  followUpInDays?: number;
  patientId: string;
  aiAnalysis?: any;
}

export interface CreateDisease {
  name: string;
  patientId: string;
}

export interface CreateVoicePatient {
  name: string;
}

export interface CreateVoiceDoctor {
  name: string;
}

export interface CreateVoiceAppointment {
  date: Date;
  patientId: string;
  doctorId: string;
}

// Update DTOs (for partial updates)
export type UpdateUser = Partial<CreateUser>;
export type UpdatePatient = Partial<CreatePatient>;
export type UpdateAppointment = Partial<CreateAppointment>;
export type UpdateDisease = Partial<CreateDisease>;
export type UpdateVoicePatient = Partial<CreateVoicePatient>;
export type UpdateVoiceDoctor = Partial<CreateVoiceDoctor>;
export type UpdateVoiceAppointment = Partial<CreateVoiceAppointment>;
