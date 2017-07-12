import { Injectable } from '@angular/core'; 
import { PuntiMappaGoogleOutput } from '../model/puntiMappaGoogleOutput.model'; 

@Injectable() 
export class PuntiDataOutput {

    puntiOutput: PuntiMappaGoogleOutput[] = []; 
 
    constructor() { 
    } 

    addPointFromMap(puntoOutput: PuntiMappaGoogleOutput): PuntiDataOutput { 
        this.puntiOutput.push(puntoOutput); 
        return this; 
    } 
}