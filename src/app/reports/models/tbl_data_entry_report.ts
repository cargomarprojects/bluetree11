import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
    searchString: string;
    category: string;
    type: string;
    fromdate: string;
    todate: string;
}

export class Tbl_Data_Entry_Report {
    row_type: string;
    de_type: string;
    de_category: string;
    de_created_by: string;
    de_created_count: number;
}

export interface Data_Entry_Report_Model {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Data_Entry_Report[];
}





