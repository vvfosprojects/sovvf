import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { PermessiState } from '../../../shared/store/states/permessi/permessi.state';
import { Observable } from 'rxjs';
import { PermessiFeatureInterface } from '../../../shared/interface/permessi-feature.interface';
import { UtenteState } from '../../../features/navbar/store/states/operatore/utente.state';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';

@Injectable({
    providedIn: 'root'
})
export class PermessiService {

    @Select(PermessiState.permessi) permessi$: Observable<PermessiFeatureInterface[]>;
    permessi: PermessiFeatureInterface[];
    @Select(UtenteState.utente) utente$: Observable<Utente>;
    utente: Utente;

    constructor() {
        this.getUtente();
        this.getPermessi();
    }

    getPermessi() {
        this.permessi$.subscribe((permessi: PermessiFeatureInterface[]) => {
            this.permessi = permessi;
        });
    }

    getUtente() {
        this.utente$.subscribe((utente: Utente) => {
            this.utente = utente;
        });
    }

    checkUserPermissionByFeature(feature: PermissionFeatures) {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        if (featureIndex !== null) {
            if (checkRuoliUtente(this.utente, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(utente, permessi, index) {
            let count = 0;
            utente.ruoli.forEach((ruolo: Ruolo) => {
                if (permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures) {
            let index = null;
            permessi.forEach((permesso: PermessiFeatureInterface, i: number) => {
                if (permesso.feature === permissionFeature) {
                    index = i;
                }
            });
            return index;
        }
    }
}
