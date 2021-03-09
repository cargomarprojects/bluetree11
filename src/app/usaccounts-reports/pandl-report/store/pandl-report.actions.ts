import { Action } from '@ngrx/store';
import { Tbl_acc_Trialbalance } from '../../models/Tbl_acc_Trialbalance'
import { ReportState } from './pandl-report.models';

export enum ActionTypes {
  ADD = '[pandl-report] Add Report',
  UPDATE = '[pandl-report] Update Report',
  DELETE = '[pandl-report] Delete Report',
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
