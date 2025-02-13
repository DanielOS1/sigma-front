export interface CreateSensor {
    type: SensorType;
    thresholdMin?: number;
    thresholdMax?: number;
    samplingFrequency?: number;
    xPosition: number;
    yPosition: number;
    zPosition: number;
    pondId: string;
  }
  

export enum SensorType {
    OXYGEN = 1,
    TEMPERATURE = 2,
    PH = 3,
    CONDUCTIVITY = 4,
    TURBIDITY = 5,
    WATER_LEVEL = 6,
    WATER_FLOW = 7,
  }


export interface Sensor {
    id: string;
    type: SensorType;
    thresholdMin: number | null;
    thresholdMax: number | null;
    samplingFrequency: number;
    status: boolean;
    lastUpdate: Date;
    xPosition: number;
    yPosition: number;
    zPosition: number;
    unit: string;

  }

export type PartialSensor = Pick<Sensor, "id" | "type">

export interface updateSensor{
    samplingFrequency: number;
    xPosition: number;
    yPosition: number;
    zPosition: number;
}
  
  

export interface SensorInstance {
  id: string;
  type: SensorType;
  thresholdMin: number | null;
  thresholdMax: number | null;
  samplingFrequency: number;
  xPosition: number;
  yPosition: number;
  zPosition: number;
  status: boolean;
  isUpdating?: boolean;  
}

export interface SensorFormat {
    id: string;
    type: SensorType;
    icon: string;
    status: boolean;
    count: number;
    instances: SensorInstance[];
}