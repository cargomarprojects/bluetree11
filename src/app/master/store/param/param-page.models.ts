import { TBL_MAST_PARAM } from '../../models/Tbl_Mast_Param';
import { PageQuery } from '../../../shared/models/pageQuery';

export interface SearchQuery {
  searchString: string;
  menu_param: string;
  isActive: boolean;
  isInactive: boolean;
}

export interface ParamModel {
  appid: string,
  selectedId: string,
  id: string,
  menuid: string;
  param_type: string;
  errormessage: string;

  sortcol: string;
  sortorder: boolean;

  searchQuery: SearchQuery;
  pageQuery: PageQuery;
  records: TBL_MAST_PARAM[]
}
