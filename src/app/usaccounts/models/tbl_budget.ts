
import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
     searchString: string;
}


export interface Tbl_Budgetm {
    bm_pkid: string;
    bm_name: string;
    bm_from_date: string;
    bm_to_date: string;
}

export interface Tbl_Budgetd {
    bd_pkid: string;
    bd_parent_id: string;
    bd_code_id: string;
    bd_code: string;
    bd_name: string;
    bd_category: string;
    bd_type: string;
    bd_mon1: number;
    bd_mon2: number;
    bd_mon3: number;
    bd_mon4: number;
    bd_mon5: number;
    bd_mon6: number;
    bd_mon7: number;
    bd_mon8: number;
    bd_mon9: number;
    bd_mon10: number;
    bd_mon11: number;
    bd_mon12: number;
    bd_total: number;
    bd_actual_total: number;
    bd_subtotal: number;
    bd_actual_subtotal: number;
    bm_from_date: string;
    bm_to_date: string;
    bm_periodname: string;
    bd_categoryctr: string;
}

export interface BudgetModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Budgetm[]
}


export interface vm_tbl_budget {
    mode: string;
    pkid: string;
    record: Tbl_Budgetm;
    userinfo: any,
    filter: any;
}

