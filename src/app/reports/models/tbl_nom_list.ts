import { PageQuery } from '../../shared/models/pageQuery';
export class TBL_NOM_LIST {
    nom_name: string;
    nom_handled_loc: string;
    nom_handled_by: string;
}
export interface SearchQuery {
    searchString: string;
    handled_id: string;
    handled_name: string;
    comp_code: string;
    comp_type: string;
}

export interface NomReportModel {
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: TBL_NOM_LIST[]
}