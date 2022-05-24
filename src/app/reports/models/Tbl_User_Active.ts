import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    searchDatetype: string;
    serverDate: string;
}

export class Tbl_User_Active {
    user_appid: string;
    user_userid: string;
    user_usercode: string;
    user_username: string;
    user_status: string;
    user_time_in: string;
    user_time_out: string;
    user_time_last: string;
}

export interface Tbl_User_Active_Model {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Active[]
}

export interface vm_Tbl_User_Active {
    mode: string;
    pkid: string;
    record: Tbl_User_Active;
    userinfo: any,
    filter: any;
}
