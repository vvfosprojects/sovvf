import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {
    AddChiamateDistaccamentoCodaChiamate,
    AddSquadreLibereDistaccamentoCodaChiamate,
    AddSquadreOccupateDistaccamentoCodaChiamate,
    RemoveChiamateDistaccamentoCodaChiamate,
    RemoveSquadreLibereDistaccamentoCodaChiamate,
    RemoveSquadreOccupateDistaccamentoCodaChiamate
} from '../../store/actions/coda-chiamate/coda-chiamate.actions';
import { ChangeCodaChiamate } from '../../../../shared/interface/change-coda-chiamate.interface';

@Component({
    selector: 'app-test-coda-chiamate',
    templateUrl: './test-coda-chiamate.component.html',
    styleUrls: ['./test-coda-chiamate.component.scss']
})
export class TestCodaChiamateComponent implements OnInit {

    count = 1 as number;
    codDistaccamento = 'RM.1001' as string;

    constructor(private store: Store) {
    }

    ngOnInit(): void {
    }

    addChiamateDistaccamentoCodaChiamate(): void {
        const obj = {
            codDistaccamento: this.codDistaccamento,
            count: this.count
        } as ChangeCodaChiamate;
        this.store.dispatch(new AddChiamateDistaccamentoCodaChiamate(obj));
    }

    addSquadreLibereDistaccamentoCodaChiamate(): void {
        const obj = {
            codDistaccamento: this.codDistaccamento,
            count: this.count
        } as ChangeCodaChiamate;
        this.store.dispatch(new AddSquadreLibereDistaccamentoCodaChiamate(obj));
    }

    addSquadreOccupateDistaccamentoCodaChiamate(): void {
        const obj = {
            codDistaccamento: this.codDistaccamento,
            count: this.count
        } as ChangeCodaChiamate;
        this.store.dispatch(new AddSquadreOccupateDistaccamentoCodaChiamate(obj));
    }

    removeChiamateDistaccamentoCodaChiamate(): void {
        const obj = {
            codDistaccamento: this.codDistaccamento,
            count: this.count
        } as ChangeCodaChiamate;
        this.store.dispatch(new RemoveChiamateDistaccamentoCodaChiamate(obj));
    }

    removeSquadreLibereDistaccamentoCodaChiamate(): void {
        const obj = {
            codDistaccamento: this.codDistaccamento,
            count: this.count
        } as ChangeCodaChiamate;
        this.store.dispatch(new RemoveSquadreLibereDistaccamentoCodaChiamate(obj));
    }

    removeSquadreOccupateDistaccamentoCodaChiamate(): void {
        const obj = {
            codDistaccamento: this.codDistaccamento,
            count: this.count
        } as ChangeCodaChiamate;
        this.store.dispatch(new RemoveSquadreOccupateDistaccamentoCodaChiamate(obj));
    }

}
