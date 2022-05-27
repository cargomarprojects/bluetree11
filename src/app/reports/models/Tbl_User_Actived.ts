import { PageQuery } from '../../shared/models/pageQuery';
export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
}

export interface Tbl_User_Actived {
    user_uid:number;
	user_userid: string;
	user_usercode: string;
	user_username: string;
	user_time_in: string;
    user_time_last: string;
}
 
export interface UserActiveDetModel {
    selectedId : string;
    sortcol : string ;
    sortorder : boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_User_Actived[]
}