import { Component } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Sede } from '../../model/sede.model';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { StampaRichiestaService } from '../../../core/service/stampa-richieste/stampa-richiesta.service';
import { RiepilogoInterventiInterface } from '../../interface/riepilogo-interventi.interface';
import { HttpEventType } from '@angular/common/http';
import { SquadreComposizioneState } from '../../store/states/squadre-composizione/squadre-composizione.state';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';

@Component({
    selector: 'app-riepilogo-interventi-modal',
    templateUrl: './riepilogo-interventi-modal.component.html',
    styleUrls: ['./riepilogo-interventi-modal.component.css']
})
export class RiepilogoInterventiModalComponent {

    @Select(SquadreComposizioneState.squadreComposizione) squadreComposizione$: Observable<SquadraComposizione[]>;
    squadreComposizione: SquadraComposizione[];

    distaccamenti: Sede[];
    turno = ['A', 'B', 'C', 'D'];
    squadre: any;
    prefix: { DaA: boolean } = {
        DaA: true,
    };
    altriFiltri = {
        tipologia: false,
        trasmessi: false,
        interventi: false,
    };
    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate;
    toDate: NgbDate | null = null;
    date: { year: number, month: number };
    todayDate;
    showFiltriInterventi = true;
    showFiltriSquadre = true;
    showAltriFiltri = true;
    distaccamentoSelezionati: string[];
    squadreSelezionate: string[];
    turnoSelezionati: string[];

    subscription: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal, calendar: NgbCalendar, private stampaRichiestaService: StampaRichiestaService, private modalService: NgbModal) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 5);
        this.todayDate = calendar.getToday();
        this.getDataRiepilogoInterventi();
    }

    formatDate(date: any): any {
        date.month = date.month - 1;
        const day = date.day;
        const month = date.month;
        const year = date.year;
        const dateFormatted = new Date(year, month, day, 10, 0, 0, 0);
        return dateFormatted;
    }

    getDataRiepilogoInterventi(): void {
        this.stampaRichiestaService.getSquadreRiepilogoIntervento().subscribe((data: any) => {
            this.squadre = data.dataArray;
        }, error => console.log('Errore Get Squadre Riepilogo Interventi'));

        this.stampaRichiestaService.getDistaccamentiRiepilogoIntervento().subscribe((distaccamenti: Sede[]) => {
            this.distaccamenti = distaccamenti;
        }, error => console.log('Errore Get Distaccamenti Riepilogo Interventi'));
    }

    onShowFiltriInterventi(): void {
        this.showFiltriInterventi = !this.showFiltriInterventi;
    }

    onShowFiltriSquadre(): void {
        this.showFiltriSquadre = !this.showFiltriSquadre;
    }

    onShowAltriFiltri(): void {
        this.showAltriFiltri = !this.showAltriFiltri;
    }

    onCheckFiltro(key: string): void {
        if (this.prefix[key]) {
            this.prefix[key] = false;
        } else {
            Object.keys(this.prefix).forEach(x => this.prefix[x] = x === key);
        }
    }

    onCheckAltriFiltri(key: string): void {
        switch (key) {
            case 'tipologia':
                this.altriFiltri.tipologia = !this.altriFiltri.tipologia;
                break;

            case 'trasmessi':
                this.altriFiltri.trasmessi = !this.altriFiltri.trasmessi;
                break;

            case 'interventi':
                this.altriFiltri.interventi = !this.altriFiltri.interventi;
                break;
        }
    }

    onDateSelection(date: NgbDate): void {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
            this.toDate = date;
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    chiudiRiepilogoInterventiModal(closeRes: string): void {
        if (closeRes === 'ok') {
            let modalConfermaReset;
            modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
            modalConfermaReset.componentInstance.icona = { descrizione: 'exclamation-triangle', colore: 'danger' };
            modalConfermaReset.componentInstance.titolo = 'STAMPA RIEPILOGO INTERVENTI';
            modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler eseguire la stampa?';
            modalConfermaReset.componentInstance.messaggioAttenzione = 'Verrà effettuato il download automatico.';
            modalConfermaReset.componentInstance.stampa = true;

            modalConfermaReset.result.then(
                (val) => {
                    switch (val.slice(0, 2)) {
                        case 'ok':
                            const obj = {
                                contentType: val.slice(2, 5) === 'csv' ? 'text/' + val.slice(2, 5) : 'application/' + val.slice(2, 5),
                                da: this.prefix.DaA ? this.formatDate(this.fromDate) : null,
                                a: this.prefix.DaA ? this.formatDate(this.toDate) : null,
                                distaccamenti: this.distaccamentoSelezionati ? this.distaccamentoSelezionati : null,
                                turni: this.turnoSelezionati ? this.turnoSelezionati : null,
                                squadre: this.squadreSelezionate ? this.squadreSelezionate : null,
                            } as RiepilogoInterventiInterface;
                            Object.values(this.altriFiltri).forEach(x => {
                                if (x === true) {
                                    obj.altriFiltri = {
                                        tipologiaIntervento: this.altriFiltri.tipologia ? this.altriFiltri.tipologia : null,
                                        trasmessi: this.altriFiltri.trasmessi ? this.altriFiltri.trasmessi : null,
                                        soloInterventi: this.altriFiltri.interventi ? this.altriFiltri.interventi : null,
                                    };
                                }
                                return;
                            });
                            this.modal.close({
                                status: 'ok',
                                result: obj
                            });
                            this.stampaRichiestaService.stampaRiepilogoInterventi(obj).subscribe((data: any) => {
                                switch (data.type) {
                                    case HttpEventType.DownloadProgress :
                                        break;
                                    case HttpEventType.Response :
                                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                                        const a = document.createElement('a');
                                        a.setAttribute('style', 'display:none;');
                                        document.body.appendChild(a);
                                        a.download = val.slice(2, 5) === 'csv' ? 'Riepilogo Interventi' + '.csv' : 'Riepilogo Interventi';
                                        a.href = URL.createObjectURL(downloadedFile);
                                        a.target = '_blank';
                                        a.click();
                                        document.body.removeChild(a);
                                        break;
                                }
                                }, error => console.log('Errore Stampa Riepilogo Interventi' + val.slice(2, 5).toUpperCase()));
                            break;
                        case 'ko':
                            break;
                    }
                    console.log('Modal chiusa con val ->', val);
                },
                (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
            );
        } else {
            this.modal.close({ status: 'ko' });
        }
    }

    onPatchFiltriSquadre(event: any, tipologia: string): void {
        switch (tipologia) {
            case 'distaccamenti':
                if (event) {
                    event.forEach(x => !this.distaccamentoSelezionati.includes(x.codice) && x.codice ? this.distaccamentoSelezionati.push(x.codice) : null);
                    this.stampaRichiestaService.getSquadreRiepilogoIntervento(this.distaccamentoSelezionati).subscribe((data: any) => {
                        this.squadre = data.dataArray;
                        this.squadreSelezionate = [];
                    }, error => console.log('Errore Get Squadre Riepilogo Interventi'));
                }
                break;

            case 'turno':
                if (event) {
                    event.forEach(x => !this.turnoSelezionati.includes(x.id) && x.id ? this.turnoSelezionati.push(x.id) : null);
                }
                break;

            case 'squadra':
                if (event) {
                    event.forEach(x => !this.squadreSelezionate.includes(x.codice) && x.id ? this.squadreSelezionate.push(x.codice) : null);
                }
                break;
        }
    }

    isHovered(date: NgbDate): boolean {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
    }

    isInside(date: NgbDate): boolean {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
    }

    isRange(date: NgbDate): boolean {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
    }

}
