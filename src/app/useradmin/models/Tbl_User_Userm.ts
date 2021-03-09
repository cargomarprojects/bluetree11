import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    deleted : boolean;
}

export class Tbl_User_Userm {
    usr_pkid : string;
    usr_code : string;
    usr_name : string;
    usr_pwd : string;
    usr_email : string;
    usr_email_display_name : string;
    usr_email_pwd : string;
    usr_email_auto_bcc : string;
    usr_mail_server_id : string;
    usr_email_signature : string;
    usr_email_cc : string;
    usr_tel : string;
    usr_mobile : string;
    usr_company_id : string;
    usr_isadmin : string;
    usr_islocked : string;
    usr_scolor : string;
    usr_ecolor : string;
    usr_offset : number;
    usr_ncolor : string;
    usr_linkcolor : string;
    usr_confirm : string;
    usr_sign_font : string;
    usr_sign_color : string;
    usr_sign_size : string;
    usr_sign_bold : string;
    usr_hide_payroll : string;
    usr_disable_edit_si_mblstatus : string;
    
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface User_Userm_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Userm[]
}

export interface vm_Tbl_User_Userm {
    mode: string;
    pkid: string;
    record: Tbl_User_Userm;
    userinfo: any,
    filter: any;
}
