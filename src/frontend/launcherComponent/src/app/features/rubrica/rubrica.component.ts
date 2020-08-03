import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetEnti, UpdateEnte, DeleteEnte, AddEnte } from 'src/app/shared/store/actions/enti/enti.actions';

@Component({
  selector: 'app-rubrica',
  templateUrl: './rubrica.component.html',
  styleUrls: ['./rubrica.component.css']
})
export class RubricaComponent implements OnInit {

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
