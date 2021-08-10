import { Action } from '@ngrx/store';
import { Tbl_OS_REPORT} from '../../models/Tbl_OS_Report'
import { ReportState } from './aging-report.models';

export enum ActionTypes {
  ADD = '[aging-report] Add Report',
  UPDATE = '[aging-report] Update Report',
  DELETE = '[aging-report] Delete Report',
  SORT_DATA = '[aging-report] Sort Data'
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
