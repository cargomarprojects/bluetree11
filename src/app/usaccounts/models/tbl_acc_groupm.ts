
import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {

    searchString: string;
}

export class Tbl_acc_groupm {
    acc_group_pkid: string;
    acc_parent_code: string;
    acc_parent_name: string;
    acc_group_name: string;
    acc_sub_group_name: string;
    acc_order: number;
    rec_created_by: string;
    rec_created_date: string;
    rec_closed: string;
}

export interface AccGroupModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_acc_groupm[]
}

export interface vm_tbl_accgroup {
    mode: string;
    pkid: string;
    record: Tbl_acc_groupm;
    userinfo: any,
    filter: any;
}
