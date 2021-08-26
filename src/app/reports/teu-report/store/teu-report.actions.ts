import { Action, Selector } from '@ngrx/store';
import { TBL_MBL_REPORT} from '../../models/tbl_mbl_report'
import { ReportState } from './teu-report.models';

export enum ActionTypes {
  ADD = '[Teu-Report] Add Report',
  UPDATE = '[Teu-Report] Update Report',
  DELETE = '[Teu-Report] Delete Report',
  SELECT_ROW = '[Teu-Report] Select Row',
  SORT_DATA = '[Teu-Report] Sort Data'
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

export type Actions = Add | Update | Delete | SortData | SelectRow;
