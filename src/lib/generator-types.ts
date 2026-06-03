export const MODES = ["brainstorm", "emojify", "full", "variants"] as const;
export const INTENSITIES = ["light", "medium", "unhinged", "nuclear"] as const;
export const LENGTHS = ["short", "medium", "long"] as const;

export type Mode = (typeof MODES)[number];
export type Intensity = (typeof INTENSITIES)[number];
export type Length = (typeof LENGTHS)[number];

export type GeneratorFields = {
  eventType: string;
  dateTime: string;
  venue: string;
  location: string;
  occasion: string;
  people: string;
  foodDrinks: string;
  insideJokes: string;
  ownJokes: string;
  avoidJokes: string;
};

export type GenerateRequest = {
  mode: Mode;
  intensity: Intensity;
  length: Length;
  includeLogistics: boolean;
  fields: GeneratorFields;
  draft: string;
  existingOutput?: string;
  revisionRequest?: string;
};

export type GenerateResponse = {
  text: string;
  model: string;
  privateCorpusLoaded: boolean;
};
