import { Selector, State } from '@ngxs/store';
import { PermissionFeatures } from '../../../enum/permission-features.enum';
import { Role } from '../../../model/utente.model';
import { PermessiFeatureInterface } from '../../../interface/permessi-feature.interface';
import { Injectable } from '@angular/core';

export interface PermessiStateModel {
    permessi: Array<PermessiFeatureInterface>;
}

export const PermessiStateDefaults: PermessiStateModel = {
    permessi: [
        {
            feature: PermissionFeatures.SchedaTelefonata,
            roles: [Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.SchedeContatto,
            roles: [Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.MezziInServizio,
            roles: [Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ModificaRichiesta,
            roles: [Role.GestoreRichieste, Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.GestisciRichiesta,
            roles: [Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ComposizionePartenzaRichiesta,
            roles: [Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.GestioneUtenti,
            roles: [Role.Amministratore]
        },
        {
            feature: PermissionFeatures.Autorimessa,
            roles: []
        },
        {
            feature: PermissionFeatures.Servizi,
            roles: []
        },
        {
            feature: PermissionFeatures.Statistiche,
            roles: []
        },
        {
            feature: PermissionFeatures.GestisciSchedaContatto,
            roles: [Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.CreaRichiestaSchedaContatto,
            roles: [Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.RaggruppamentoSchedeContatto,
            roles: [Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.EliminazioneRaggruppamentoSchedeContatto,
            roles: [Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.ListaTrasferimentiChiamate,
            roles: [Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.GestionePos,
            roles: [Role.Amministratore]
        },
        {
            feature: PermissionFeatures.Triage,
            roles: [Role.Amministratore]
        },
        {
            feature: PermissionFeatures.ZoneEmergenza,
            roles: [Role.Amministratore]
        },
        {
            feature: PermissionFeatures.ImpostazioniSede,
            roles: [Role.Amministratore]
        }
    ]
};

@Injectable()
@State<PermessiStateModel>({
    name: 'permessi',
    defaults: PermessiStateDefaults
})
export class PermessiState {

    @Selector()
    static permessi(state: PermessiStateModel): PermessiFeatureInterface[] {
        return state.permessi;
    }

}
