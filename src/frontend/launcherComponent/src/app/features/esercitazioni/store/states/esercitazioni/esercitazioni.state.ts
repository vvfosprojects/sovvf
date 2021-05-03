import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddEsercitazione, GetEsercitazioni } from '../../actions/esercitazioni/esercitazioni.actions';
import { EsercitazioniService } from '../../../../../core/service/esercitazioni-service/esercitazioni.service';
import { MezzoEsercitazione } from '../../../interface/mezzo-esercitazione.interface';
import { SquadraEsercitazione } from '../../../interface/squadra-esercitazione.interface';
import { StatoMezzo } from '../../../../../shared/enum/stato-mezzo.enum';
import { Sede } from '../../../../../shared/model/sede.model';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { StatoSquadra } from '../../../../../shared/enum/stato-squadra.enum';

export interface EsercitazioniStateModel {
    esercitazioni: any[];
    listaMezzi: MezzoEsercitazione[];
    listaSquadre: SquadraEsercitazione[];
}

export const EsercitazioniStateDefaults: EsercitazioniStateModel = {
    esercitazioni: null,
    listaMezzi: [
        {
            id: '1',
            mezzo: {
                codice: '42312',
                descrizione: '42312',
                genere: 'APS',
                stato: StatoMezzo.InSede,
                appartenenza: null,
                distaccamento: new Sede('RM.1000', 'Sede Centrale Roma', new Coordinate(0, 0), 'Via Cavour, 32', 'Comando', 'Lazio', 'RM'),
                coordinate: new Coordinate(0, 0),
            }
        }
    ],
    listaSquadre: [
        {

            id: '1',
            squadra: {
                id: 'A1',
                nome: 'Squadra 1',
                turno: 'A',
                stato: StatoSquadra.InSede,
                componenti: [],
                distaccamento: new Sede('RM.1000', 'Sede Centrale Roma', new Coordinate(0, 0), 'Via Cavour, 32', 'Comando', 'Lazio', 'RM'),
            }
        }
    ]
};

@Injectable()
@State<EsercitazioniStateModel>({
    name: 'esercitazioni',
    defaults: EsercitazioniStateDefaults
})
export class EsercitazioniState {

    constructor(private esercitazioniService: EsercitazioniService) {
    }

    @Selector()
    static esercitazioni(state: EsercitazioniStateModel): any[] {
        return state.esercitazioni;
    }

    @Selector()
    static listaMezzi(state: EsercitazioniStateModel): MezzoEsercitazione[] {
        return state.listaMezzi;
    }

    @Selector()
    static listaSquadre(state: EsercitazioniStateModel): SquadraEsercitazione[] {
        return state.listaSquadre;
    }

    @Action(GetEsercitazioni)
    getEsercitazioni({ patchState }: StateContext<EsercitazioniStateModel>): void {
        this.esercitazioniService.getEsercitazioni().subscribe((esercitazioni: any[]) => {
            patchState({
                esercitazioni
            });
        });
    }

    @Action(AddEsercitazione)
    addEsercitazione({ dispatch }: StateContext<EsercitazioniStateModel>): void {
        const obj = {
            name: 'Esercitazione 1'
        } as any;
        this.esercitazioniService.addEsercitazione(obj).subscribe((esercitazione: any) => {
            console.log('Nuova Esercitazione', esercitazione);
            dispatch(new GetEsercitazioni());
        });
    }
}
