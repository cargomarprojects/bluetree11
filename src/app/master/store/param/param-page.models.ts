import { TBL_MAST_PARAM } from '../../models/Tbl_Mast_Param';
import { PageQuery } from '../../../shared/models/pageQuery';

export interface SearchQuery {
    searchString : string ;
}

export interface ParamModel {
    appid : string,
    id: string,
    menuid: string;
    param_type : string ;
    errormessage : string;
    
    sortcol : string ;
    sortorder : boolean;

    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: TBL_MAST_PARAM[]
}
