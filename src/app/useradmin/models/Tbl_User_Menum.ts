import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export class Tbl_User_Menum {
    menu_pkid: string;
    menu_name: string;
    menu_module_id: string;
    menu_group_id: string;
    menu_group_name: string;
    module_name: string;
    menu_type: string;
    menu_hiden: string;
    menu_parent_id: string;
    menu_order: number;
    menu_param: string;
    menu_xap_name: string;
    menu_xap_dll: string;
    menu_xap_class: string;
    menu_locked: string;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface User_Menum_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Menum[]
}

export interface vm_Tbl_User_Menum {
    mode: string;
    pkid: string;
    record: Tbl_User_Menum;
    userinfo: any,
    filter: any;
}
