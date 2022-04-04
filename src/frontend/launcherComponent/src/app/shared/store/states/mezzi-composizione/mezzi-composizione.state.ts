import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { MezzoComposizione } from '../../../interface/mezzo-composizione-interface';
import {
    AddMezzoComposizione,
    ClearListaMezziComposizione,
    ClearMezzoComposizione,
    ClearSelectedMezziComposizione,
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    ReducerSelectMezzoComposizione,
    ReducerSelectMezzoComposizioneInRientro,
    ReducerSelectMezzoComposizionePreAccoppiati,
    RemoveMezzoComposizione,
    SelectMezzoComposizione,
    SelectMezzoComposizioneFromMappa,
    SetListaMezziComposizione,
    SganciamentoMezzoComposizione,
    UnselectMezzoComposizione,
    UpdateMezzoComposizione
} from '../../actions/mezzi-composizione/mezzi-composizione.actions';
import { patch, updateItem } from '@ngxs/store/operators';
import { ShowToastr } from '../../actions/toastr/toastr.actions';
import { ToastrType } from '../../../enum/toastr';
import { AddBoxPartenza, AddMezzoBoxPartenzaSelezionato, UpdateMezzoBoxPartenza } from '../../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { calcolaTimeout, mezzoComposizioneBusy } from '../../../helper/function-composizione';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { Partenza } from 'src/app/shared/model/partenza.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfermaPartenze } from '../../../../features/home/composizione-partenza/interface/conferma-partenze-interface';
import { TurnoState } from 'src/app/features/navbar/store/states/turno.state';
import { ConfirmPartenze } from '../../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { makeCopy } from '../../../helper/function-generiche';
import { SintesiRichiesteService } from '../../../../core/service/lista-richieste-service/lista-richieste.service';
import { SquadreComposizioneState } from '../squadre-composizione/squadre-composizione.state';
import { Injectable } from '@angular/core';
import { GetListeComposizioneAvanzata } from '../../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { ComposizionePartenzaState } from '../../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { GetListaMezziSquadre } from '../../actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ModificaPartenzaModalState } from '../modifica-partenza-modal/modifica-partenza-modal.state';
import { ClearSelectedSquadreComposizione, SelectSquadreComposizione } from '../../actions/squadre-composizione/squadre-composizione.actions';
import { SganciamentoMezzoModalComponent } from '../../../modal/sganciamento-mezzo-modal/sganciamento-mezzo-modal.component';
import { SetRichiestaSganciamento } from '../../../../features/home/store/actions/composizione-partenza/richiesta-sganciamento.actions';
import { StatoMezzo } from '../../../enum/stato-mezzo.enum';
import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';
import { AddConcorrenzaDtoInterface } from '../../../interface/dto/concorrenza/add-concorrenza-dto.interface';
import { AddConcorrenza, DeleteConcorrenza } from '../../actions/concorrenza/concorrenza.actions';

export interface MezziComposizioneStateStateModel {
    allMezziComposizione: MezzoComposizione[];
    mezziComposizione: MezzoComposizione[];
    idMezzoComposizioneSelezionato: string;
    idMezzoComposizioneHover: string;
    idMezzoSelezionato: string;
    idMezziInPrenotazione: string[];
    idMezziPrenotati: string[];
    idMezziBloccati: string[];
    mezzoSelezionato: MezzoComposizione;
}

export const MezziComposizioneStateDefaults: MezziComposizioneStateStateModel = {
    allMezziComposizione: null,
    mezziComposizione: null,
    idMezzoComposizioneSelezionato: null,
    idMezzoComposizioneHover: null,
    idMezzoSelezionato: null,
    idMezziPrenotati: [],
    idMezziInPrenotazione: [],
    idMezziBloccati: [],
    mezzoSelezionato: null
};

@Injectable()
@State<MezziComposizioneStateStateModel>({
    name: 'mezziComposizione',
    defaults: MezziComposizioneStateDefaults
})
export class MezziComposizioneState {

    @Selector()
    static mezziComposizione(state: MezziComposizioneStateStateModel): MezzoComposizione[] {
        return state.mezziComposizione;
    }

    @Selector()
    static allMezziComposizione(state: MezziComposizioneStateStateModel): MezzoComposizione[] {
        return state.allMezziComposizione;
    }

    @Selector()
    static mezzoSelezionato(state: MezziComposizioneStateStateModel): MezzoComposizione {
        let mezzoSelezionato = null as MezzoComposizione;
        if (state.idMezzoSelezionato && (state.idMezzoSelezionato === state.mezzoSelezionato.id)) {
            mezzoSelezionato = state.mezzoSelezionato;
        }
        return mezzoSelezionato;
    }

    @Selector()
    static idMezzoComposizioneSelezionato(state: MezziComposizioneStateStateModel): string {
        return state.idMezzoComposizioneSelezionato;
    }

    @Selector()
    static idMezzoSelezionato(state: MezziComposizioneStateStateModel): string {
        return state.idMezzoSelezionato;
    }

    @Selector()
    static idMezziInPrenotazione(state: MezziComposizioneStateStateModel): string[] {
        return state.idMezziInPrenotazione;
    }

    @Selector()
    static idMezziPrenotati(state: MezziComposizioneStateStateModel): string[] {
        return state.idMezziPrenotati;
    }

    @Selector()
    static idMezziBloccati(state: MezziComposizioneStateStateModel): string[] {
        return state.idMezziBloccati;
    }

    @Selector()
    static idMezzoHover(state: MezziComposizioneStateStateModel): string {
        return state.idMezzoComposizioneHover;
    }

    constructor(private store: Store,
                private richiesteService: SintesiRichiesteService,
                private modalService: NgbModal) {
    }

    @Action(SetListaMezziComposizione)
    setListaMezziComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SetListaMezziComposizione): void {
        const allMezziComposione = action.mezziComp ? action.mezziComp : this.store.selectSnapshot(MezziComposizioneState.allMezziComposizione);
        patchState({
            mezziComposizione: allMezziComposione,
            allMezziComposizione: allMezziComposione
        });
    }

    @Action(ClearListaMezziComposizione)
    clearListaMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState({
            mezziComposizione: null,
            allMezziComposizione: null
        });
    }

    @Action(AddMezzoComposizione)
    addMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>, action: AddMezzoComposizione): void {
        console.log(action.mezzoComp);
    }

    @Action(RemoveMezzoComposizione)
    removeMezzoComposizione({ getState, patchState }: StateContext<MezziComposizioneStateStateModel>, action: RemoveMezzoComposizione): void {
        console.log(action.idMezzoComp);
    }

    @Action(UpdateMezzoComposizione)
    updateMezzoComposizione({ getState, setState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UpdateMezzoComposizione): void {
        const state = getState();
        const mezzoComposizione = state.allMezziComposizione && state.allMezziComposizione.length > 0 ? state.allMezziComposizione.filter((mC: MezzoComposizione) => mC.mezzo.codice === action.mezzo.codice)[0] : null;
        const mezzoComposizioneCopy = mezzoComposizione ? makeCopy(mezzoComposizione) as MezzoComposizione : null;
        if (mezzoComposizione && mezzoComposizioneCopy) {
            mezzoComposizioneCopy.mezzo = action.mezzo;
            if (action.mezzo.stato !== StatoMezzo.InRientro) {
                mezzoComposizioneCopy.listaSquadre = null;
            }
            setState(
                patch({
                    allMezziComposizione: updateItem<MezzoComposizione>(mezzoComp => mezzoComp.mezzo.codice === action.mezzo.codice, mezzoComposizioneCopy),
                    mezziComposizione: updateItem<MezzoComposizione>(mezzoComp => mezzoComp.mezzo.codice === action.mezzo.codice, mezzoComposizioneCopy)
                })
            );
            dispatch(new UpdateMezzoBoxPartenza(mezzoComposizioneCopy));
        }
    }

    @Action(ReducerSelectMezzoComposizione)
    reducerSelectMezzoComposizione({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: ReducerSelectMezzoComposizione): void {
        const state = getState();
        const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
        const mezzoComp = action.mezzoComp;
        const mezzo = action.mezzoComp.mezzo;

        if (!mezzoComposizioneBusy(mezzo.stato)) {
            if (getMezzoCompNonPrenotato(state, mezzoComp.id)) {
                let addBoxPartenza = false;
                if (boxPartenzaList.length <= 0) {
                    addBoxPartenza = true;
                    dispatch(new AddBoxPartenza());
                }
                setTimeout(() => {
                    dispatch([
                        new SelectMezzoComposizione(mezzoComp),
                        new AddMezzoBoxPartenzaSelezionato(mezzoComp)
                    ]);
                }, calcolaTimeout(addBoxPartenza));
            } else if (state.idMezziPrenotati.indexOf(mezzoComp.id) !== -1) {
                dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza', null, null, true));
            } else if (state.idMezziInPrenotazione.indexOf(mezzoComp.id) !== -1) {
                dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente', null, null, true));
            }
        } else {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è ' + action.mezzoComp.mezzo.stato + ' ed è impegnato in un\'altra richiesta', null, null, true));
        }

        function getMezzoCompNonPrenotato(store: any, idMezzoComp: string): boolean {
            return store.idMezziPrenotati.indexOf(idMezzoComp) === -1 && store.idMezziInPrenotazione.indexOf(idMezzoComp) === -1;
        }
    }

    @Action(ReducerSelectMezzoComposizioneInRientro)
    reducerSelectMezzoComposizioneInRientro({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: ReducerSelectMezzoComposizioneInRientro): void {
        const state = getState();
        const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
        const mezzoComp = action.mezzoComp;

        if (getMezzoCompNonPrenotato(state, mezzoComp.id)) {
            let addBoxPartenza = false;
            if (boxPartenzaList.length <= 0) {
                addBoxPartenza = true;
                dispatch(new AddBoxPartenza());
            }
            setTimeout(() => {
                dispatch([
                    new SelectMezzoComposizione(mezzoComp),
                    new AddMezzoBoxPartenzaSelezionato(mezzoComp)
                ]);

                if (mezzoComp?.listaSquadre?.length) {
                    // Seleziono squadre in rientro con il mezzo in quel momento
                    dispatch([
                        new ClearSelectedSquadreComposizione(),
                    ]);
                    action.noSelect ? dispatch(new SelectSquadreComposizione(mezzoComp.listaSquadre, true)) : dispatch(new SelectSquadreComposizione(mezzoComp.listaSquadre));
                }
            }, calcolaTimeout(addBoxPartenza));
        } else if (state.idMezziPrenotati.indexOf(mezzoComp.id) !== -1) {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza', null, null, true));
        } else if (state.idMezziInPrenotazione.indexOf(mezzoComp.id) !== -1) {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente', null, null, true));
        }

        function getMezzoCompNonPrenotato(store: any, idMezzoComp: string): boolean {
            return store.idMezziPrenotati.indexOf(idMezzoComp) === -1 && store.idMezziInPrenotazione.indexOf(idMezzoComp) === -1;
        }
    }

    @Action(ReducerSelectMezzoComposizionePreAccoppiati)
    reducerSelectMezzoComposizionePreAccoppiati({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: ReducerSelectMezzoComposizioneInRientro): void {
        const state = getState();
        const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
        const mezzoComp = action.mezzoComp;

        if (getMezzoCompNonPrenotato(state, mezzoComp.id)) {
            let addBoxPartenza = false;
            if (boxPartenzaList.length <= 0) {
                addBoxPartenza = true;
                dispatch(new AddBoxPartenza());
            }
            setTimeout(() => {
                dispatch([
                    new SelectMezzoComposizione(mezzoComp, true),
                    new AddMezzoBoxPartenzaSelezionato(mezzoComp)
                ]);

                if (mezzoComp?.squadrePreaccoppiate?.length) {
                    // Seleziono squadre pre accoppiate con il mezzo in quel momento
                    dispatch([
                        new ClearSelectedSquadreComposizione(),
                    ]);
                    dispatch(new SelectSquadreComposizione(mezzoComp.squadrePreaccoppiate, false, true));
                }
            }, calcolaTimeout(addBoxPartenza));
        } else if (state.idMezziPrenotati.indexOf(mezzoComp.id) !== -1) {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è già presente in un\'altra partenza', null, null, true));
        } else if (state.idMezziInPrenotazione.indexOf(mezzoComp.id) !== -1) {
            dispatch(new ShowToastr(ToastrType.Warning, 'Impossibile assegnare il mezzo', 'Il mezzo è in prenotazione da un altro utente', null, null, true));
        }

        function getMezzoCompNonPrenotato(store: any, idMezzoComp: string): boolean {
            return store.idMezziPrenotati.indexOf(idMezzoComp) === -1 && store.idMezziInPrenotazione.indexOf(idMezzoComp) === -1;
        }
    }

    @Action(SelectMezzoComposizioneFromMappa)
    selectMezzoComposizioneFromMappa({ getState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SelectMezzoComposizioneFromMappa): void {
        if (action && action.mezzoId) {
            const mezzoComposizione = getState().mezziComposizione.filter(mezzo => mezzo.mezzo.codice === action.mezzoId);
            if (mezzoComposizione && mezzoComposizione[0]) {
                const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
                if (boxPartenzaList.length === 0) {
                    dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                } else {
                    const mezzoInList = boxPartenzaList.filter(boxPartenza => boxPartenza.mezzoComposizione && boxPartenza.mezzoComposizione.mezzo.codice === action.mezzoId);
                    mezzoInList && mezzoInList[0] ? console.log('Mezzo già selezionato') : dispatch(new ReducerSelectMezzoComposizione(mezzoComposizione[0]));
                }
            } else {
                console.error('id mezzo non trovato');
            }
        }
    }

    @Action(SelectMezzoComposizione)
    selectMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: any): void {
        if (action.mezzoComp.mezzo) {
            patchState({
                idMezzoComposizioneSelezionato: action.mezzoComp.mezzo.codice,
                idMezzoSelezionato: action.mezzoComp.mezzo.codice,
                mezzoSelezionato: action.mezzoComp,
            });
        }
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        const idBoxPartenzaSelezionato = this.store.selectSnapshot(x => x.boxPartenza.idBoxPartenzaSelezionato);
        const boxPartenzaList = this.store.selectSnapshot(x => x.boxPartenza.boxPartenzaList);
        const boxPartenzaSelezionato = boxPartenzaList.filter(x => x.id === idBoxPartenzaSelezionato)[0];

        if (boxPartenzaSelezionato && richiestaComposizione && (!boxPartenzaSelezionato?.squadreComposizione || boxPartenzaSelezionato?.squadreComposizione?.length <= 0) && !action.preaccoppiato) {
            dispatch(new GetListeComposizioneAvanzata());
        } else if (!richiestaComposizione) {
            dispatch(new GetListaMezziSquadre());
        }
    }

    @Action(UnselectMezzoComposizione)
    unselectMezzoComposizione({ patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: UnselectMezzoComposizione): void {
        const richiestaComposizione = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        const idSquadreSelezionate = this.store.selectSnapshot(SquadreComposizioneState.idSquadreSelezionate);

        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });

        if (idSquadreSelezionate && idSquadreSelezionate.length <= 0 && richiestaComposizione && !action.preventGet) {
            dispatch(new GetListeComposizioneAvanzata());
        } else if (!richiestaComposizione) {
            dispatch(new GetListaMezziSquadre());
        }
    }

    @Action(ClearSelectedMezziComposizione)
    clearSelectedMezziComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState({
            idMezzoComposizioneSelezionato: null,
            idMezzoSelezionato: null
        });
    }

    @Action(HoverInMezzoComposizione)
    hoverInMezzoComposizione({ getState, patchState, dispatch }: StateContext<MezziComposizioneStateStateModel>, action: HoverInMezzoComposizione): void {
        patchState({
            idMezzoComposizioneHover: action.idMezzoComp
        });
    }

    @Action(HoverOutMezzoComposizione)
    hoverOutMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState({
            idMezzoComposizioneHover: null
        });
    }

    @Action(ClearMezzoComposizione)
    clearMezzoComposizione({ patchState }: StateContext<MezziComposizioneStateStateModel>): void {
        patchState(MezziComposizioneStateDefaults);
    }

    @Action(SganciamentoMezzoComposizione)
    sganciamentoMezzoComposizione({ dispatch }: StateContext<MezziComposizioneStateStateModel>, action: SganciamentoMezzoComposizione): void {
        let partenzaDaSganciare = {} as Partenza;
        this.richiesteService.getRichiestaById(action.sganciamentoObj.idRichiestaDaSganciare).subscribe((richiesta: SintesiRichiesta) => {
            dispatch(new SetRichiestaSganciamento(richiesta));
            partenzaDaSganciare = richiesta.partenze?.length ? richiesta.partenze.filter(x => x.partenza.mezzo.codice === action.sganciamentoObj.idMezzoDaSganciare)[0] : null;
            if (richiesta && partenzaDaSganciare) {
                const partenza = partenzaDaSganciare.partenza;
                const obj = {
                    mezzo: {
                        codice: null,
                        descrizione: null,
                        stato: null,
                        genere: null,
                        distaccamento: {
                            codice: null,
                            descrizione: null
                        },
                    },
                    squadre: null
                } as any;
                if (partenza) {
                    obj.mezzo.codice = partenza.mezzo.codice;
                    obj.mezzo.descrizione = partenza.mezzo.descrizione;
                    obj.mezzo.stato = partenza.mezzo.stato;
                    obj.mezzo.genere = partenza.mezzo.genere;
                    obj.mezzo.distaccamento.codice = partenza.mezzo.distaccamento.codice;
                    obj.mezzo.distaccamento.descrizione = partenza.mezzo.distaccamento.descrizione;
                } else {
                    obj.mezzo = null;
                }
                if (partenza.squadre.length > 0) {
                    obj.squadre = partenza.squadre.map((squadraComp: any) => {
                        return squadraComp;
                    });
                } else {
                    obj.squadre = [];
                }
                let modalSganciamento;
                modalSganciamento = this.modalService.open(SganciamentoMezzoModalComponent, {
                    windowClass: 'xxlModal modal-holder',
                    backdropClass: 'light-blue-backdrop',
                    centered: true
                });
                modalSganciamento.componentInstance.idDaSganciare = action.sganciamentoObj.descrizione;
                modalSganciamento.componentInstance.codMezzoDaSganciare = action.sganciamentoObj.idMezzoDaSganciare;
                const data = {
                    value: action.sganciamentoObj.idMezzoDaSganciare,
                    type: TipoConcorrenzaEnum.Sganciamento
                } as AddConcorrenzaDtoInterface;
                this.store.dispatch(new AddConcorrenza([data]));

                let idRichiesta = null;
                const richiestaComposizione = this.store.selectSnapshot(x => x.composizionePartenza.richiesta);
                const modificaPartenzaCodRichiesta = this.store.selectSnapshot(ModificaPartenzaModalState.codRichiesta);

                if (richiestaComposizione) {
                    idRichiesta = richiestaComposizione?.codice;
                } else if (modificaPartenzaCodRichiesta) {
                    idRichiesta = this.store.selectSnapshot(ModificaPartenzaModalState.codRichiesta);
                } else if (action.sganciamentoObj?.idRichiesta) {
                    idRichiesta = action.sganciamentoObj.idRichiesta;
                }
                modalSganciamento.result.then((val) => {
                    this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Sganciamento, [action.sganciamentoObj.idMezzoDaSganciare]));
                    switch (val) {
                        case 'ok':
                            const partenzaObj: ConfermaPartenze = {
                                partenze: [obj],
                                idRichiesta,
                                turno: this.store.selectSnapshot(TurnoState.turnoCalendario).corrente,
                                idRichiestaDaSganciare: action.sganciamentoObj.idRichiestaDaSganciare,
                                idMezzoDaSganciare: action.sganciamentoObj.idMezzoDaSganciare
                            };
                            this.store.dispatch(new ConfirmPartenze(partenzaObj));
                            break;
                        case 'ko':
                            return;
                    }
                }, () => this.store.dispatch(new DeleteConcorrenza(TipoConcorrenzaEnum.Sganciamento, [action.sganciamentoObj.idMezzoDaSganciare])));
            }
        });
    }
}
