import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { MezzoActionInterface } from '../../../../shared/interface/mezzo-action.interface';
import { ModificaStatoFonogrammaEmitInterface } from '../../../../shared/interface/modifica-stato-fonogramma-emit.interface';

@Component({
    selector: 'app-richiesta-fissata',
    templateUrl: './richiesta-fissata.component.html',
    styleUrls: ['./richiesta-fissata.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichiestaFissataComponent implements OnInit, OnDestroy {

    @Input() richiestaFissata: SintesiRichiesta;
    @Input() idRichiesteEspanse: string[] = [];
    @Input() richiestaGestione: SintesiRichiesta;
    @Input() nightMode: boolean;

    // Permessi
    @Input() disabledModificaRichiesta = false;
    @Input() disabledGestisciRichiesta = false;
    @Input() disabledComposizionePartenza = false;

    @Input() loadingActionRichiesta: string;

    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() defissa = new EventEmitter<any>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() outEspansoId = new EventEmitter<string>();
    @Output() outEspanso = new EventEmitter<boolean>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() eliminaPartenza = new EventEmitter<{ targaMezzo: string, idRichiesta: string, modalResult: any }>();
    @Output() modificaStatoFonogramma = new EventEmitter<ModificaStatoFonogrammaEmitInterface>();

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
            const result = !!this.idRichiesteEspanse.includes(this.richiestaFissata.id);
            setTimeout(() => this.outEspanso.emit(result));
        }
    }

    ngOnDestroy(): void {
        console.log('Componente RichiestaFissata distrutto');
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

    setEspanso(): void {
        this.outEspanso.emit();
    }

    /* NgClass Template */
    cardFissataClasses(r: any): void {
        return this.methods.cardFissataClasses(r);
    }

    isEspanso(id: string): boolean {
        if (this.idRichiesteEspanse && id) {
            return this.idRichiesteEspanse.includes(id);
        }
    }

}
