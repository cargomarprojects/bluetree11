import { PageQuery } from '../../shared/models/pageQuery';
export interface Tbl_Addr_Catgory {
    cat_yn: string;
    cat_id: string;
    cat_name: string;
    cat_yn_b: boolean;
}

export interface BulkmailModel {

    errormessage: string;
    pageQuery: PageQuery;
    records: Tbl_Addr_Catgory[];
}