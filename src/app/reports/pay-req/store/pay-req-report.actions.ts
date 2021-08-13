import { Action } from '@ngrx/store';
import { Tbl_Cargo_Payrequest } from '../../models/Tbl_Cargo_Payrequest';
import { ReportState } from './pay-req-report.models';

export enum ActionTypes {
  ADD = '[Pay-Req-Report-new] Add Report',
  UPDATE = '[Pay-Req-Report-new] Update Report',
  DELETE = '[Pay-Req-Report-new] Delete Report',
  SORT_DATA = '[Pay-Req-Report-new] Sort Data',
  SELECT_ROW = '[Pay-Req-Report-new] Select Row',
  UPDATE_PAY_STATUS = '[Pay-Req-Report-new] Update Status',
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

export class UpdatePayStatus implements Action {
  readonly type = ActionTypes.UPDATE_PAY_STATUS;
  constructor(public payload: {id : string, pkid:string, updatepaystatus : string } ) {}
}


export type Actions = Add | Update | Delete | SortData | SelectRow | UpdatePayStatus;
