export interface Threshold {
    name: string;
    min: string;
    max: string;
  }
  
  export interface HeatingSeason {
    id: string;
    heating_start_date: string; 
    heating_end_date: string;   
  }
  
  export interface AppState {
    thresholds: Threshold[];
    heatingSeason: HeatingSeason | null;
  }
  