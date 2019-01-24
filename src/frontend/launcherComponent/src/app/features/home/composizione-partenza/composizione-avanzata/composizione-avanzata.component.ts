import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

// Service
import { CompPartenzaManagerService } from '../../../../core/manager/comp-partenza-manager/comp-partenza-manager.service';
import { DirectionService } from '../../maps/service/direction-service/direction-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';

// Interface
import { BoxPartenza } from '../interface/box-partenza-interface';
import { MezzoComposizione } from '../interface/mezzo-composizione-interface';
import { SquadraComposizione } from '../interface/squadra-composizione-interface';
import { DirectionInterface } from '../../maps/service/direction-service/direction-interface';

// Model
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { mcall } from 'q';

@Component({
    selector: 'app-composizione-avanzata',
    templateUrl: './composizione-avanzata.component.html',
    styleUrls: ['./composizione-avanzata.component.css']
})
export class ComposizioneAvanzataComponent implements OnInit, OnChanges, OnDestroy {
    @Input() richiesta: SintesiRichiesta;

    subscription = new Subscription();
    mezziComposizione: MezzoComposizione[];
    squadreComposizione: SquadraComposizione[];
    partenze: BoxPartenza[] = [];

    // Partenza
    partenzaCorrente: BoxPartenza;
    idPartenzaCorrente: string;
    indexPartenzaCorrente: number;
    buttonConferma = false;

    // Mappa
    centroMappa: CentroMappa;
    @Input() dismissEvents: Observable<boolean>;
    @Output() centroMappaEmit: EventEmitter<CentroMappa> = new EventEmitter();

    interval = [];

    constructor(private compPartenzaManager: CompPartenzaManagerService,
        private directionService: DirectionService,
        private markerService: MarkerService,
        private centerService: CenterService,
        private popoverConfig: NgbPopoverConfig,
        private tooltipConfig: NgbTooltipConfig) {
        // Popover options
        this.popoverConfig.container = 'body';
        this.popoverConfig.placement = 'top';
        // Tooltip options
        this.tooltipConfig.container = 'body';
        this.tooltipConfig.placement = 'top';

        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.compPartenzaManager.getMezziComposizione().subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.compPartenzaManager.getSquadre().subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = squadreComp;
            })
        );
    }

    ngOnInit() {
        this.setInitCentroMappa();
        this.subscription.add(this.dismissEvents.subscribe(
            events => this.annullaPartenza(events)
        ));

        this.deselezionaMezziComposizione();
        this.deselezionaSquadreComposizione();
    }

    ngOnChanges() {
        this.buttonConferma = this.validaBoxPartenze();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Metodi richiamati dagli eventi di output
    validateMezzoSelezionato(mezzo: MezzoComposizione) {
        if (!this.partenzaCorrente) {
            this.mezzoSelezionato(mezzo);
        } else if (this.partenzaCorrente && this.partenzaCorrente.mezzoComposizione !== null) {
            this.deselezionaMezziComposizioneExceptOne(this.partenzaCorrente.mezzoComposizione);
            // TEST
            // console.error('Non puoi, devi prima sbloccare il mezzo');
        }
    }

    mezzoSelezionato(mezzo: MezzoComposizione) {
        // Imposto il mezzo per la partenza attuale
        this.setMezzo(mezzo);
    }

    mezzoDeselezionato(mezzo: MezzoComposizione) {
        // Unsetto il mezzo per la partenza attuale
        this.unsetMezzo(mezzo);

        // Interazione con Mappa
        this.annullaPartenza(true);
        this.centraMappa(this.richiesta, 'centra');
    }

    squadraSelezionata(squadra: SquadraComposizione) {
        // Setto la squadra per la partenza attuale
        this.setSquadra(squadra);
    }

    squadraDeselezionata(squadra: SquadraComposizione) {
        // Unsetto la squadra per la partenza attuale
        this.unsetSquadra(squadra);
    }

    boxPartenzaSelezionato(partenza: BoxPartenza) {
        this.selezionaBoxPartenza(partenza);
    }

    // Partenza
    initPartenzaVuota() {
        this.partenze.push({ id: this.generateUniqueId(), squadraComposizione: [], mezzoComposizione: null, selezionato: true, hover: false });
        const length = this.partenze.length;
        this.idPartenzaCorrente = this.partenze[length - 1].id;
        this.setPartenzaAttuale(this.idPartenzaCorrente);
        // TEST
        // console.log('Partenze', this.partenze);
        // console.log('Id Partenza Corrente:', this.idPartenzaCorrente);
        // console.log('Index Partenza Corrente:', this.indexPartenzaCorrente);
    }

    nuovaPartenza(noValidate?: boolean) {
        if (!noValidate && this.partenzaCorrente) {
            if (this.validaBoxPartenza(this.partenzaCorrente)) {
                this.bloccaMezzo(this.partenzaCorrente.mezzoComposizione);
                this.deselezionaBoxPartenza(this.partenzaCorrente);
                this.initPartenzaVuota();
            } else {
                console.error('[CompA] BoxPartenza non valido');
            }
        } else {
            this.initPartenzaVuota();
        }
    }

    setPartenzaAttuale(idPartenzaCorrente: string) {
        if (this.partenze.length > 0) {
            this.partenze.forEach((p, index) => {
                if (p.id === idPartenzaCorrente) {
                    this.indexPartenzaCorrente = index;
                }
            });
            this.partenzaCorrente = this.partenze[this.indexPartenzaCorrente];
        }
    }

    unsetPartenzaAttuale() {
        this.partenzaCorrente = null;
    }

    // Mezzo
    setMezzo(mezzo: MezzoComposizione) {
        if (this.partenzaCorrente) {
            this.partenzaCorrente.mezzoComposizione = mezzo;
            this.deselezionaMezziComposizioneExceptOne(mezzo);
            mezzo.selezionato = true;
        } else {
            this.initPartenzaVuota();
            this.setMezzo(mezzo);
        }
        // TEST
        // console.log('[CompA] Mezzo settato, partenza', this.partenzaCorrente);
    }

    unsetMezzo(mezzo: MezzoComposizione) {
        if (this.partenzaCorrente) {
            this.partenzaCorrente.mezzoComposizione = null;
            mezzo.selezionato = false;

            // Timeout
            this.stopTimeout(mezzo, false);
        } else {
            console.error('[CompA] Non posso eliminare il mezzo se non esiste la partenza');
        }
        // TEST
        // console.log('[CompA] Mezzo unsettato, partenza', this.partenzaCorrente);
    }

    deselezionaMezziComposizione() {
        this.mezziComposizione.forEach(mC => {
            mC.selezionato = false;
        });
    }

    deselezionaMezziComposizioneExceptOne(mezzo: MezzoComposizione) {
        this.mezziComposizione.forEach(mC => {
            if (mezzo !== mC) {
                mC.selezionato = false;
            }
        });
    }

    selezionaMezzoComposizione(partenza: BoxPartenza) {
        this.deselezionaMezziComposizione();
        if (partenza.mezzoComposizione) {
            partenza.mezzoComposizione.selezionato = true;
        }
    }

    bloccaMezzo(mezzo: MezzoComposizione) {
        this.mezziComposizione.forEach(mC => {
            if (mezzo === mC) {
                mC.bloccato = true;
            }
        });
        console.log('Mezzo bloccato', mezzo);
    }

    sbloccaMezzo(mezzo: MezzoComposizione) {
        this.mezziComposizione.forEach(mC => {
            if (mezzo === mC) {
                mC = mezzo;
            }
        });
        console.log('Mezzo sbloccato', mezzo);
    }

    sbloccaMezzoByPartenza(partenza: BoxPartenza) {
        partenza.mezzoComposizione.bloccato = false;
        console.log('Box partenza eliminato, mezzo relativo alla partenza sbloccato', partenza);
    }

    deselezionaMezziByPartenza(partenza: BoxPartenza) {
        if (partenza) {
            this.sbloccaMezzoByPartenza(partenza);
            partenza.mezzoComposizione.selezionato = false;
            partenza.mezzoComposizione = null;
        }
    }

    // Squadra
    setSquadra(squadra: SquadraComposizione) {
        if (this.partenzaCorrente) {
            this.partenzaCorrente.squadraComposizione.push(squadra);
        } else {
            this.initPartenzaVuota();
            this.setSquadra(squadra);
        }
        // TEST
        // console.log('[CompA] Squadra settata, partenza', this.partenzaCorrente);
    }

    unsetSquadra(squadra: SquadraComposizione) {
        if (this.partenzaCorrente) {
            this.partenzaCorrente.squadraComposizione.forEach((s: SquadraComposizione, index) => {
                s === squadra && this.partenzaCorrente.squadraComposizione.splice(index, 1);
            });
        }
        // TEST
        // console.log('[CompA] Squadra unsettata, partenza', this.partenzaCorrente);
    }

    selezionaSquadrePartenza(partenza: BoxPartenza) {
        this.deselezionaSquadreComposizione();
        partenza.squadraComposizione.forEach(s => {
            s.selezionato = true;
        });
    }

    deselezionaSquadreComposizione() {
        this.squadreComposizione.forEach(sC => {
            sC.selezionato = false;
        });
    }

    // Box Partenza
    selezionaBoxPartenza(partenza: BoxPartenza, noValidate?: boolean) {
        if (!noValidate && this.partenzaCorrente) {
            if (this.validaBoxPartenza(this.partenzaCorrente)) {
                this.deselezionaBoxPartenza(this.partenzaCorrente);
                this.bloccaMezzo(this.partenzaCorrente.mezzoComposizione);
            } else {
                this.eliminaBoxPartenza(this.partenzaCorrente);
            }
        }
        if (this.partenze.length > 0) {
            /* this.bloccaMezzo(this.partenzaCorrente.mezzoComposizione); */
            partenza.selezionato = true;
            this.idPartenzaCorrente = partenza.id;
            this.setPartenzaAttuale(this.idPartenzaCorrente);
            this.selezionaSquadrePartenza(this.partenzaCorrente);
            this.selezionaMezzoComposizione(this.partenzaCorrente);
            // console.log('Partenza corrente', this.partenzaCorrente);
        }
    }

    deselezionaBoxPartenza(partenza: BoxPartenza) {
        if (partenza) {
            partenza.selezionato = false;
        }
        this.deselezionaMezziComposizione();
        this.deselezionaSquadreComposizione();
    }

    eliminaBoxPartenza(partenza: BoxPartenza) {
        if (this.partenzaCorrente) {
            this.bloccaMezzo(this.partenzaCorrente.mezzoComposizione);
        }
        if (this.partenze.length > 0) {
            if (partenza.mezzoComposizione) {
                this.sbloccaMezzoByPartenza(partenza);
                this.stopTimeout(partenza.mezzoComposizione, false);
            }
            this.partenze.forEach((p, index) => {
                if (partenza === p) {
                    this.partenze.splice(index, 1);
                }
            });
            this.deselezionaMezziComposizione();
            this.deselezionaSquadreComposizione();
            if (this.partenze[this.partenze.length - 1]) {
                this.deselezionaBoxPartenza(this.partenzaCorrente);
                this.selezionaBoxPartenza(this.partenze[this.partenze.length - 1], true);
            } else {
                this.partenzaCorrente = null;
            }
        }

        // Interazione con Mappa
        this.annullaPartenza(true);
        this.centraMappa(this.richiesta, 'centra');
    }


    validaBoxPartenza(partenza: BoxPartenza) {
        if ((partenza.mezzoComposizione && partenza.squadraComposizione.length > 0) || (!partenza.mezzoComposizione && partenza.squadraComposizione.length > 0)) {
            return true;
        }
    }

    validaBoxPartenze(): boolean {
        let result = false;
        if (this.partenze.length > 0) {
            const partenzeLength = this.partenze.length;
            let partenzeValidate = 0;

            this.partenze.forEach(p => {
                if (this.validaBoxPartenza(p)) {
                    partenzeValidate += 1;

                    if (partenzeValidate === partenzeLength) {
                        result = true;
                    }
                }
            });
        }
        return result;
    }

    searchPartenzaByMezzo(mezzo: MezzoComposizione) {
        let partenza: BoxPartenza;
        this.partenze.forEach(p => {
            if (p.mezzoComposizione === mezzo) {
                partenza = p;
            }
        });
        return partenza;
    }

    // Id Maker
    generateUniqueId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Progress bar
    startTimeout(mezzo: MezzoComposizione) {
        this.stopTimeoutAllExceptOne(mezzo);
        if (mezzo.selezionato) {
            const maxProgressBar = 30;
            const minutesToAdd = 1;
            const now = new Date;
            const dataScadenza = addMinutes(new Date, minutesToAdd);
            mezzo.dataScadenzaTimeout = dataScadenza;
            mezzo.timeout = (mezzo.dataScadenzaTimeout.getMinutes() - now.getMinutes()) * maxProgressBar;

            this.interval[mezzo.id] = setInterval(() => {
                mezzo.timeout -= .3;

                if (mezzo.timeout <= 0) {
                    this.stopTimeout(mezzo, true);
                }
            }, 300);
            // TEST
            // console.log('Data Scadenza', dataScadenza);
            // console.log('Timeout', mezzo.timeout);
        }

        function addMinutes(date: any, minutes: any) {
            return new Date(date.getTime() + minutes * 60000);
        }
    }

    stopTimeout(mezzo: MezzoComposizione, deseleziona: boolean) {
        mezzo.dataScadenzaTimeout = null;
        mezzo.timeout = null;
        this.interval[mezzo.id] ? clearInterval(this.interval[mezzo.id]) : console.error('Interval[' + mezzo.id + '] non presente');

        if (deseleziona) {
            const partenzaTrovata = this.searchPartenzaByMezzo(mezzo);
            this.deselezionaMezziByPartenza(partenzaTrovata);
        }
    }

    stopTimeoutAllExceptOne(mezzo: MezzoComposizione) {
        this.mezziComposizione.forEach(mC => {
            if (mC !== mezzo && mC.timeout && !mC.bloccato) {
                this.stopTimeout(mC, true);
            }
        });
        this.mezzoSelezionato(mezzo);
    }

    // Interazione con Mappa
    mezzoCoordinate(event: Coordinate): void {
        if (event && this.richiesta.localita.coordinate) {
            const direction: DirectionInterface = {
                origin: {
                    lat: event.latitudine,
                    lng: event.longitudine
                },
                destination: {
                    lat: this.richiesta.localita.coordinate.latitudine,
                    lng: this.richiesta.localita.coordinate.longitudine
                },
                isVisible: true
            };
            this.directionService.sendDirection(direction);
        } else {
            console.error('coordinate mezzo / coordinate richiesta non presenti');
            this.directionService.clearDirection();
            this.centraMappa(null, '', this.centroMappa);
        }
    }

    setInitCentroMappa(): void {
        const currentZoom = this.centerService.getCurrentZoom();
        this.centroMappa = new CentroMappa(this.richiesta.localita.coordinate, currentZoom);
        this.centroMappaEmit.emit(this.centroMappa);
        this.centraMappa(this.richiesta, 'centra');
    }

    centraMappa(richiesta: SintesiRichiesta, action: string, centroMappa?: CentroMappa): void {
        this.markerService.partenza(richiesta ? richiesta.id : null, action, centroMappa);
    }

    annullaPartenza(event: boolean): void {
        if (event) {
            this.directionService.clearDirection();
        }
    }
}
