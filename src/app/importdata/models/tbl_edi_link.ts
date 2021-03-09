import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_edi_link {
    link_pkid: string;
    link_messagesender: string;
    link_category: string;
    link_subcategory: string;
    link_source_code: string;
    link_source_name: string;
    link_target_id: string;
    link_target_code: string;
    link_target_name: string;
    link_target_add1: string;
    link_target_add2: string;
    link_target_add3: string;
    link_target_add4: string;
    link_status: string;
    createdby: string;
    createddate: string;
    link_source_add1: string;
    link_source_add2: string;
    link_source_add3: string;
    link_source_add4: string;
    link_source_add5: string;
}

export interface SearchQuery {
    searchString: string;
    messageSender: string;
    category:string;
    subcategory: string;
    sourceName:string;
}

export interface LinkPageModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_edi_link[]
}

export interface SettingPageModel {
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_edi_link[]
}

export interface vm_tbl_edi_link {
    mode: string;
    record: Tbl_edi_link;
    userinfo: any;
    filter: any;
}

