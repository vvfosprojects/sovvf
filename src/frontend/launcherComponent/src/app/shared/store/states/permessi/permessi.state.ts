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
            roles: [Role.GestoreChiamate, Role.GestoreRichieste, Role.Visualizzatore]
        },
        {
            feature: PermissionFeatures.ModificaRichiesta,
            roles: [Role.GestoreRichieste, Role.GestoreChiamate]
        },
        {
            feature: PermissionFeatures.AzioniRichiesta,
            roles: [Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ModificaStatoMezzo,
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
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.Triage,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ZoneEmergenza,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ImpostazioniSede,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.AggiungiDettaglioTipologia,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ModificaDettaglioTipologia,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.EliminaDettaglioTipologia,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.AggiungiTriage,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ModificaTriage,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.EliminaTriage,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ImportaTriage,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.Rubrica,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste, Role.Visualizzatore]
        },
        {
            feature: PermissionFeatures.AggiungiVoceRubrica,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ModificaVoceRubrica,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.EliminaVoceRubrica,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.CodaChiamate,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.DashboardPortale,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.RiepilogoInterventi,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste, Role.Visualizzatore]
        },
        {
            feature: PermissionFeatures.AreaDocumentale,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.AggiungiDocumento,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ModificaDocumento,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.EliminaDocumento,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste]
        },
        {
            feature: PermissionFeatures.ServiziOperativi,
            roles: [Role.GestoreChiamate, Role.GestoreRichieste, Role.Visualizzatore]
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
