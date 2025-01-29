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

export interface PoolResponse {
    id: string;
    depth: number;
    waterType: string;
    radius: number;
    length: number;
    height: number;
}
  
export interface PoolDetails {
    ponds_id: string;
    ponds_depth: number;
    ponds_pondType: number;
    ponds_waterType: number;
    poollength?: number;
    poolheight?: number;
    pondradius?: number;
}