import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';
import { animate, style, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventiRichiestaComponent } from '../../../eventi-richiesta/eventi-richiesta.component';
import { ListaRichiesteService } from '../../lista-richieste-service/lista-richieste-service.service';

@Component({
  selector: 'app-richiesta-fissata',
  templateUrl: './richiesta-fissata.component.html',
  styleUrls: ['./richiesta-fissata.component.css']
})
export class RichiestaFissataComponent implements OnInit {
  @Output() eventiRichiesta: EventEmitter<any> = new EventEmitter();
  @ViewChild('richiestaContainer') private richiestaContainer: ElementRef;
  @ViewChild('richiesta') private richiesta: ElementRef;

  private playerContainer: AnimationPlayer;
  private playerRichiesta: AnimationPlayer;
  richiestaFissata: SintesiRichiesta;

  constructor(private richiesteS: ListaRichiesteService,
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

  // Defissa, deseleziona e attende 300ms per visualizzare l'intera animazione
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
  visualizzaEventiRichiesta(richiesta) {
    this.modalService.open(EventiRichiestaComponent, { size: 'lg' });
  }
  /* NgClass Template */
  cardShadowClass(r) {
    if (r) {
      return {
        'card-shadow-info': r.stato === 'assegnato',
        'card-shadow-success': r.stato === 'presidiato',
        'card-shadow-danger': r.stato === 'chiamata',
        'card-shadow-warning': r.stato === 'sospeso',
      };
    }
  }
}
