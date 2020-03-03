import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
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

    @Select(UtenteState.utente) utente$: Observable<Utente>;
    utente: Utente;

    permessi: PermessiFeatureInterface[];

    constructor(private store: Store) {
        this.getUtente();
        this.getPermessi();
    }

    getPermessi() {
        this.permessi = this.store.selectSnapshot(PermessiState.permessi);
    }

    getUtente() {
        this.utente$.subscribe((utente: Utente) => {
            this.utente = utente;
        });
    }

    checkUserPermissionByFeature(feature: PermissionFeatures) {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        if (this.utente && this.utente.ruoli && this.utente.ruoli.length > 0 && this.permessi && featureIndex !== null) {
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
