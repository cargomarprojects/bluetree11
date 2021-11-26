import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
}

export class Tbl_User_Server {
    mail_pkid: string;
    mail_name: string;
    mail_smtp_name: string;
    mail_smtp_port: string;
    mail_is_ssl_required: string;
    mail_is_auth_required: string;
    mail_is_spa_required: string;
    mail_bulk_tot: number;
    mail_bulk_sub: number;
    
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface User_Server_Model {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Server[]
}

export interface vm_Tbl_User_Server {
    mode: string;
    pkid: string;
    record: Tbl_User_Server;
    userinfo: any,
    filter: any;
}
