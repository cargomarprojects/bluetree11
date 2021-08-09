import { Action } from '@ngrx/store';

import { ReportState } from './agent-ship-report.models';

export enum ActionTypes {
  ADD = '[Agent-Ship-Report] Add Report',
  UPDATE = '[Agent-Ship-Report] Update Report',
  DELETE = '[Agent-Ship-Report] Delete Report',
  DELETEALL = '[Agent-Ship-Report] Delete ALL Report',
  SORT_DATA = '[Agent-Ship-Report] Sort Data'
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

export class DeleteAll implements Action {
  readonly type = ActionTypes.DELETEALL;
}

export class SortData implements Action {
  readonly type = ActionTypes.SORT_DATA;
  constructor(public payload: {id : string, sortcol : string } ) {}
}

export type Actions = Add | Update | Delete  | DeleteAll | SortData;
