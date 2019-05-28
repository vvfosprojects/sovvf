import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, OnChanges, OnDestroy, isDevMode } from '@angular/core';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Model
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';

// Component
import { EventiRichiestaComponent } from '../../eventi/eventi-richiesta.component';

// Helper Methods
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { Store } from '@ngxs/store';
import { SetEspanso } from '../../store/actions/richieste/richiesta-fissata.actions';
import { ClearEventiRichiesta, SetIdRichiestaEventi } from '../../store/actions/eventi/eventi-richiesta.actions';


@Component({
    selector: 'app-richiesta-fissata',
    templateUrl: './richiesta-fissata.component.html',
    styleUrls: ['./richiesta-fissata.component.css']
})
export class RichiestaFissataComponent implements OnInit, OnDestroy {
    @Input() _split: boolean;
    @Input() richiestaFissata: SintesiRichiesta;

    @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() statoPartenza: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() composizionePartenza: EventEmitter<SintesiRichiesta> = new EventEmitter<SintesiRichiesta>();
    @Output() defissa: EventEmitter<any> = new EventEmitter<any>();
    @Output() modificaRichiesta: EventEmitter<SintesiRichiesta> = new EventEmitter<SintesiRichiesta>();

    @ViewChild('richiestaContainer') private richiestaContainer: ElementRef;
    @ViewChild('richiesta') private richiesta: ElementRef;

    methods = new HelperSintesiRichiesta;

    private playerContainer: AnimationPlayer;
    private playerRichiesta: AnimationPlayer;

    constructor(private animationBuilder: AnimationBuilder,
                private modalService: NgbModal,
                private store: Store) {
    }

    ngOnInit(): void {
        if (this.richiestaFissata) {
            this.animazioneIn();
            if (isDevMode()) {
                console.log('Componente RichiestaFissata creato');
            }
        }
    }

    ngOnDestroy(): void {
        if (isDevMode()) {
            console.log('Componente RichiestaFissata distrutto');
        }
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

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    visualizzaEventiRichiesta(idRichiesta: string) {
        this.store.dispatch(new SetIdRichiestaEventi(idRichiesta));
        const modal = this.modalService.open(EventiRichiestaComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
        modal.result.then(() => {
            },
            () => this.store.dispatch(new ClearEventiRichiesta()));
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any) {
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);

        console.log(richiesta);
    }

    onModificaRichiesta(richiesta: SintesiRichiesta) {
        this.modificaRichiesta.emit(richiesta);
    }

    setEspanso(espanso: boolean) {
        this.store.dispatch(new SetEspanso(espanso));
        console.log('Stato espanso:', espanso);
    }

    /* NgClass Template */
    cardFissataClasses(r: any) {
        return this.methods.cardFissataClasses(r);
    }
}
