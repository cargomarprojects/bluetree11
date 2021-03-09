import { Action } from '@ngrx/store';
import { TBL_MBL_REPORT} from '../../models/tbl_mbl_report'
import { ReportState } from './ship-hand-report.models';

export enum ActionTypes {
  ADD = '[Ship-Hand-Report] Add Report',
  UPDATE = '[Ship-Hand-Report] Update Report',
  DELETE = '[Ship-Hand-Report] Delete Report',
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
