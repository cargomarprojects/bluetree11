import { Action } from '@ngrx/store';
import { Tbl_acc_ledger} from '../../models/Tbl_acc_ledger'
import { ReportState } from './bank-bal-report.models';

export enum ActionTypes {
  ADD = '[bank-bal-report] Add Report',
  UPDATE = '[bank-bal-report] Update Report',
  DELETE = '[bank-bal-report] Delete Report',
  SORT_DATA = '[bank-bal-report] Sort Data'
}

export class Add implements Action {
  readonly type = ActionTypes.ADD;
  constructor(public payload : ReportState) { }
}

export class Update implements Action {
  readonly type = ActionTypes.UPDATE;
  constructor(public payload : { id: string, changes : ReportState }){ }
}

export class Delete implements Action {
  readonly type = ActionTypes.DELETE;
  constructor(public payload : { id: string}) { }
}

export class SortData implements Action {
  readonly type = ActionTypes.SORT_DATA;
  constructor(public payload: {id : string, sortcol : string } ) {}
}

export type Actions = Add | Update | Delete | SortData;
