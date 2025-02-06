import { Scientist } from "./user.interface";

export interface PoolDTo {
    aquacultureRut: string; 
    waterType: WaterType; 
    depth: number; 
    pondType: PondType; 
    radius: number; 
    length: number; 
    height: number; 

}

export enum PondType {
    POND = 1,
    POOL = 2,
  }


export enum WaterType {
    FRESH = 1,
    SALT = 2,
}

export interface PoolDetails {
    id: string;
    depth: number;
    waterType: number;
    pondType: number;
    radius: number;
    length: number;
    height: number;

}
  
export interface PoolDetailss {
    ponds_id: string;
    ponds_depth: number;
    ponds_pondType: string;
    ponds_waterType: number;
    poollength?: number;
    poolheight?: number;
    pondradius?: number;
}

export interface PoolAdvancedDetails {
    id: string;
    depth: number;
    waterType: number;
    radius: number | null;
    length: number | null;
    height: number | null;
    ownerName: string | null;
    ownerRut: string | null;
    scientist: Scientist | null;
}