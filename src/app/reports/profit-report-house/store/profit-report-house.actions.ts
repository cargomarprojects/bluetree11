import { Action } from '@ngrx/store';
import { TBL_MBL_REPORT} from '../../models/tbl_mbl_report'
import { ReportState } from './proft-report-house.models';

export enum ActionTypes {
  ADD = '[Profit-Report-House] Add Report',
  UPDATE = '[Profit-Report-House] Update Report',
  SELECT_ROW = '[Profit-Report-House] Select Row',
  DELETE = '[Profit-Report-House] Delete Report',
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

export class SelectRow implements Action {
  readonly type = ActionTypes.SELECT_ROW;
  constructor(public payload: {id : string, selecteId : string } ) {}
}

export type Actions = Add | Update | Delete| SelectRow;
