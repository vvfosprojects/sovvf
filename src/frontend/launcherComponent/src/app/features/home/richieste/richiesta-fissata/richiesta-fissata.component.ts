import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Model
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';

// Component
import { EventiRichiestaComponent } from '../../eventi/eventi-richiesta.component';

// Service
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';

// Helper Methods
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';


@Component({
    selector: 'app-richiesta-fissata',
    templateUrl: './richiesta-fissata.component.html',
    styleUrls: ['./richiesta-fissata.component.css']
})
export class RichiestaFissataComponent implements OnInit, OnChanges {
    @Input() _split: boolean;
    @Input() richiestaFissata: SintesiRichiesta;

    @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() defissa = new EventEmitter<any>();

    @ViewChild('richiestaContainer') private richiestaContainer: ElementRef;
    @ViewChild('richiesta') private richiesta: ElementRef;

    methods = new HelperSintesiRichiesta;

    private playerContainer: AnimationPlayer;
    private playerRichiesta: AnimationPlayer;

    constructor(private animationBuilder: AnimationBuilder,
        private modalService: NgbModal,
        private markerS: MarkerService) {
    }

    ngOnInit() {
        this.richiestaFissata ? this.animazioneIn() : console.log();
    }

    ngOnChanges() {
        this.richiestaFissata ? this.animazioneIn() : console.log();
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
                animate(450, style({  height: '100%', width: '100%' }))
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
    visualizzaEventiRichiesta(richiesta: any) {
        this.modalService.open(EventiRichiestaComponent, { size: 'lg' });
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any) {
        this.markerS.actionById(richiesta.id, 'click');
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);

        console.log(richiesta);
    }

    /* NgClass Template */
    cardFissataClasses(r: any) {
        return this.methods.cardFissataClasses(r);
    }
}
