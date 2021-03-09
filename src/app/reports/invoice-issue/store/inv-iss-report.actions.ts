import { Action } from '@ngrx/store';
import { TBL_INV_ISSUE_RPT} from '../../models/tbl_inv_issue_rpt'
import { ReportState } from './inv-iss-report.models';

export enum ActionTypes {
  ADD = '[invoice-issue-report-new] Add Report',
  UPDATE = '[invoice-issue-report-new] Update Report',
  DELETE = '[invoice-issue-report-new] Delete Report',
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
