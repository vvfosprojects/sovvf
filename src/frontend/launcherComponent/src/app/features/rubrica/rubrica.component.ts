import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import { Observable, Subscription } from 'rxjs';
import { LoadingState } from 'src/app/shared/store/states/loading/loading.state';
import { RicercaRubricaState } from './store/states/ricerca-rubrica/ricerca-rubrica.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SetPageSize } from '../../shared/store/actions/pagination/pagination.actions';
import { GetUtentiGestione } from '../gestione-utenti/store/actions/gestione-utenti/gestione-utenti.actions';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { ClearRicercaRubrica, SetRicercaRubrica } from './store/actions/ricerca-rubrica/ricerca-rubrica.actions';
import { AddVoceRubrica, DeleteVoceRubrica, GetRubrica, UpdateVoceRubrica } from './store/actions/rubrica/rubrica.actions';
import { AddVoceRubricaInterface, VoceRubrica } from '../../shared/interface/rubrica.interface';

@Component({
    selector: 'app-rubrica',
    templateUrl: './rubrica.component.html',
    styleUrls: ['./rubrica.component.css']
})
export class RubricaComponent implements OnInit, OnDestroy {

    @Select(RicercaRubricaState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    pageSize: number;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    subscriptions: Subscription = new Subscription();
    vociRubrica = [
        {
            descrizione: 'test1',
            codSede: 'codTest',
            ricorsivo: true,
            enteCategoria: {
                codice: 'test',
                descrizione: 'testtest',
                visibile: 'test',
                acronimo: 'TEST',
                cap: '00012',
            },
            indirizzo: 'via test dei test',
            cap: '00012',
            noteEnte: 'note test e test',
            email: 'test@test.test',            
            telefoni: [{                
                tipo: 'cell',
                numero: '123456789',
            }]
        }
    ] as VoceRubrica[];

    constructor(public modalService: NgbModal,
                private store: Store) {
        const pageSizeAttuale = this.store.selectSnapshot(PaginationState.pageSize);
        if (pageSizeAttuale === 7) {
            this.store.dispatch(new SetPageSize(10));
        }
        this.getRicerca();
        this.getPageSize();
        this.getRubrica(true);
    }


    ngOnInit() {
        this.store.dispatch([new SetCurrentUrl(RoutesPath.Rubrica), new SetSediNavbarVisible(false)]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearRicercaRubrica(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getRubrica(pageAttuale: boolean) {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetRubrica(page));
    }

    onAddUtente() {
        const voceRubrica = {
            descrizione: 'test1',
            codSede: 'codTest',
            ricorsivo: true,
            codCategoria: 222,
            indirizzo: 'via test dei test',
            cap: '00012',
            noteEnte: 'note test e test',
            email: 'test@test.test',            
            telefoni: [{                
                tipo: 'cell',
                numero: '123456789',
            }]
        } as AddVoceRubricaInterface;
        this.addVoceRubrica(voceRubrica);
    }

    addVoceRubrica(voceRubrica: AddVoceRubricaInterface) {
        this.store.dispatch(new AddVoceRubrica(voceRubrica));
    }

    updateVoceRubrica(ente: any) {
        this.store.dispatch(new UpdateVoceRubrica(ente));
    }

    deleteVoceRubrica(idEnte: any) {
        this.store.dispatch(new DeleteVoceRubrica(idEnte));
    }

    onRicercaRubrica(ricerca: string) {
        this.store.dispatch(new SetRicercaRubrica(ricerca));
    }

    getRicerca() {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetUtentiGestione());
                }
            })
        );
    }

    getPageSize() {
        this.subscriptions.add(
            this.pageSize$.subscribe((pageSize: number) => {
                if (pageSize) {
                    if (this.pageSize && pageSize !== this.pageSize) {
                        this.store.dispatch(new GetUtentiGestione());
                    }
                    this.pageSize = pageSize;
                }
            })
        );
    }
}
