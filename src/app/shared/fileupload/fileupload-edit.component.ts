import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { Table_Mast_Files, vm_table_mast_files } from '../models/table_mast_files';

@Component({
    selector: 'app-fileupload-edit',
    templateUrl: './fileupload-edit.component.html',
})

export class FileUploadEditComponent implements OnInit {
    // Local Variables 
    title = '';

    @Input() record: Table_Mast_Files;
    Files_TypeList: any;
    @Input() set typelist(value: any) {
        this.Files_TypeList = value;
    }

    errorMessage: string = '';
    txt_fileDocType: string = "";
    loading = false;

    constructor(
        private gs: GlobalService,
        private lovService: LovService,
        private http2: HttpClient,

    ) {

    }

    // Init Will be called After executing Constructor
    ngOnInit() {
        this.gs.checkAppVersion();
        if (!this.gs.isBlank(this.Files_TypeList)) {
            var Rec = this.Files_TypeList.find(rec => rec.name == this.record.files_type);
            if (Rec != null) {
                this.txt_fileDocType = Rec.code;
            }
        }
    }
    ngAfterViewInit() {

    }
    InitComponent() {

    }


    // Save Data
    Save() {

        this.errorMessage = '';
        if (this.gs.isBlank(this.record.file_desc)) {
            this.errorMessage = 'Name Cannot be blank';
            return;
        }

        if (this.gs.isBlank(this.txt_fileDocType)) {
            this.errorMessage = 'Doc Type Cannot be blank';
            return;
        }

        this.record.files_type = this.txt_fileDocType;
        const saveRecord = <vm_table_mast_files>{};
        saveRecord.record = this.record;
        saveRecord.userinfo = this.gs.UserInfo;

        this.lovService.Save(saveRecord)
            .subscribe(response => {
                if (response.retvalue == false) {
                    this.errorMessage = response.error;
                    alert(this.errorMessage);
                }
                else {
                    this.record.files_editrow = false;
                    //List shows name so after saving code then replace to name inorder to referesh list
                    if (!this.gs.isBlank(this.Files_TypeList)) {
                        var Rec = this.Files_TypeList.find(rec => rec.code == this.record.files_type);
                        if (Rec != null) {
                            this.record.files_type = Rec.name;
                        }
                    }
                    // this.errorMessage='Save Complete';
                    // alert(this.errorMessage);
                }
            }, error => {
                this.errorMessage = this.gs.getError(error);
                alert(this.errorMessage);
            });
    }

    Close() {
        this.record.files_editrow = false;
    }

    onBlur(field: string) {
        switch (field) {
            case 'file_desc': {
                this.record.file_desc = this.record.file_desc.toUpperCase();
                break;
            }
        }
    }

}
