import 'dotenv-defaults/config';
import {FormData, HealthLevel} from './types';

export const URL = 'https://magical-medical-form.netlify.app/';
export const MODEL = 'claude-3-7-sonnet-20250219';
export const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}
export const generate = false; // If false, only fills from existing info; if true, will hallucinate based on health level.

export const healthLevel: HealthLevel = HealthLevel.Terrible; // this is just gonna be put into a prompt to hallucinate data

export const defaultFormData: FormData = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  medicalId: '91927885',
  gender: '',
  bloodType: '',
  allergies: [],
  medications: [],
  emergencyContact: '',
  emergencyPhone: '',
};
