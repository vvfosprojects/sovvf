import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, OnDestroy, isDevMode } from '@angular/core';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { MezzoActionInterface } from '../../../../shared/interface/mezzo-action.interface';
import { RichiestaActionInterface } from '../../../../shared/interface/richiesta-action.interface';

@Component({
    selector: 'app-richiesta-fissata',
    templateUrl: './richiesta-fissata.component.html',
    styleUrls: ['./richiesta-fissata.component.css']
})
export class RichiestaFissataComponent implements OnInit, OnDestroy {
    @Input() _split: boolean;
    @Input() richiestaFissata: SintesiRichiesta;
    @Input() idRichiesteEspanse: string[] = [];
    @Input() richiestaGestione: SintesiRichiesta;

    // Permessi
    @Input() disabledModificaRichiesta = false;
    @Input() disabledGestisciRichiesta = false;
    @Input() disabledComposizionePartenza = false;

    @Output() eventiRichiesta = new EventEmitter<string>();
    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() defissa = new EventEmitter<any>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() outEspansoId = new EventEmitter<string>();
    @Output() outEspanso = new EventEmitter<boolean>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() actionRichiesta = new EventEmitter<RichiestaActionInterface>();
    @Output() eliminaPartenza = new EventEmitter<{ targaMezzo: string, idRichiesta: string, modalResult: any }>();

    @ViewChild('richiestaContainer') private richiestaContainer: ElementRef;
    @ViewChild('richiesta') private richiesta: ElementRef;

    methods = new HelperSintesiRichiesta;

    private playerContainer: AnimationPlayer;
    private playerRichiesta: AnimationPlayer;

    constructor(private animationBuilder: AnimationBuilder) {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente RichiestaFissata creato');
        if (this.richiestaFissata) {
            this.animazioneIn();
            const result = !!this.idRichiesteEspanse.includes(this.richiestaFissata.id);
            setTimeout(() => this.outEspanso.emit(result));
        }
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente RichiestaFissata distrutto');
    }

    // Ritorna la richiesta nella lista, defissandola
    onDefissa() {
        this.animazioneOut();
        this.defissa.emit();
    }

    // Animazioni
    createAnimazioneIn() {
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

        this.playerContainer = animationContainerRichiesta.create(this.richiestaContainer.nativeElement);
        this.playerRichiesta = animationRichiesta.create(this.richiesta.nativeElement);
    }

    createAnimazioneOut() {
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

    animazioneIn() {
        this.createAnimazioneIn();
        this.playerContainer.play();
        this.playerRichiesta.play();
    }

    animazioneOut() {
        this.createAnimazioneOut();
        this.playerContainer.play();
        this.playerRichiesta.play();
    }

    visualizzaEventiRichiesta(idRichiesta: string) {
        this.eventiRichiesta.emit(idRichiesta);
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: SintesiRichiesta) {
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
        console.log(richiesta);
    }

    onModificaRichiesta(richiesta: SintesiRichiesta) {
        this.modificaRichiesta.emit(richiesta);
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta) {
        this.gestioneRichiesta.emit(richiesta);
    }

    setEspanso() {
        this.outEspanso.emit();
    }

    /* NgClass Template */
    cardFissataClasses(r: any) {
        return this.methods.cardFissataClasses(r);
    }

    isEspanso(id: string) {
        if (this.idRichiesteEspanse && id) {
            return this.idRichiesteEspanse.includes(id);
        }
    }

}
