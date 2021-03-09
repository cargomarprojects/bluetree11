import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { Table_Mast_Files } from '../models/table_mast_files';
// import { stringify } from 'querystring';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html'
})
export class FileUploadComponent implements OnInit {



  public Doc_title: string = "";
  @Input() set title(value: string) {
    this.Doc_title = value;
  }


  private Files_Parent_Id: string = "";
  @Input() set parentid(value: string) {
    this.Files_Parent_Id = value;
  }

  private Files_Sub_Id: string = "";
  @Input() set subid(value: string) {
    this.Files_Sub_Id = value;
  }

  Files_Type: string = "";
  @Input() set type(value: string) {
    this.Files_Type = value;
  }

  Files_TypeList: any;
  @Input() set typelist(value: any) {
    this.Files_TypeList = value;
  }

  private table_name: string = "";
  @Input() set tablename(value: string) {
    this.table_name = value;
  }

  private table_pk_column: string = "";
  @Input() set tablepkcolumn(value: string) {
    this.table_pk_column = value;
  }

  private Files_Ref_No: string = "";
  @Input() set refno(value: string) {
    this.Files_Ref_No = value;
  }


  private Customer_Name: string = "";
  @Input() set customername(value: string) {
    this.Customer_Name = value;
  }

  private UpdateColumn: string = "REC_FILES_ATTACHED";
  @Input() set updatecolumn(value: string) {
    this.UpdateColumn = value;
  }


  private VIEW_ONLY_SOURCE: string = "";
  @Input() set viewonlysource(value: string) {
    this.VIEW_ONLY_SOURCE = value;
  }

  private VIEW_ONLY_ID: string;
  @Input() set viewonlyid(value: string) {
    this.VIEW_ONLY_ID = value;
  }

  private FILES_PATH1: string = "";
  @Input() set filespath(value: string) {
    this.FILES_PATH1 = value;
  }

  private FILES_PATH2: string = "";
  @Input() set filespath2(value: string) {
    this.FILES_PATH2 = value;
  }

  public canupload: boolean = true;
  @Input() set uploadfiles(value: boolean) {
    this.canupload = value;
  }

  public ismodal: boolean = false;
  @Input() set modalview(value: boolean) {
    this.ismodal = value;
  }
  @Output() callbackevent = new EventEmitter<any>();

  txt_fileName: string = "";
  txt_fileRefno: string = "";
  txt_fileDocType: string = "";

  private fileName: string = "";
  private fileDesc: string = "";
  private fileSize: number = 0;
  private fileCreateDate: string = "";

  DefaultFilename: string = "";

  public errorMessage: string = '';

  loading = false;
  myFiles: string[] = [];
  sMsg: string = '';
  AttachList: any[] = [];
  Mail_Pkid: string = '';
  modal: any;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private gs: GlobalService,
    private lovService: LovService,
    private http2: HttpClient,
  ) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  @ViewChild('fileinput') private fileinput: ElementRef;

  RecordList: Table_Mast_Files[] = [];
  MultiFilesList: Table_Mast_Files[] = [];
  filesSelected: boolean = false;;

  ngOnInit() {
    this.txt_fileDocType = this.Files_Type;
    this.txt_fileRefno = this.Files_Ref_No;
    this.SetDefault();
    this.LoadCombo();
    this.List();
  }

  SetDefault() {
    if (this.Files_Ref_No.trim() != "" && this.Customer_Name.trim() != "")
      this.DefaultFilename = this.Files_Ref_No + " " + this.Customer_Name;
    this.txt_fileRefno = this.Files_Ref_No;
  }
  LoadCombo() {
    if (this.Files_TypeList == null)
      this.Files_TypeList = new Array<any>();

    if (this.Files_Type.trim().length > 0) {
      if (this.GetFileType(this.Files_Type) == "") {
        let newRec = {
          code: this.Files_Type,
          name: this.Files_Type
        };
        this.Files_TypeList.push(newRec);
        this.txt_fileDocType = this.Files_Type;
      }
    }
  }
  getFileDetails(e: any) {

    this.MultiFilesList = <Table_Mast_Files[]>[];
    let mFiles = <Table_Mast_Files>{};

    let fileExtn: string = "";



    let strDfname: string = "";

    let isValidFile = true;
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;

      fileExtn = this.getExtension(e.target.files[i].name);

      this.fileName = this.gs.getGuid().toString().replace("-", "") + fileExtn;
      this.fileName = this.fileName.toUpperCase();
      this.fileDesc = e.target.files[i].name;
      this.fileDesc = this.fileDesc.toUpperCase();
      this.fileSize = e.target.files[i].size;

      if (this.DefaultFilename.trim() != "")
        strDfname = this.DefaultFilename + fileExtn.toUpperCase();
      if (strDfname.length > 50) {
        this.DefaultFilename = this.DefaultFilename.substring(0, 50 - fileExtn.length);
        strDfname = this.DefaultFilename + fileExtn.toUpperCase();
      }

      if (this.fileDesc.length > 50)
        this.fileDesc = this.fileDesc.substring(0, 50 - fileExtn.length) + fileExtn.toUpperCase();

      this.txt_fileName = strDfname;
      if (this.txt_fileName.trim().length <= 0)
        this.txt_fileName = this.fileDesc;
      this.txt_fileName = this.gs.ProperFileName(this.txt_fileName);

      this.fileCreateDate = this.gs.defaultValues.today;
      this.myFiles.push(e.target.files[i]);
    }

  }


  getExtension(_fName: string) {
    var temparr = _fName.split('.');
    return "." + temparr[temparr.length - 1].toString();
  }

  uploadFiles() {

    if (!this.filesSelected) {
      alert('No File Selected');
      return;
    }

    if (this.gs.isBlank(this.txt_fileName)) {
      alert("File Name cannot be Empty");
      return;
    }

    if (this.gs.isBlank(this.txt_fileDocType)) {
      alert("Doc. Type cannot be Empty");
      return;
    }


    this.Files_Type = this.txt_fileDocType;
    this.fileDesc = this.gs.ProperFileName(this.txt_fileName);

    this.loading = true;

    let frmData: FormData = new FormData();

    if (this.FILES_PATH1 == "") {
      this.FILES_PATH1 = "../Files_Folder";
      this.FILES_PATH2 = "/" + this.gs.FILES_FOLDER + "/Files/";
    }

    frmData.append("files_id", this.fileName);
    frmData.append("files_path", this.FILES_PATH1);
    frmData.append("files_path2", this.FILES_PATH2);
    frmData.append("files_create_folder", "N");
    frmData.append("files_type", this.Files_Type);
    frmData.append("table_name", this.table_name);
    frmData.append("table_pk_column", this.table_pk_column);
    frmData.append("files_parent_id", this.Files_Parent_Id);
    frmData.append("files_sub_id", this.Files_Sub_Id);
    frmData.append("comp_code", this.gs.company_code);
    frmData.append("branch_code", this.gs.branch_code);
    frmData.append("files_created_date", this.fileCreateDate);
    frmData.append("files_ref_no", this.txt_fileRefno);
    frmData.append("updatecolumn", this.updatecolumn);
    frmData.append("files_size", this.fileSize.toString());
    frmData.append("files_desc", this.fileDesc);
    frmData.append("root_folder", this.gs.FS_APP_FOLDER);
    frmData.append("files_created_by", this.gs.user_code);
    frmData.append("user_name", this.gs.user_name);
    frmData.append("instance_id", this.gs.INSTANCE_ID);

    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/UploadFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.loading = false;
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          this.List();
          //alert('Upload Complete');
        },
        error => {
          this.loading = false;
          alert('Failed');
        }
      );
  }


  List() {
    let fTypeName: string = "";
    this.errorMessage = '';
    var SearchData = this.gs.UserInfo;
    SearchData.PKID = this.Files_Parent_Id;
    SearchData.FILES_TYPE = this.Files_Type;
    SearchData.FILES_SUB_ID = this.Files_Sub_Id;
    SearchData.VIEW_ONLY_SOURCE = this.VIEW_ONLY_SOURCE
    SearchData.VIEW_ONLY_ID = this.VIEW_ONLY_ID;
    this.lovService.DocumentList(SearchData)
      .subscribe(response => {
        this.RecordList = <Table_Mast_Files[]>response.list;

        this.RecordList.forEach(Rec => {
          Rec.file_uri = this.gs.WWW_FILES_URL + "/" + Rec.file_id;
          if (Rec.files_type == "XML-EDI") {
            Rec.file_uri = this.gs.WWW_ROOT_FILE_FOLDER + "/../" + Rec.files_path + Rec.file_id;
          }
          fTypeName = this.GetFileType(Rec.files_type); //in database filestype  store code but the list wants to shows name, so to retreive name this fn is used;
          if (fTypeName)
            Rec.files_type = fTypeName;
          Rec.files_editrow = false;
        })

        if (this.Files_Type == "PAYMENT SETTLEMENT")
          this.ReLoadDocType(response.tothouse);

      }, error => {
        this.errorMessage = this.gs.getError(error);
      });
  }
  GetFileType(_scode: string) {
    let str = "";
    this.Files_TypeList.forEach(Rec => {
      if (Rec.code == _scode)
        str = Rec.name;
    })
    return str;
  }
  ReLoadDocType(_tothbl: number) {
    let fTypeList = this.Files_TypeList;

    this.Files_TypeList = new Array<any>();
    let newRec = {
      code: "EMAIL",
      name: "E-MAIL"
    };
    this.Files_TypeList.push(newRec);

    for (let j = 1; j <= _tothbl; j++) {
      let str = "HOUSE" + j.toString();
      if (this.GetFileType(str) == "") {
        newRec = {
          code: str,
          name: str
        };
        this.Files_TypeList.push(newRec);
      }
    }

    fTypeList.forEach(Rec => {
      if (this.GetFileType(Rec.code) == "") {
        newRec = {
          code: Rec.code,
          name: Rec.name
        };
        this.Files_TypeList.push(newRec);
      }
    })

  }


  ShowFile(_rec: Table_Mast_Files) {

    let filename: string = "";
    let filedisplayname: string = "";
    filename = this.gs.FS_APP_FOLDER + _rec.files_path + _rec.file_id;
    filedisplayname = _rec.file_desc;
    this.Downloadfile(filename, "", filedisplayname);
  }

  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.FS_APP_FOLDER, filename, filetype, filedisplayname);
  }

  Sendmail(_rec: Table_Mast_Files, emailmodal: any = null) {

    this.Mail_Pkid = this.gs.getGuid();
    let DispName: string = "document";
    if (_rec.file_desc != "")
    DispName = this.gs.ProperFileName(_rec.file_desc);
    this.AttachList = new Array<any>();
    this.AttachList.push({ filename: _rec.file_id, filetype: 'PDF', filedisplayname: DispName });
    this.modal = this.modalservice.open(emailmodal, { centered: true });
  }

  RemoveRow(_rec: Table_Mast_Files) {

    if (!confirm("Remove Selected File " + _rec.file_desc)) {
      return;
    }

    this.loading = true;

    let SearchData = {
      fileid: '',
      filelocation: ''
    };
    SearchData.fileid = _rec.file_id;
    SearchData.filelocation = this.gs.FS_APP_FOLDER + _rec.files_path;
    this.errorMessage = '';
    this.lovService.DeleteRecord(SearchData)
      .subscribe(response => {
        this.loading = false;
        if (response.retvalue == false) {
          this.errorMessage = response.error;
          alert(this.errorMessage);
        } else
          this.RecordList.splice(this.RecordList.findIndex(rec => rec.file_id == _rec.file_id), 1);
      },
        error => {
          this.loading = false;
          this.errorMessage = this.gs.getError(error);
        });
  }

  Close() {
    if (this.callbackevent)
      this.callbackevent.emit({ action: 'CLOSE', source: '' });
  }

  onBlur(field: string) {
    switch (field) {
      case 'txt_fileName': {
        this.txt_fileName = this.txt_fileName.toUpperCase();
        break;
      }
      case 'txt_fileRefno': {
        this.txt_fileRefno = this.txt_fileRefno.toUpperCase();
        break;
      }
    }
  }

  editrow(_rec: Table_Mast_Files) {
    if (_rec.file_id == null)
      return;
    if (_rec.file_id !== '') {
      _rec.files_editrow = !_rec.files_editrow;
    }
  }
   
  mailcallbackevent(event: any) {
    this.modal.close();
  }

}
