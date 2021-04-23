import { PageQuery } from '../../shared/models/pageQuery';
export interface Tbl_cargo_hblformat {
    blf_format_id: string;
    blf_col_name: string;
    blf_col_x: number;
    blf_col_y: number;
    blf_width: number;
    blf_enabled: string;
    blf_enabled_b: boolean;
    rec_company_code: string;
    rec_branch_code: string;
    blf_col_order: number;
}

export interface vm_Tbl_cargo_hblformat {
    format_id: string;
    records: Tbl_cargo_hblformat[];
    userinfo: any;
    filter: any;
}
export interface SearchQuery {
    searchString: string;
    format_id: string;
    format_name: string;
}

export interface FormatModel {
    errorMessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_cargo_hblformat[]
}