import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InputBoxComponent } from '../../shared/input/inputbox.component';
import * as _ from 'lodash';

import * as printJS from "print-js";


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  canPrint: boolean = false;
  canDownload: boolean = false;
  canExcel: boolean = false;
  canEmail: boolean = false;
  downloadfilename: string = "";

  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;

  private _menuid: string;
  @Input() set menuid(value: string) {
    this._menuid = value;
  }


  private _title: string;
  @Input() set title(value: string) {
    this._title = value;
  }

  private _url: string;
  @Input() set url(value: string) {
    this._url = value;
  }

  private _searchdata: any;
  @Input() set searchdata(value: any) {
    this._searchdata = value;
  }


  private _filename: string;
  @Input() set filename(value: any) {
    this._filename = value;
  }

  private _filetype: string;
  @Input() set filetype(value: any) {
    this._filetype = value;
  }

  private _filedisplayname: string;
  @Input() set filedisplayname(value: any) {
    this._filedisplayname = value;
  }

  private _filename2: string;
  @Input() set filename2(value: any) {
    this._filename2 = value;
  }

  private _filetype2: string;
  @Input() set filetype2(value: any) {
    this._filetype2 = value;
  }

  private _filedisplayname2: string;
  @Input() set filedisplayname2(value: any) {
    this._filedisplayname2 = value;
  }
  @Output() callbackevent = new EventEmitter<any>();

  Mail_Pkid: string = '';
  AttachList: any[] = [];
  modal: any;
  public maildata: any = { 'type': '', 'value': '', 'subject': '', 'presetmessage': '' };

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    private http2: HttpClient,
    private gs: GlobalService) {
    modalconfig.backdrop = 'static'; //true/false/static
    modalconfig.keyboard = true; //true Closes the modal when escape key is pressed
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.canPrint = this.gs.canPrint(this._menuid);
    this.canDownload = this.gs.canDownload(this._menuid);
    this.canExcel = this.gs.canExel(this._menuid);
    this.canEmail = this.gs.canEmail(this._menuid);

    if (this._url == undefined && this._filename == undefined)
      return;

    if (this._url == undefined)
      this.AutoLoad();
    else
      this.loaddata();

  }


  loaddata() {
    this.gs.makecall(this._url, this._searchdata).subscribe(
      response => {

        this.filename = response.filename;
        this.filetype = response.filetype;
        this.filedisplayname = response.filedisplayname;

        this.filename2 = response.filename2;
        this.filetype2 = response.filetype2;
        this.filedisplayname2 = response.filedisplayname2;

        if (!this.gs.isBlank(response.type) && !this.gs.isBlank(response.value)) {
          this.maildata.type = response.type;
          this.maildata.value = response.value;
        } else {
          this.maildata.type = '';
          this.maildata.value = '';
        }
        if (!this.gs.isBlank(this._searchdata.MAIL_SUBJECT)) {
          this.maildata.subject = this._searchdata.MAIL_SUBJECT;
        } else {
          this.maildata.subject = '';
        }
        if (!this.gs.isBlank(response.presetmessage)) {
          this.maildata.presetmessage = response.presetmessage;
        } else {
          this.maildata.presetmessage = '';
        }

        this.AutoLoad();
      },
      error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
        this.Close();
      }
    );
  }

  Close() {
    if (this.callbackevent)
      this.callbackevent.emit({ action: 'CLOSE', source: 'MANIFEST' });
  }


  AutoLoad() {
    this.downloadfilename = this.GetFileWithoutExtension(this._filedisplayname);
    this.gs.getFile(this.gs.GLOBAL_REPORT_FOLDER, this._filename, this._filetype, this._filedisplayname).subscribe(response => {

      this.pdfViewerAutoLoad.pdfSrc = response;
      this.pdfViewerAutoLoad.refresh();

    }, error => {
      this.errorMessage = this.gs.getError(error);
      alert(this.errorMessage);
    });

  }

  report(action: string, emailmodal: any = null) {


    if (action == "email") {
      if (!this.gs.isBlank(this.downloadfilename)) {
        this._filedisplayname = this.gs.ProperFileName(this.downloadfilename) + ".pdf";
      }
      if (this.gs.isBlank(this._filename)) {
        this.AttachFile2List(emailmodal, 0);
      } else
        this.GetFileSize(emailmodal);
    }
    else if (action == "excel") {
      if (this._filedisplayname2 == null || this._filedisplayname2 == undefined || this._filedisplayname2 == "")
        return;
      if (!this.gs.isBlank(this.downloadfilename)) {
        this._filedisplayname2 = this.gs.ProperFileName(this.downloadfilename) + ".xls";
      }
      this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, this._filename2, this._filetype2, this._filedisplayname2);
    }
    else if (action == "download") {
      if (this._filedisplayname == null || this._filedisplayname == undefined || this._filedisplayname == "")
        return;
      if (!this.gs.isBlank(this.downloadfilename)) {
        this._filedisplayname = this.gs.ProperFileName(this.downloadfilename) + ".pdf";
      }
      this.gs.DownloadFile(this.gs.GLOBAL_REPORT_FOLDER, this._filename, this._filetype, this._filedisplayname);
    }
    else if (action == "print") {
      this.PrintPdf();
      //var url = this.gs.WWW_ROOT_FILE_FOLDER.replace("Files_Folder", "") + this._filename.replace('d:\\motherlines.us\\', '');
    }
  }

  PrintPdf() {

    this.downloadfilename = this.GetFileWithoutExtension(this._filedisplayname);
    this.gs.getFile(this.gs.GLOBAL_REPORT_FOLDER, this._filename, this._filetype, this._filedisplayname).subscribe(response => {

      var file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);
      printJS(fileURL);

    }, error => {
      this.errorMessage = this.gs.getError(error);
      alert(this.errorMessage);
    });

  }




  mailcallbackevent(event: any) {
    this.modal.close();
    this.AutoLoad();
  }

  GetFileExtension(_fdispname: string) {
    var temparr = _fdispname.split('.');
    return temparr[temparr.length - 1]
  }

  GetFileWithoutExtension(_fdispname: string) {
    let extn = this.GetFileExtension(_fdispname);
    if (_fdispname.length > extn.length + 1)
      return _fdispname.substring(0, (_fdispname.length - (extn.length + 1)));
    else
      return _fdispname;
  }
  onBlur(_feild: string) {
    if (_feild == "downloadfilename")
      this.downloadfilename = this.downloadfilename.toLocaleUpperCase();
  }

  GetFileSize(emailmodal: any = null) {
    let fsize: number = 0;
    let SearchData = {
      table: '',
      pkid: '',
      file_name: ''
    };

    SearchData.table = 'FILE-SIZE';
    SearchData.file_name = this._filename
    this.gs.SearchRecord(SearchData)
      .subscribe(response => {

        if (!this.gs.isBlank(response.fsize))
          fsize = response.fsize;

        this.AttachFile2List(emailmodal, fsize);

      },
        error => {
          let err = this.gs.getError(error);
          alert(err);
        });
  }

  AttachFile2List(emailmodal: any = null, fsize: number) {
    this.Mail_Pkid = this.gs.getGuid();
    this.AttachList = new Array<any>();
    this.AttachList.push({ filename: this._filename, filetype: this._filetype, filedisplayname: this._filedisplayname, filesize: fsize });
    this.modal = this.modalservice.open(emailmodal, { centered: true });
  }
}
