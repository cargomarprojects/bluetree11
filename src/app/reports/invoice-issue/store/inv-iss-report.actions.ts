import { Action } from '@ngrx/store';
import { TBL_INV_ISSUE_RPT} from '../../models/tbl_inv_issue_rpt'
import { ReportState } from './inv-iss-report.models';

export enum ActionTypes {
  ADD = '[invoice-issue-report-new] Add Report',
  UPDATE = '[invoice-issue-report-new] Update Report',
  DELETE = '[invoice-issue-report-new] Delete Report',
  SELECT_ROW = '[invoice-issue-Report] Select Row',
  SORT_DATA = '[invoice-issue-report-new] Sort Data'
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

export class SelectRow implements Action {
  readonly type = ActionTypes.SELECT_ROW;
  constructor(public payload: {id : string, selecteId : string } ) {}
}

export type Actions = Add | Update | Delete | SortData| SelectRow;
