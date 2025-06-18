export interface Contact {
  email: string;
  phone_number: string;
}

export interface Experience {
  company: string;
  duration: string; // peut être vide ou formaté
  position: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Levels {
  education_level: string;
  experience_level: string;
  skills_level: string;
  language_level: string;
}

export class Expertise {
  owner!: string;
  contact!: Contact;
  technologies!: string[];
  skills!: string[];
  experience!: Experience[];
  levels!: Levels;
  education!: Education[];
  languages!: string[];
  snapshot!: string;
  hashtags!: string[];
  certifications!: string[];
  atouts!: string[];
}