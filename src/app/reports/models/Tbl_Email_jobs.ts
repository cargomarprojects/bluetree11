import { PageQuery } from '../../shared/models/pageQuery';
import { Tbl_File_Details } from '../../Ai/models/Tbl_mast_filesm';
export interface SearchQuery {
    searchString: string;
}

export class Tbl_Email_jobs{
    pkid: string;
    from_id: string;
    to_id: string;
    cc_id: string;
    bcc_id: string;
    mail_subject: string;
    mail_message: string;
    file_folder: string;
    scheduled_on: string;
    send_date: string;
	mail_status: string;
	error_msg: string;
	remarks: string;
    FileList: Tbl_File_Details[] = []; 
    row_color: string;
}

export interface Tbl_Email_jobs_Model {
    selectedId: string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Email_jobs[]
}

export interface vm_Tbl_Email_jobs {
    mode: string;
    pkid: string;
    record: Tbl_Email_jobs;
    userinfo: any,
    filter: any;
}
