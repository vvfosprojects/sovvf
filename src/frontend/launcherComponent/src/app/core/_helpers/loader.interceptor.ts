import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { StartLoading, StopLoading } from '../../shared/store/actions/loading/loading.actions';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(public store: Store) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.store.dispatch(new StartLoading());
    return next.handle(req).pipe(
      finalize(() => this.store.dispatch(new StopLoading()))
    );
  }
}
