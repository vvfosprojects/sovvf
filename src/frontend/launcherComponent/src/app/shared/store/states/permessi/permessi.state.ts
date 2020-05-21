import { Selector, State } from '@ngxs/store';
import { PermissionFeatures } from '../../../enum/permission-features.enum';
import { Role } from '../../../model/utente.model';
import { PermessiFeatureInterface } from '../../../interface/permessi-feature.interface';

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
            roles: [Role.GestoreRichieste]
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
        }
    ]
};

@State<PermessiStateModel>({
    name: 'permessi',
    defaults: PermessiStateDefaults
})
export class PermessiState {

    @Selector()
    static permessi(state: PermessiStateModel) {
        return state.permessi;
    }

}
