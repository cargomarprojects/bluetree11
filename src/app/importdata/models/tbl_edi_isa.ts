import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_edi_isa {
    isa_format: string;
    grp_sender_id: string;
    grp_format: string;
    isa_files_desc: string;
    isa_created_by: string;
    isa_created_date: string;
    isa_ctrl_no: string;
    isa_files_processed: string;
}

export interface vm_Tbl_edi_isa {
    mode: string;
    record: Tbl_edi_isa;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    rdbprocessed: string;
    rdtrkprocessed: string;
}


export interface TrackingPageModel {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_edi_isa[];
}


















