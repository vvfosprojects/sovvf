import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { GetEnti, UpdateEnte, DeleteEnte, AddEnte } from 'src/app/shared/store/actions/enti/enti.actions';
import { PaginationState } from 'src/app/shared/store/states/pagination/pagination.state';
import { Observable } from 'rxjs';
import { LoadingState } from 'src/app/shared/store/states/loading/loading.state';

@Component({
  selector: 'app-rubrica',
  templateUrl: './rubrica.component.html',
  styleUrls: ['./rubrica.component.css']
})
export class RubricaComponent implements OnInit {

  @Select(PaginationState.pageSize) pageSize$: Observable<number>;
  pageSize: number;
  @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
  @Select(PaginationState.totalItems) totalItems$: Observable<number>;
  @Select(PaginationState.page) page$: Observable<number>;
  @Select(LoadingState.loading) loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.getEnti();
  }

  ngOnInit() {
  }

  getEnti() {
    this.store.dispatch(new GetEnti());
  }

  addEnte(ente: AddEnte) {
    this.store.dispatch(new AddEnte(ente));
  }

  updateEnte(ente: UpdateEnte) {
    this.store.dispatch(new UpdateEnte(ente));
  }

  deleteEnte(idEnte: DeleteEnte) {
    this.store.dispatch(new DeleteEnte(idEnte));
  }
}
