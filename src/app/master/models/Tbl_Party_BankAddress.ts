export interface Tbl_Party_BankAddress {
    pb_pkid: string;
    pb_parent_id: string;
    pb_benefi_name: string;
    pb_benefi_address1: string;
    pb_benefi_address2: string;
    pb_benefi_address3: string;
    pb_benefi_acc_no: string;
    pb_bank_name: string;
    pb_bank_address1: string;
    pb_bank_address2: string;
    pb_bank_address3: string;
    pb_swift_code: string;
    pb_iban: string;
    pb_routing_no: string;
    pb_ctr: number;
    pb_further_credit_to: string;
    pb_further_routing_code: string;
}

export interface vm_Tbl_Party_BankAddress {
    mode: string;
    pkid: string;
    record: Tbl_Party_BankAddress;
    userinfo: any;
    filter: any;
}