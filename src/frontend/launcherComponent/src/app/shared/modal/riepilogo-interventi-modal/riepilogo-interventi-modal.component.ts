import { Component } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Sede } from '../../model/sede.model';
import { StampaRichiestaService } from '../../../core/service/stampa-richieste/stampa-richiesta.service';
import { RiepilogoInterventiInterface } from '../../interface/riepilogo-interventi.interface';
import { HttpEventType } from '@angular/common/http';
import { SquadreComposizioneState } from '../../store/states/squadre-composizione/squadre-composizione.state';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { VisualizzaDocumentoModalComponent } from '../visualizza-documento-modal/visualizza-documento-modal.component';

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

    formatDate(date: any, from?: boolean, to?: boolean): any {
        date.month = date.month - 1;
        const day = date.day;
        const month = date.month;
        const year = date.year;
        let dateFormatted;
        if (from) {
            dateFormatted = new Date(year, month, day, 1, 0, 0, 0);
        } else if (to) {
            dateFormatted = new Date(year, month, day + 1, 0, 59, 59, 0);
        } else {
            dateFormatted = new Date(year, month, day, 10, 0, 0, 0);
        }
        return dateFormatted;
    }

    getDataRiepilogoInterventi(): void {
        this.stampaRichiestaService.getSquadreRiepilogoIntervento().subscribe((data: any) => {
            this.squadre = data.dataArray;
        }, () => console.log('Errore Get Squadre Riepilogo Interventi'));

        this.stampaRichiestaService.getDistaccamentiRiepilogoIntervento().subscribe((distaccamenti: Sede[]) => {
            this.distaccamenti = distaccamenti;
        }, () => console.log('Errore Get Distaccamenti Riepilogo Interventi'));
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
            const obj = {
                contentType: 'application/pdf',
                da: this.prefix.DaA ? this.formatDate(this.fromDate, true) : null,
                a: this.prefix.DaA ? this.formatDate(this.toDate, false, true) : null,
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
                        const modalVisualizzaPdf = this.modalService.open(VisualizzaDocumentoModalComponent, {
                            windowClass: 'xxlModal modal-holder',
                            backdropClass: 'light-blue-backdrop',
                            centered: true
                        });
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        modalVisualizzaPdf.componentInstance.titolo = 'Stampa Riepilogo Interventi'.toLocaleUpperCase();
                        modalVisualizzaPdf.componentInstance.blob = downloadedFile;
                        break;
                }
            }, () => console.log('Errore Stampa Riepilogo Interventi'));
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
                    }, () => console.log('Errore Get Squadre Riepilogo Interventi'));
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
