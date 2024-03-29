import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PermessiState } from '../../../shared/store/states/permessi/permessi.state';
import { Observable } from 'rxjs';
import { PermessiFeatureInterface } from '../../../shared/interface/permessi-feature.interface';
import { Ruolo } from '../../../shared/model/utente.model';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { RuoliUtenteLoggatoState } from '../../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { AppState } from '../../../shared/store/states/app/app.state';

@Injectable({
    providedIn: 'root'
})
export class PermessiService {

    @Select(RuoliUtenteLoggatoState.ruoli) ruoli$: Observable<Ruolo[]>;
    ruoli: Ruolo[];

    permessi: PermessiFeatureInterface[];

    constructor(private store: Store) {
        this.getRuoliUtenteLoggato();
        this.getPermessi();
    }

    getPermessi(): void {
        this.permessi = this.store.selectSnapshot(PermessiState.permessi);
    }

    getRuoliUtenteLoggato(): void {
        this.ruoli$.subscribe((ruoli: Ruolo[]) => {
            this.ruoli = ruoli;
        });
    }

    checkUserPermissionByFeature(feature: PermissionFeatures): boolean {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        const vistaSedi = this.store.selectSnapshot(AppState.vistaSedi);
        let codSede: string;
        if (vistaSedi) {
            codSede = vistaSedi[0];
        }
        if (this.ruoli?.length > 0 && this.permessi && featureIndex !== null) {
            if (checkRuoliUtente(this.ruoli, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(ruoli, permessi, index): boolean {
            let count = 0;
            ruoli?.forEach((ruolo: Ruolo) => {
                if ((!codSede || (codSede === ruolo.codSede)) && permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures): number {
            let index = null;
            permessi.forEach((permesso: PermessiFeatureInterface, i: number) => {
                if (permesso.feature === permissionFeature) {
                    index = i;
                }
            });
            return index;
        }
    }

    checkUserPermissionRichiesta(feature: PermissionFeatures, codUOCompetenza: string[], codSOCompetente: string, codSOAllertate: string[]): boolean {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        if (this.ruoli && this.ruoli && this.ruoli.length > 0 && this.permessi && featureIndex !== null) {
            if (checkRuoliUtente(this.ruoli, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(ruoli, permessi, index): boolean {
            let count = 0;
            ruoli.forEach((ruolo: Ruolo) => {
                if (checkSede(ruolo, codUOCompetenza, codSOCompetente, codSOAllertate) && permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures): number {
            let index = null;
            permessi.forEach((permesso: PermessiFeatureInterface, i: number) => {
                if (permesso.feature === permissionFeature) {
                    index = i;
                }
            });
            return index;
        }

        function checkSede(ruolo, codUOCompetenzaRef, codSOCompetenteRef, codSOAllertateRef): boolean {
            let count = 0;
            if (codUOCompetenzaRef) {
                codUOCompetenzaRef.forEach((codUo: string) => {
                    if (ruolo.codSede === codUo) {
                        count++;
                    }
                });
            }
            if (count === 0 && ruolo.codSede === codSOCompetenteRef) {
                count++;
            }
            if (codSOAllertateRef) {
                codSOAllertateRef.forEach((codUo: string) => {
                    if (ruolo.codSede === codUo) {
                        count++;
                    }
                });
            }
            return count > 0;
        }
    }

    checkPermissionCodSedeAppartenenza(feature: PermissionFeatures, codSede: string): boolean {
        const featureIndex = searchFeatureIndex(this.permessi, feature);
        const vistaSedi = this.store.selectSnapshot(AppState.vistaSedi);
        let codSedeVistaSedi: string;
        if (vistaSedi) {
            codSedeVistaSedi = vistaSedi[0];
        }
        if (this.ruoli && this.ruoli && this.ruoli.length > 0 && this.permessi && featureIndex !== null) {
            if (checkRuoliUtente(this.ruoli, this.permessi, featureIndex)) {
                return true;
            }
        }
        return false;

        function checkRuoliUtente(ruoli, permessi, index): boolean {
            let count = 0;
            ruoli.forEach((ruolo: Ruolo) => {
                if ((!codSedeVistaSedi || (codSedeVistaSedi === ruolo.codSede)) && ruolo.codSede === codSede && permessi[index].roles.indexOf(ruolo.descrizione) !== -1) {
                    count++;
                }
            });
            return count > 0;
        }

        function searchFeatureIndex(permessi: PermessiFeatureInterface[], permissionFeature: PermissionFeatures): number {
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
