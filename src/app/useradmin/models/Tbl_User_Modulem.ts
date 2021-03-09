import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export class Tbl_User_Modulem {
    module_pkid: string;
    module_name: string;
    module_installed: number;
    module_order: number;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface User_Module_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Modulem[]
}

export interface vm_Tbl_User_Modulem {
    mode: string;
    pkid: string;
    record: Tbl_User_Modulem;
    userinfo: any,
    filter: any;
}
