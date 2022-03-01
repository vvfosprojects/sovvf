import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { MezzoActionInterface } from '../../../../shared/interface/mezzo-action.interface';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { PermissionFeatures } from '../../../../shared/enum/permission-features.enum';
import { EnteInterface } from '../../../../shared/interface/ente.interface';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { TipoConcorrenzaEnum } from '../../../../shared/enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaRichiesteComponent implements OnChanges {

    @Input() ricerca: string;
    @Input() richieste: SintesiRichiesta[] = [];
    @Input() richiestaHover: SintesiRichiesta;
    @Input() idRichiestaSelezionata: string;
    @Input() richiestaFissata: SintesiRichiesta;
    @Input() richiestaGestione: SintesiRichiesta;
    @Input() listHeightClass: string;
    @Input() boxAttivi: boolean;
    @Input() listaEnti: EnteInterface[];

    // Loading
    @Input() loading: boolean;
    @Input() needRefresh: boolean;
    @Input() loadingActionRichiesta: string[] = [];
    @Input() loadingActionMezzo: string[] = [];
    @Input() loadingProgressBarMezzo: string[] = [];
    @Input() diffDateInfoMezzo: string[] = [];
    @Input() loadingEliminaPartenza: boolean;

    // Paginazione
    @Input() page: number;
    @Input() pageSize: number;
    @Input() totalItems: number;

    // FIltri Selezionati
    @Input() codiciFiltriSelezionati: string[];

    // Night Mode
    @Input() nightMode: boolean;

    @Input() annullaStatoMezzi: string[];

    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() pageChange = new EventEmitter<number>();
    @Output() refresh = new EventEmitter<boolean>();
    @Output() fissaInAlto = new EventEmitter<SintesiRichiesta>();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<boolean>();
    @Output() selezione = new EventEmitter<{ idRichiesta: string, coordinate: Coordinate }>();
    @Output() deselezione = new EventEmitter<boolean>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() eliminaPartenza = new EventEmitter<{ targaMezzo: string, idRichiesta: string, modalResult: any }>();

    methods = new HelperSintesiRichiesta();
    scrolling = false;
    statoRichiesta = StatoRichiesta;

    actionRichiestaArray: any = [];

    // ENUM
    permessiFeature = PermissionFeatures;
    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor() {
    }

    ngOnChanges(): void {
        if (this.loadingActionRichiesta && !this.actionRichiestaArray.includes(this.loadingActionRichiesta)) {
            this.actionRichiestaArray.push(this.loadingActionRichiesta);
        } else if (!this.loadingActionRichiesta) {
            this.actionRichiestaArray.shift();
        }
    }

    /* Gestisce il singolo click sulla richiesta */
    richiestaClick(richiesta: SintesiRichiesta): void {
        if (richiesta?.id !== this.idRichiestaSelezionata) {
            this.selezione.emit({ idRichiesta: richiesta.id, coordinate: richiesta.localita.coordinate });
        } else if (richiesta?.id !== this.richiestaGestione?.id) {
            this.deselezione.emit(true);
        }
    }

    /* Gestisce il singolo click sulla richiesta */
    onDeselezionaRichiesta(value: boolean): void {
        this.deselezione.emit(value);
    }

    /* Fissa in alto la richiesta */
    onFissaInAlto(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.fissaInAlto.emit(richiesta);
        }
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any): void {
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
    }

    /* Gestisce l'hover in */
    richiestaHoverIn(id: string): void {
        if (id) {
            this.hoverIn.emit(id);
        }
    }

    /* Gestisce l'hover out */
    richiestaHoverOut(id: string): void {
        if (id) {
            this.hoverOut.emit(true);
        }
    }

    onModificaRichiesta(richiesta: SintesiRichiesta): void {
        this.modificaRichiesta.emit(richiesta);
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta): void {
        this.gestioneRichiesta.emit(richiesta);
    }

    translatePositionRichiesta(r: SintesiRichiesta, index: number): string {
        // TODO: Possibile ottimizzazione
        let output = '';
        const richiestaNonEspansa = this.richiestaGestione && this.richiestaGestione?.id && (this.richiestaGestione?.id !== r.id);
        const richiestaEspansa = this.richiestaGestione && this.richiestaGestione?.id && (this.richiestaGestione?.id === r.id);
        const terzultimaRichiestaEspansa = this.richieste.length >= 3 && index === this.richieste.length - 3 && this.richiestaGestione && this.richiestaGestione?.id && (this.richiestaGestione?.id === r.id);
        const penultimaRichiestaEspansa = this.richieste.length >= 4 && index === this.richieste.length - 2 && this.richiestaGestione && this.richiestaGestione?.id && (this.richiestaGestione?.id === r.id);
        const ultimaRichiestaEspansa = this.richieste.length >= 6 && index === this.richieste.length - 1 && this.richiestaGestione && this.richiestaGestione?.id && (this.richiestaGestione?.id === r.id);

        // Se non c'è richiesta espansa allora non c'è variazione
        if (!this.richiestaGestione || (this.richiestaGestione && this.richiestaFissata && this.richiestaGestione.id === this.richiestaFissata.id)) {
            return output = '';
        } else {
            if (terzultimaRichiestaEspansa && this.richiestaFissata) {
                output = 'translate-mod-1';
            }
            if (penultimaRichiestaEspansa) {
                // controllo se la richiesta espansa è la penultima della lista
                output = 'translate-penultima';
                if (this.richiestaFissata) {
                    if (r.partenze && r.partenze.length) {
                        let countPartenzeInCorso = 0;
                        r.partenze.forEach(x => !x.partenza.partenzaAnnullata && !x.partenza.sganciata && !x.partenza.terminata ? countPartenzeInCorso++ : null);
                        // controllo se box sono attivi
                        if (this.boxAttivi) {
                            // controllo quante partenze in corso ci sono
                            switch (countPartenzeInCorso) {
                                case 1:
                                    output = 'translate-mod-1';
                                    break;
                                case 2:
                                    output = 'translate-mod-2';
                                    break;
                                default:
                                    output = 'translate-ultima';
                            }
                            // controllo se è annullata - sganciata - terminata
                            if (countPartenzeInCorso === 0) {
                                output = 'translate-mod-1';
                            }
                        } else {
                            // controllo quante partenze in corso ci sono
                            switch (countPartenzeInCorso) {
                                case 1:
                                    output = 'translate-mod-3';
                                    break;
                                case 2:
                                    output = 'translate-mod-4';
                                    break;
                                default:
                                    output = 'translate-mod-5';
                            }
                            // controllo se è annullata - sganciata - terminata
                            if (countPartenzeInCorso === 0) {
                                output = 'translate-mod-3';
                            }
                        }

                        // controllo se box non sono attivi
                        if (!this.boxAttivi && !richiestaEspansa) {
                            output = output + ' pt-penultima';
                        }
                    }
                }
            } else if (ultimaRichiestaEspansa) {
                // controllo se la richiesta espansa è l'ultima della lista
                output = 'translate-mod-5';
                if (!this.boxAttivi) {
                    output = 'translate-mod-2';
                }
                if (r.partenze && r.partenze.length) {
                    let countPartenzeInCorso = 0;
                    r.partenze.forEach(x => !x.partenza.partenzaAnnullata && !x.partenza.sganciata && !x.partenza.terminata ? countPartenzeInCorso++ : null);
                    // controllo se box sono attivi
                    if (this.boxAttivi) {
                        // controllo quante partenze in corso ci sono
                        switch (countPartenzeInCorso) {
                            case 1:
                                output = 'translate-mod-1';
                                break;
                            case 2:
                                output = 'translate-mod-2';
                                break;
                            default:
                                output = 'translate-ultima';
                        }
                        // controllo se è annullata - sganciata - terminata
                        if (countPartenzeInCorso === 0) {
                            output = 'translate-mod-1';
                        }
                    } else {
                        // controllo quante partenze in corso ci sono
                        switch (countPartenzeInCorso) {
                            case 1:
                                output = 'translate-mod-3';
                                break;
                            case 2:
                                output = 'translate-mod-4';
                                break;
                            default:
                                output = 'translate-mod-5';
                        }
                        // controllo se è annullata - sganciata - terminata
                        if (countPartenzeInCorso === 0) {
                            output = 'translate-mod-3';
                        }
                    }

                    // controllo se box non sono attivi
                    if (!this.boxAttivi && !richiestaEspansa) {
                        output = output + ' pt-penultima';
                    }
                }
            } else if (richiestaNonEspansa && !(this.richiestaFissata && (this.richiestaGestione.id === this.richiestaFissata.id))) {
                output = 'translate-none';

                // aggiungo il padding all richiesta successiva della richiesta espansa in modo da traslare tutta la lista
                this.richieste.forEach((x, i) => x.id === this.richiestaGestione.id && (i + 1 === index) ? output = 'pt-translate' : null);
            }

            if (this.richiestaFissata) {
                output = output + ' position relative';
                // se la richiesta espansa è quella fissata allora non traslo le altre richieste
                if (this.richiestaGestione.id === this.richiestaFissata.id) {
                    output = output.replace('pt-translate', '');
                }
            }
            // se non è la richiesta espansa
            if (richiestaNonEspansa && !(this.richiestaFissata && (this.richiestaGestione.id === this.richiestaFissata.id))) {
                output = output + ' opacity-50 z-index-none';
            }
            // se è la richiesta espansa
            if (richiestaEspansa && !(this.richiestaFissata && (this.richiestaGestione.id === this.richiestaFissata.id))) {
                output = output + ' z-index-2 position-absolute bg-whitesmoke';
            }
        }

        return output;
    }

    heightControl(): string {
        return this.listHeightClass;
    }

    loadHeightControl(): string {
        if (!this.richiestaFissata) {
            if (this.boxAttivi) {
                return 'm-h-710';
            } else {
                return 'm-h-845';
            }
        }
    }

    cardClasses(r: SintesiRichiesta): any {
        const richiestaSelezionataId = this.idRichiestaSelezionata ? this.idRichiestaSelezionata : null;
        const richiestaHoverId = this.richiestaHover ? this.richiestaHover.id : null;
        return this.methods.cardClasses(r, richiestaSelezionataId, richiestaHoverId);
    }
}
