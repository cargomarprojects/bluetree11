import { Action } from '@ngrx/store';
import { SearchQuery  } from './param-page.models';
import { PageQuery } from '../../../shared/models/pageQuery';
import { TBL_MAST_PARAM } from '../../models/Tbl_Mast_Param';

export enum ParamActionTypes {
    LOAD_PARAM_REQUEST = '[PARAM PAGE] LOAD RECORDS REQUEST',
    LOAD_PARAM_SUCCESS = '[PARAM PAGE] LOAD RECORDS SUCCESS',
    LOAD_PARAM_FAIL = '[PARAM PAGE] LOAD RECORDS FAIL',
    UPDATE_SEARCH = '[PARAM PAGE ] UPDATE SEARCH',
}

export class LoadParamRequest implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_REQUEST;
    constructor(public payload: { type : string, Query : any} ) {}
}
export class UpdateSearch implements Action {
    readonly type = ParamActionTypes.UPDATE_SEARCH;
    constructor(public payload: { id : string, menuid : string, param_type : string ,  searchQuery : any} ) {}
}

export class LoadParamSucces implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_SUCCESS;
    constructor(public payload: { id : string,  pageQuery : PageQuery,  records : TBL_MAST_PARAM[]} ) {}
}

export class LoadParamFail implements Action {
    readonly type = ParamActionTypes.LOAD_PARAM_FAIL;
    constructor(public payload: { id: string, errormessage : string} ) {}
}


export type ParamActions = LoadParamRequest | UpdateSearch | LoadParamSucces | LoadParamFail ;
