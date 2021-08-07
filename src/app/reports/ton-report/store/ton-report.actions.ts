import { Action } from '@ngrx/store';
import { TBL_MBL_REPORT} from '../../models/tbl_mbl_report'
import { ReportState } from './ton-report.models';

export enum ActionTypes {
  ADD = '[Ton-Report] Add Report',
  UPDATE = '[Ton-Report] Update Report',
  DELETE = '[Ton-Report] Delete Report',
  SORT_DATA = '[Ton-Report] Sort Data'
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
