import { Action } from '@ngrx/store';
import { SearchQuery } from './param-page.models';
import { PageQuery } from '../../../shared/models/pageQuery';
import { TBL_MAST_PARAM } from '../../models/Tbl_Mast_Param';


export enum ParamActionTypes {
    LOAD_PARAM_REQUEST = '[PARAM PAGE] LOAD RECORDS REQUEST',
    LOAD_PARAM_SUCCESS = '[PARAM PAGE] LOAD RECORDS SUCCESS',
    LOAD_PARAM_FAIL = '[PARAM PAGE] LOAD RECORDS FAIL',
    UPDATE_SEARCH = '[PARAM PAGE ] UPDATE SEARCH',
    SORT_DATA = '[PARAM PAGE] SORT DATA',
    SELECT_ROW = '[Pay-Req-Report-new] Select Row',
    DELETE = '[PARAM PAGE] DELETE',
}

export class LoadParamRequest implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_REQUEST;
    constructor(public payload: { type: string, Query: any }) { }
}
export class UpdateSearch implements Action {
    readonly type = ParamActionTypes.UPDATE_SEARCH;
    constructor(public payload: { appid: string, id: string, menuid: string, param_type: string, searchQuery: any }) { }
}

export class LoadParamSucces implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_SUCCESS;
    constructor(public payload: { id: string, pageQuery: PageQuery, records: TBL_MAST_PARAM[] }) { }
}

export class Sort implements Action {
    readonly type = ParamActionTypes.SORT_DATA;
    constructor(public payload: { id: string, sortcol: string }) { }
}

export class LoadParamFail implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_FAIL;
    constructor(public payload: { id: string, errormessage: string }) { }
}

export class SelectRow implements Action {
    readonly type = ParamActionTypes.SELECT_ROW;
    constructor(public payload: { id: string, selecteId: string }) { }
}

export class Delete implements Action {
    readonly type = ParamActionTypes.DELETE;
    constructor(public payload: { id: string, rowid: string }) { }
}

export type ParamActions = LoadParamRequest | UpdateSearch | LoadParamSucces | LoadParamFail | Sort | SelectRow | Delete;
