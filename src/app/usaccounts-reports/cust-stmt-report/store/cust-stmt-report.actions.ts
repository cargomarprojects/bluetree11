import { Action } from '@ngrx/store';
import { Tbl_OS_REPORT} from '../../models/Tbl_OS_Report'
import { ReportState } from './cust-stmt-report.models';

export enum ActionTypes {
  ADD = '[cust-stmt-report] Add Report',
  UPDATE = '[cust-stmt-report] Update Report',
  DELETE = '[cust-stmt-report] Delete Report',
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
