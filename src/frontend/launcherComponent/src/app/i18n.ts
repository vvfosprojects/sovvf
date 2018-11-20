import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
/**
 * controllo della lingua del browser: adesso è fissato a it!
 */
export class I18n {
    language = 'it';
}
