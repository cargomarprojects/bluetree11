export interface Tbl_Party_Login {
    plogin_pkid: string;
    plogin_party_id:string;
    plogin_code: string;
    plogin_name: string;
    plogin_pwd: string;
    plogin_email: string;
    plogin_locked: string;
    plogin_category: string;
    plogin_isparent: string;
    plogin_isparent_b: boolean;
    plogin_locked_b: boolean;
}

export interface vm_Tbl_Party_Login {
    mode: string;
    pkid: string;
    record: Tbl_Party_Login;
    userinfo: any;
    filter: any;
}