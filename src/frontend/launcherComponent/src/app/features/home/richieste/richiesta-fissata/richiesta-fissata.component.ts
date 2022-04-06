import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { MezzoActionInterface } from '../../../../shared/interface/mezzo-action.interface';
import { ModificaStatoFonogrammaEmitInterface } from '../../../../shared/interface/modifica-stato-fonogramma-emit.interface';
import { EnteInterface } from '../../../../shared/interface/ente.interface';
import { Coordinate } from '../../../../shared/model/coordinate.model';

@Component({
    selector: 'app-richiesta-fissata',
    templateUrl: './richiesta-fissata.component.html',
    styleUrls: ['./richiesta-fissata.component.css']
})

export class RichiestaFissataComponent implements OnInit, OnDestroy {

    @Input() richiestaFissata: SintesiRichiesta;
    @Input() richiestaGestione: SintesiRichiesta;
    @Input() idRichiestaSelezionata: string;
    @Input() richiestaHover: SintesiRichiesta;
    @Input() listaEnti: EnteInterface[];
    @Input() nightMode: boolean;

    // Permessi
    @Input() disabledModificaRichiesta: boolean;
    @Input() disabledComposizionePartenza: boolean;
    @Input() disabledModificaStatoMezzo: boolean;

    @Input() loadingActionRichiesta: string[];

    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() defissa = new EventEmitter<any>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() outEspanso = new EventEmitter<boolean>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() eliminaPartenza = new EventEmitter<{ targaMezzo: string, idRichiesta: string, modalResult: any }>();
    @Output() modificaStatoFonogramma = new EventEmitter<ModificaStatoFonogrammaEmitInterface>();
    @Output() clickIndirizzo = new EventEmitter<{ idRichiesta: string, coordinate: Coordinate }>();
    @Output() selezione = new EventEmitter<{ idRichiesta: string, coordinate: Coordinate }>();
    @Output() deselezione = new EventEmitter<boolean>();

    @ViewChild('richiestaContainer') private richiestaContainer: ElementRef;
    @ViewChild('richiesta') private richiesta: ElementRef;

    methods = new HelperSintesiRichiesta();

    private playerContainer: AnimationPlayer;
    private playerRichiesta: AnimationPlayer;

    constructor(private animationBuilder: AnimationBuilder) {
    }

    ngOnInit(): void {
        console.log('Componente RichiestaFissata creato');
        if (this.richiestaFissata) {
            this.animazioneIn();
        }
    }

    ngOnDestroy(): void {
        console.log('Componente RichiestaFissata distrutto');
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

    // Ritorna la richiesta nella lista, defissandola
    onDefissa(): void {
        this.animazioneOut();
        this.defissa.emit();
    }

    // Animazioni
    createAnimazioneIn(): void {
        if (this.playerContainer) {
            this.playerContainer.destroy();
        } else if (this.playerRichiesta) {
            this.playerRichiesta.destroy();
        }

        const animationContainerRichiesta = this.animationBuilder
            .build([
                style({ height: '0', width: '0' }),
                animate(450, style({ height: '100%', width: '100%' }))
            ]);

        const animationRichiesta = this.animationBuilder
            .build([
                style({ height: '0', opacity: '0' }),
                animate(350, style({ height: 'auto', opacity: '1' }))
            ]);

        if (this.richiestaContainer) {
            this.playerContainer = animationContainerRichiesta.create(this.richiestaContainer.nativeElement);
        }
        if (this.richiesta) {
            this.playerRichiesta = animationRichiesta.create(this.richiesta.nativeElement);
        }
    }

    createAnimazioneOut(): void {
        if (this.playerContainer) {
            this.playerContainer.destroy();
        } else if (this.playerRichiesta) {
            this.playerRichiesta.destroy();
        }

        const animationContainerRichiesta = this.animationBuilder
            .build([
                style({ width: '100%' }),
                animate(300, style({ width: '0' }))
            ]);

        const animationRichiesta = this.animationBuilder
            .build([
                style({ height: 'auto', opacity: '1' }),
                animate(300, style({ height: '0', opacity: '0' }))
            ]);

        this.playerContainer = animationContainerRichiesta.create(this.richiestaContainer.nativeElement);
        this.playerRichiesta = animationRichiesta.create(this.richiesta.nativeElement);
    }

    animazioneIn(): void {
        this.createAnimazioneIn();
        if (this.playerContainer) {
            this.playerContainer.play();
        }
        if (this.playerRichiesta) {
            this.playerRichiesta.play();
        }
    }

    animazioneOut(): void {
        this.createAnimazioneOut();
        if (this.playerContainer) {
            this.playerContainer.play();
        }
        if (this.playerRichiesta) {
            this.playerRichiesta.play();
        }
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: SintesiRichiesta): void {
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
        console.log(richiesta);
    }

    onModificaRichiesta(richiesta: SintesiRichiesta): void {
        this.modificaRichiesta.emit(richiesta);
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta): void {
        this.gestioneRichiesta.emit(richiesta);
    }

    cardClasses(r: SintesiRichiesta): any {
        const richiestaSelezionataId = this.idRichiestaSelezionata ? this.idRichiestaSelezionata : null;
        const richiestaHoverId = this.richiestaHover ? this.richiestaHover.id : null;
        return this.methods.cardClasses(r, richiestaSelezionataId, richiestaHoverId);
    }

    translatePositionRichiesta(r: SintesiRichiesta): string {
        let output = '';
        if (r) {
            output = output + ' z-index-1 position absolute';
        }
        return output;
    }
}
