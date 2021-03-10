import { Action } from '@ngrx/store';

import { ReportState } from './agent-ship-report.models';

export enum ActionTypes {
  ADD = '[Agent-Ship-Report] Add Report',
  UPDATE = '[Agent-Ship-Report] Update Report',
  DELETE = '[Agent-Ship-Report] Delete Report',
  DELETEALL = '[Agent-Ship-Report] Delete ALL Report',
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


export type Actions = Add | Update | Delete  | DeleteAll ;
