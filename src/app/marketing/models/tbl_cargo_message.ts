import { PageQuery } from '../../shared/models/pageQuery';

export interface Tbl_Cargo_Message {


    msg_pkid: string;
    msg_date: string;
    msg_cfno: number;
    msg_refno: string;
    msg_from_id: string;
    msg_from_name: string;
    msg_from_email: string;
    msg_party_id: string;
    msg_party_code: string;
    msg_party_name: string;
    msg_party_attn: string;
    msg_party_telfax: string;
    msg_to_email_display: string;
    msg_subject: string;
    msg_to_email: string;
    msg_to_cc: string;
    msg_to_bcc: string;
    msg_body: string;
    rec_created_by: string;
    rec_created_date: string;
    msg_page_nos: number;


    msg_is_urgent: string;
    msg_is_review: string;
    msg_is_comment: string;
    msg_is_reply: string;

    msg_is_urgent_b: boolean;
    msg_is_review_b: boolean;
    msg_is_comment_b: boolean;
    msg_is_reply_b: boolean;
}

export interface vm_tbl_cargo_message {
    mode: string;
    pkid: string;
    record: Tbl_Cargo_Message;
    userinfo: any,
    filter: any;
}

export interface SearchQuery {
    searchString: string;
    fromdate: string;
    todate: string;
    searchtype: string;
}

export interface MessageModel {
    selectedId : string;
    sortcol: string;
    sortorder: boolean;
    errormessage: string;
    searchQuery: SearchQuery;
    pageQuery: PageQuery;
    records: Tbl_Cargo_Message[]
}