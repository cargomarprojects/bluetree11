import { TBL_LABELM } from '../../models/tbl_label_report';
export interface ReportState {

    pkid: string,
    urlid: string,
    menuid: string;

    currentTab: string;
    from_date: string;
    to_date: string;
    group: string;
    mbl_pkid: string;
    mbl_ids: string;

    page_rows: number;
    page_count: number;
    page_current: number;
    page_rowcount: number;
    records: TBL_LABELM[]
}