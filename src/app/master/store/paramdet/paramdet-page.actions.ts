import { Action } from '@ngrx/store';
import { SearchQuery  } from './paramdet-page.models';
import { PageQuery } from '../../../shared/models/pageQuery';
import { TBL_MAST_PARAM } from '../../models/Tbl_Mast_Param';

export enum ParamActionTypes {
    LOAD_PARAM_REQUEST = '[PARAM PAGE DET] LOAD RECORDS REQUEST',
    LOAD_PARAM_SUCCESS = '[PARAM PAGE DET] LOAD RECORDS SUCCESS',
    LOAD_PARAM_FAIL = '[PARAM PAGE DET] LOAD RECORDS FAIL',
    UPDATE_SEARCH = '[PARAM PAGE DET] UPDATE SEARCH',
    SORT_DATA = '[PARAM PAGE DET] SORT DATA',
    SELECT_ROW = '[Pay-Req-Report-new] Select Row',    
}

export class LoadParamRequest implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_REQUEST;
    constructor(public payload: { type : string, Query : any} ) {}
}
export class UpdateSearch implements Action {
    readonly type = ParamActionTypes.UPDATE_SEARCH;
    constructor(public payload: {appid : string, id : string, menuid : string, param_type : string ,  searchQuery : any} ) {}
}

export class SortData implements Action {
    readonly type = ParamActionTypes.SORT_DATA;
    constructor(public payload: {id : string, sortcol : string } ) {}
}

export class LoadParamSucces implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_SUCCESS;
    constructor(public payload: { id : string,  pageQuery : PageQuery,  records : TBL_MAST_PARAM[]} ) {}
}

export class LoadParamFail implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_FAIL;
    constructor(public payload: { id: string, errormessage : string} ) {}
}

export class SelectRow implements Action {
    readonly type = ParamActionTypes.SELECT_ROW;
    constructor(public payload: {id : string, selecteId : string } ) {}
}

export type ParamActions = LoadParamRequest | UpdateSearch | LoadParamSucces | LoadParamFail  | SortData  |SelectRow;
