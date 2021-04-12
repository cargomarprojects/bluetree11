import { PageQuery } from '../../shared/models/pageQuery';


export class Tbl_User_Rightsm {
    
    rights_pkid : string ;
    menu_pkid : string ;
    menu_module_id : string ;
    module_order : number ;
    module_name : string ;
    menu_name : string ;
    menu_order : number ;

    menu_xap_name : string ;
    menu_xap_dll : string ;
    menu_xap_class : string ;

    rights_ua_id : string ;
    rights_company : string ;
    rights_admin : string ;
    rights_add : string ;
    rights_edit : string ;
    rights_view : string ;
    rights_delete : string ;
    rights_print : string ;
    rights_email : string ;
    
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface SearchQuery {
    searchString: string;
    deleted : boolean;
}

export class Tbl_User_Access
{
    ua_pkid  : string ;
    ua_usr_id : string ;
    ua_company_id : string ;
    ua_default : string ;
    usr_code : string ;
    usr_name : string ;
    comp_name : string ;

    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;    

}


export interface User_Access_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Access[]
}

export interface vm_Tbl_User_Access {
    mode: string;
    pkid: string;
    record: Tbl_User_Access;
    records: Tbl_User_Rightsm[];
    userinfo: any,
    filter: any;
}
