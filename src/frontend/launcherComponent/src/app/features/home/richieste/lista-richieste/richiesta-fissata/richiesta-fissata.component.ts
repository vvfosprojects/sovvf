import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Component
import { EventiRichiestaComponent } from '../../../eventi/eventi-richiesta.component';

// Service
import { ListaRichiesteService } from '../../service/lista-richieste-service.service';

// Helper Methods
import { HelperMethods } from '../../helper/_helper-methods';


@Component({
    selector: 'app-richiesta-fissata',
    templateUrl: './richiesta-fissata.component.html',
    styleUrls: ['./richiesta-fissata.component.css']
})
export class RichiestaFissataComponent implements OnInit {
    @Input() _split: boolean;

    @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();
    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();

    @ViewChild('richiestaContainer') private richiestaContainer: ElementRef;
    @ViewChild('richiesta') private richiesta: ElementRef;

    methods = new HelperMethods;
    richiestaFissata: SintesiRichiesta;

    private playerContainer: AnimationPlayer;
    private playerRichiesta: AnimationPlayer;

    constructor(public richiesteS: ListaRichiesteService,
        private animationBuilder: AnimationBuilder,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        // Restituisce la Richiesta Fissata
        this.richiesteS.subjects.getRichiestaFissata().subscribe(richiestaFissata => {
            if (richiestaFissata) {
                this.richiestaFissata = richiestaFissata;
                this.animazioneIn();
            } else {
                this.animazioneOut();
                setTimeout(() => {
                    this.richiestaFissata = null;
                }, 300);
            }
        });
    }

    // Ritorna la richiesta nella lista, defissandola
    defissa() {
        this.richiesteS.defissata();
        this.richiesteS.deselezionata();
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
                style({ width: '0' }),
                animate(300, style({ width: '100%' }))
            ]);

        const animationRichiesta = this.animationBuilder
            .build([
                style({ height: '0', opacity: '0' }),
                animate(300, style({ height: 'auto', opacity: '1' }))
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
        // this.partenzaService.nuovaPartenza(richiesta);
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
    }

    /* NgClass Template */
    cardFissataClasses(r: any) {
        return this.methods.cardFissataClasses(r);
    }
}
