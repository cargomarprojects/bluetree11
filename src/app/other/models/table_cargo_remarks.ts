import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export interface Table_Cargo_Remarks {
    pkid : string;
    source : string;
    remarks : string;
    ctr : number;
}

export interface Table_Cargo_RemarksModel {
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Table_Cargo_Remarks[]
}

export interface vm_Table_Cargo_Remarks {
    mode: string;
    pkid: string;
    record: Table_Cargo_Remarks;
    userinfo: any,
    filter: any;
}

