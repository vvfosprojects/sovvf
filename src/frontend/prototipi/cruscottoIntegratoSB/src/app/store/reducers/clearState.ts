import { ActionReducerMap } from '@ngrx/store';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { State } from "./index";
import * as fromUserLoginSuccess from './userLoginSuccess';
import * as fromRoot from '../reducers';
import * as user from '../actions/user';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
      console.log('state', state);
      console.log('action', action);
  
      return reducer(state, action);
    }

  }

  export function logout(reducer: ActionReducer<any>) {
    return function (state, action) {
        console.log("chiamata funzione logout.");
        console.log("tipo azione "+action.type);
      return reducer(action.type === user.USERLOGOUT ? undefined : state, action);
    }
  }


  export const metaReducers: MetaReducer<any>[] = [debug, logout];
