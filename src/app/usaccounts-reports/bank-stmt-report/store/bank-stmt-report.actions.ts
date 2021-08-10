import { Action } from '@ngrx/store';
import { Tbl_Acc_Payment} from '../../models/Tbl_Acc_Payment'
import { ReportState } from './bank-stmt-report.models';

export enum ActionTypes {
  ADD = '[bank-stmt-report] Add Report',
  UPDATE = '[bank-stmt-report] Update Report',
  DELETE = '[bank-stmt-report] Delete Report',
  SORT_DATA = '[bank-stmt-report] Sort Data'
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
