import { Action } from '@ngrx/store';
import { Tbl_shipment_close } from '../../models/Tbl_shipment_close'
import { ReportState } from './pay-req-report.models';

export enum ActionTypes {
  ADD = '[Pay-Req-Report-new] Add Report',
  UPDATE = '[Pay-Req-Report-new] Update Report',
  DELETE = '[Pay-Req-Report-new] Delete Report',
  SORT_DATA = '[Pay-Req-Report-new] Sort Data',
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
