export enum HealthLevel { // Enum representing different health levels // This enum is used to define the health level of the user, which can be used to generate or hallucinate data in the medical form.
  Perfect = 'perfect',
  Good = 'good',
  Average = 'average',
  Bad = 'bad',
  Terrible = 'terrible',
}

export interface Action { // Defines the structure for actions that the AI agent can recommend
  type: 'fill' | 'click' | 'select'; // The type of action to perform
  selector: string; // The CSS selector for the element to interact with
  value?: string; // The value to fill or select (for 'fill' and 'select' actions)
}

export interface FormData { // Defines the structure for the form data
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Expected format: YYYY-MM-DD
  medicalId: string;
  gender?: string;
  bloodType?: string;
  allergies?: string[];
  medications?: string[];
  emergencyContact?: string;
  emergencyPhone?: string;
}
