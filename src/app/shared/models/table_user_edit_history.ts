import { PageQuery } from './pageQuery';
export interface SearchQuery {
    searchString: string;
}

export interface Table_User_Edit_History {
    log_pkid: string;
    log_parent_id: string;
    log_history_id: string;
    log_source: string;
    log_action: string;
    log_caption: string;
    log_old_value: string;
    log_new_value: string;
    rec_created_by: string;
    rec_created_date: string;
}
 