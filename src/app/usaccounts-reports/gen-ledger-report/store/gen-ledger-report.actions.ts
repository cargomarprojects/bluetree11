import { Action } from '@ngrx/store';
import { Tbl_acc_ledger } from '../../models/Tbl_acc_ledger'
import { ReportState } from './gen-ledger-report.models';

export enum ActionTypes {
  ADD = '[gen-ledger-report] Add Report',
  UPDATE = '[gen-ledger-report] Update Report',
  DELETE = '[gen-ledger-report] Delete Report',
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

export type Actions = Add | Update | Delete;
