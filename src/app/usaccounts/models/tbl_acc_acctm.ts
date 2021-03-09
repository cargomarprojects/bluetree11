
import { PageQuery } from '../../shared/models/pageQuery';

export interface SearchQuery {
     searchString: string;
     showonlysettings : string
}

export interface Tbl_acc_acctm {
     acc_pkid: string;
     acc_maincode: string;
     acc_code: string;
     acc_name: string;
     acc_short_name: string;

     acc_address1: string;
     acc_address2: string;
     acc_address3: string;
     acc_address4: string;
     acc_address5: string;

     acc_group_id: string;
     acc_type: string;
     acc_is_maincode: string;
     acc_maincode_id: string;
     acc_is_locked: string;
     acc_against_drcr: string;
     acc_is_costcenter: string;
     acc_is_external: string;


     acc_is_arap_code: string;
     acc_is_payment_code: string;

     acc_parent_name: string;
     acc_group_name: string;
     acc_sub_group_name: string;

     acc_branch: string;

     acc_chq_format_id: string;

     acc_budget_id: string;

     rec_created_by: string;
     rec_created_date: string;
     rec_closed: string;

}



export interface AcctmModel {
     errormessage: string;
     searchQuery: SearchQuery;
     pageQuery: PageQuery;
     records: Tbl_acc_acctm[]
 }


 export interface vm_tbl_acctm {
     mode: string;
     pkid: string;
     record: Tbl_acc_acctm;
     userinfo: any,
     filter: any;
 }
 