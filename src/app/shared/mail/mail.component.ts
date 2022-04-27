import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { LovService } from '../services/lov.service';
import { Table_Email } from '../models/table_email';
import { SearchTable } from '../../shared/models/searchtable';
import { Table_Mast_Files } from '../models/table_mast_files';
import { strictEqual } from 'assert';
import { HtmlParser } from '@angular/compiler';

declare var $: any;

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
})
export class MailComponent implements OnInit {
  // Local Variables 
  title = 'Mail';
  @ViewChild('fileinput') private fileinput: ElementRef;

  @Input() public pkid: string = '';
  @Input() public AttachList = new Array<any>();
  public ismodal: boolean = false;
  @Input() set modalview(value: boolean) {
    this.ismodal = value;
  }

  private _maildata: any;
  @Input() set maildata(value: any) {
    this._maildata = value;
  }
  @Output() mailcallbackevent = new EventEmitter<any>();
  chkReadRecipt: boolean = false;
  chkDelivReceipt: boolean = false;
  customer_name: string = "";
  customer_id: string = "";

  showattach: boolean = false;

  myFiles: string[] = [];
  FileList: any[] = [];
  filesSelected: boolean = false;;

  disableSave = true;
  loading = false;

  to_ids: string = '';
  cc_ids: string = '';
  cc_ids2: string = '';
  bcc_ids: string = '';
  subject: string = '';
  message: string = '';
  default_cc_id: string = '';
  default_subject: string = '';
  presetmessage: string = '';

  msgFontFamily: string = '';
  msgFontSize: string = '';
  msgForeground: string = '';
  msgFontWeight: string = '';
  EmailList: Table_Email[] = [];
  chkallto: boolean = true;
  chkallcc: boolean = false;
  allto: boolean = true;
  allcc: boolean = false;
  lbl_msgattachfz: string = '';
  attach_totfilesize: number = 0;
  MultiFilesList: Table_Mast_Files[] = [];

  public errorMessage: string[] = [];
  constructor(
    private gs: GlobalService,
    private lovService: LovService,
    private http2: HttpClient,
  ) {
  }

  // Init Will be called After executing Constructor
  ngOnInit() {
    this.gs.checkAppVersion();
    this.chkDelivReceipt = false;
    this.chkReadRecipt = false;
    this.cc_ids = '';
    this.cc_ids2 = '';
    this.bcc_ids = '';
    this.to_ids = '';
    this.subject = '';
    this.presetmessage = '';
    if (!this.gs.isBlank(this._maildata.presetmessage))
      this.presetmessage = this._maildata.presetmessage;

    this.message = this.presetmessage + '\n' + this.gs.user_email_signature.toString();
    this.msgFontFamily = this.gs.user_email_sign_font;
    this.msgFontSize = this.gs.user_email_sign_size + "px";
    this.msgForeground = this.gs.user_email_sign_color;
    if (this.gs.user_email_sign_bold == "Y")
      this.msgFontWeight = "bold";
    else
      this.msgFontWeight = "normal";

    this.default_cc_id = '';
    if (this._maildata.type == "CC") {
      if (!this.gs.isBlank(this._maildata.value))
        this.default_cc_id = this._maildata.value;
    }
    this.cc_ids = this.default_cc_id;

    if (!this.gs.isBlank(this.gs.user_email_cc)) {
      if (!this.cc_ids.toLowerCase().includes(this.gs.user_email_cc.toLowerCase()))
        this.cc_ids2 = this.gs.user_email_cc.toString();
    }

    this.default_subject = '';
    if (!this.gs.isBlank(this._maildata.subject))
      this.default_subject = this._maildata.subject;
    this.subject = this.default_subject;

    this.customer_id = '';
    if (!this.gs.isBlank(this._maildata.customer_id))
      this.customer_id = this._maildata.customer_id;

    this.customer_name = '';
    if (!this.gs.isBlank(this._maildata.customer_name))
      this.customer_name = this._maildata.customer_name;

    this.GetPreSetMessage();

    $(function () {
      $('.modal-dialog').draggable();
    });
  }

  LovSelected(_Record: SearchTable) {
    if (_Record.controlname == 'CUSTOMER') {
      this.customer_name = _Record.name;
      this.customer_id = _Record.id;
    }
  }
  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  // Save Data
  SendMail() {

    this.errorMessage = [];
    if (!this.allvalid())
      return;

    this.SearchRecord('smtpmail', 'MAIL');
  }

  allvalid() {
    let bret: boolean = true;
    this.errorMessage = [];;
    if (this.gs.isBlank(this.to_ids)) {
      bret = false;
      this.errorMessage.push("Mail To Address Is Blank");
    }

    if (this.gs.isBlank(this.subject)) {
      bret = false;
      this.errorMessage.push("Subject Cannot Be Blank");
    }

    if (this.gs.isBlank(this.message)) {
      bret = false;
      this.errorMessage.push("Message Cannot Be Blank");
    }

    if (!bret)
      alert(this.errorMessage);

    return bret;
  }
  OnBlur(field: string) {

  }
  Close() {
    if (this.mailcallbackevent)
      this.mailcallbackevent.emit({ action: 'CLOSE' });

  }
  Downloadfile(filename: string, filetype: string, filedisplayname: string) {
    this.gs.DownloadFile(this.gs.globalVariables.report_folder, filename, filetype, filedisplayname);
  }

  SearchRecord(controlname: string, _type: string) {

    let Htm: string = "";
    let str: string = "";
    this.errorMessage = [];
    let filename: string = "";
    let filedisplayname: string = "";

    this.cc_ids = this.cc_ids.trim();
    if (this.cc_ids2.trim().length > 0 && this.cc_ids != "")
      this.cc_ids += ",";
    this.cc_ids += this.cc_ids2;

    Htm += " <html> ";
    Htm += " <head>";
    Htm += " <style type='text/css'> ";
    Htm += " body { ";
    Htm += " font-family:" + this.gs.user_email_sign_font + ";";
    Htm += " color:" + this.gs.user_email_sign_color + ";";
    Htm += " font-size:" + this.gs.user_email_sign_size + "px;";
    if (this.gs.user_email_sign_bold == "Y")
      Htm += " font-weight:bold;";
    Htm += " } ";
    Htm += " </style> ";
    Htm += " </head> ";
    Htm += " <body> ";

    str = this.message.toString().replace("\r\n", "<BR>");
    str = str.replace("\r", "<BR>");
    str = str.replace("\n", "<BR>");
    Htm += str;
    Htm += " </body> ";
    Htm += " </html> ";


    if (this.AttachList != null) {
      if (this.AttachList.length == 1) {
        filename = this.AttachList[0].filename;
        filedisplayname = this.AttachList[0].filedisplayname;
      } else {
        for (let rec of this.AttachList) {
          if (filename != "")
            filename = filename.concat("|");
          filename = filename.concat(rec.filename, "?", rec.filedisplayname);
        }
      }
    }


    let SearchData = {
      table: controlname,
      pkid: '',
      to_ids: '',
      cc_ids: '',
      bcc_ids: '',
      subject: '',
      message: '',
      filename: '',
      filedisplayname: '',
      type: _type,
      company_code: this.gs.company_code,
      branch_code: this.gs.branch_code,
      user_pkid: this.gs.user_pkid,
      user_name: this.gs.user_name,
      user_code: this.gs.user_code,
      read_receipt: this.chkReadRecipt ? "YES" : "NO",
      delivery_receipt: this.chkDelivReceipt ? "YES" : "NO",
      update_ref_type: this._maildata.update_ref_type,
      update_ref_id: this._maildata.update_ref_id,
      customer_name: this._maildata.customer_name
    };

    SearchData.table = controlname;
    SearchData.pkid = this.pkid;
    SearchData.to_ids = this.to_ids;
    SearchData.cc_ids = this.cc_ids;
    SearchData.bcc_ids = this.bcc_ids;
    SearchData.subject = this.subject;
    SearchData.message = Htm;
    SearchData.filename = filename;
    SearchData.filedisplayname = filedisplayname;
    SearchData.type = _type;
    SearchData.company_code = this.gs.company_code;
    SearchData.branch_code = this.gs.branch_code;
    SearchData.user_pkid = this.gs.user_pkid;
    SearchData.user_name = this.gs.user_name;
    SearchData.user_code = this.gs.user_code;
    SearchData.update_ref_type = this._maildata.update_ref_type;
    SearchData.update_ref_id = this._maildata.update_ref_id;
    SearchData.customer_name = this._maildata.customer_name;

    this.gs.SearchRecord(SearchData)
      .subscribe(response => {
        if (_type == "MAIL") {
          this.errorMessage.push(response.message);
        }
      },
        error => {
          this.errorMessage.push(this.gs.getError(error));
          alert(this.errorMessage);
        });
  }

  /*
  ShowBL() {
    //this.router.navigate([rec.menu_route1], { queryParams: { parameter: rec.menu_route2 }, replaceUrl: true });
    //this.router.navigate(["operations/seabl"], { queryParams: { parameter:"menuid:JOBSEAEXPORT,type:SEA EXPORT"}, replaceUrl: true });
    //this.router.navigate([{ outlets: { blpage: ['operations/seabl'] } }]); 
  }
  */

  RemoveAttachment(Id: string, _type: string) {
    this.AttachList.splice(this.AttachList.findIndex(rec => rec.filename == Id), 1);
    this.GetTotfilesize();
  }

  GetEmailIds() {
    this.errorMessage = [];;
    if (this.gs.isBlank(this.customer_id)) {
      this.errorMessage.push("Please select a Party and continue.....");
      alert(this.errorMessage);
      return;
    }

    var SearchData = this.gs.UserInfo;
    SearchData.PKID = this.customer_id;
    this.lovService.GetEmailIds(SearchData)
      .subscribe(response => {
        this.EmailList = <Table_Email[]>response.list;
        if (this.gs.isBlank(this.EmailList))
          alert('Email IDs Not Found');
        else {
          if (!this.gs.isBlank(this._maildata.cont_group)) {
            for (let rec of this.EmailList) {
              if (rec.cont_group == this._maildata.cont_group) {
                rec.is_to = true;
              } else {
                rec.is_to = false;
                this.allto = false;
              }
            }
          }
          this.chkallto = this.allto;
        }
      }, error => {
        this.errorMessage.push(this.gs.getError(error));
      });
  }

  SelectDeselect(_type: string) {
    if (_type == "TO") {
      this.allto = !this.allto;
      this.EmailList.forEach(Rec => {
        Rec.is_to = this.allto;
        this.chkallto = this.allto;
      })
    }

    if (_type == "CC") {
      this.allcc = !this.allcc;
      this.EmailList.forEach(Rec => {
        Rec.is_cc = this.allcc;
        this.chkallcc = this.allcc;
      })
    }

  }

  EmailListChk_Click(_type: string, _rec: Table_Email) {
    if (_type == "TO")
      _rec.is_to = !_rec.is_to;
    if (_type == "CC")
      _rec.is_cc = !_rec.is_cc;
  }

  SaveIds() {
    let Mail_To: string = "";
    let Mail_Cc: string = "";
    this.EmailList.forEach(Rec => {
      if (Rec.is_to == true && Rec.email.toString().trim().length > 0) {
        if (Mail_To != "")
          Mail_To += ",";
        Mail_To += Rec.email.toString();
      }
      if (Rec.is_cc == true && Rec.email.toString().trim().length > 0) {
        if (Mail_Cc != "")
          Mail_Cc += ",";
        Mail_Cc += Rec.email.toString();
      }
    })

    this.to_ids = Mail_To.toString().toLowerCase();

    if (this.gs.isBlank(this.default_cc_id))
      this.cc_ids = Mail_Cc.toString().toLowerCase();
    else {
      this.cc_ids = this.default_cc_id;
      if (this.cc_ids != '')
        this.cc_ids += ','
      this.cc_ids += Mail_Cc.toString().toLowerCase();
    }

    this.EmailList = <Table_Email[]>[];
  }
  CancelList() {
    this.EmailList = <Table_Email[]>[];
  }

  ShowHideAttach() {
    this.showattach = !this.showattach;
  }


  getFileDetails(e: any) {
    this.MultiFilesList = <Table_Mast_Files[]>[];
    this.filesSelected = false;
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.filesSelected = true;
      this.myFiles.push(e.target.files[i]);
    }
    this.uploadFiles();
  }

  uploadFiles() {

    if (!this.filesSelected) {
      // alert('No File Selected');
      return;
    }

    let frmData: FormData = new FormData();
    frmData.append("report_folder", this.gs.GLOBAL_REPORT_FOLDER);
    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    this.http2.post<any>(
      this.gs.baseUrl + '/api/General/AttachFiles', frmData, this.gs.headerparam2('authorized-fileupload')).subscribe(
        data => {
          this.filesSelected = false;
          this.fileinput.nativeElement.value = '';
          if (this.gs.isBlank(this.AttachList))
            this.AttachList = new Array<any>();
          if (!this.gs.isBlank(data.filelist))
            for (let rec of data.filelist) {
              this.AttachList.push({ filename: rec.filename, filetype: rec.filetype, filedisplayname: rec.filedisplayname, filesize: rec.filesize });
            }
          this.GetTotfilesize();
        },
        error => {
          // alert('Failed');
          let emsg = this.gs.getError(error);;
          if (!this.gs.isBlank(emsg))
            emsg = 'Failed, ' + emsg;
          else
            emsg = 'Failed';
          alert(emsg);
        }
      );
  }

  GetTotfilesize() {
    this.attach_totfilesize = 0;
    try {
      this.attach_totfilesize = 0;
      if (this.AttachList != null) {
        for (let rec of this.AttachList) {
          this.attach_totfilesize += rec.filesize;
        }
      }
      this.lbl_msgattachfz = this.GetFileSize(this.attach_totfilesize);
    } catch (e) {
    }
  }
  GetFileSize(_fsize: number) {
    let strsize: string = "";
    if (_fsize < 1024)
      strsize = _fsize.toString() + "bytes";
    else {
      let _newfsize = (_fsize / 1024.00);
      _newfsize = this.gs.roundNumber(_newfsize, 2);
      _newfsize = Math.ceil(_newfsize);
      if (_newfsize < 1024)
        strsize = _newfsize.toString() + "KB";
      else
        strsize = _newfsize.toString() + "MB";
    }
    return " " + strsize;
  }

  GetPreSetMessage() {

    let SearchData2 = {
      company_code: this.gs.company_code,
      table: '',
      cont_group: '',
      pkid: '',
      file_name: ''
    };

    SearchData2.table = "EMAIL-PRESETMESSAGE";
    SearchData2.cont_group = this._maildata.cont_group;
    if (this.AttachList != null && this.AttachList.length == 1)
      SearchData2.file_name = this.AttachList[0].filename;
    this.gs.SearchRecord(SearchData2)
      .subscribe(response => {

        if (!this.gs.isBlank(response.fsize)) {
          if (this.AttachList != null && this.AttachList.length == 1)
            this.AttachList[0].filesize = response.fsize;
        }
        if (!this.gs.isBlank(response.presetmessage)) {
          this.message = response.presetmessage + '\n' + this.gs.user_email_signature.toString();
        }

        this.GetTotfilesize();
      },
        error => {
          let err = this.gs.getError(error);
          alert(err);
        });
  }
}
