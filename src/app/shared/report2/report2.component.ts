import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../core/services/global.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LovService } from '../services/lov.service';

@Component({
  selector: 'app-report2',
  templateUrl: './report2.component.html',
  styleUrls: ['./report2.component.css']
})
export class Report2Component implements OnInit {

  public errorMessage: string = '';
  public tab: string = 'main';

  canPrint: boolean = false;
  canDownload: boolean = false;
  canExcel: boolean = false;
  canEmail: boolean = false;

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

  private _fileid: string = '';
  @Input() set fileid(value: any) {
    this._fileid = value;
  }
  private _bucketname: string = '';
  @Input() set bucketname(value: any) {
    this._bucketname = value;
  }

  @Output() callbackevent = new EventEmitter<any>();

  Mail_Pkid: string = '';
  AttachList: any[] = [];
  modal: any;

  constructor(
    private modalconfig: NgbModalConfig,
    private modalservice: NgbModal,
    public lovService: LovService,
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

        this.AutoLoad();
      },
      error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      }
    );
  }

  Close() {
    if (this.callbackevent)
      this.callbackevent.emit({ action: 'CLOSE', source: 'REPORT2' });
  }


  AutoLoad() {

    if (this._bucketname) {

      this.lovService.GetS3Url({ fileid: this._fileid, bucket: this._bucketname, downloadfilename: this.filedisplayname, disposition: 'inline', pdfbytes: 'Y' })
        .subscribe(response => {
          if (response.retvalue == false) {
            this.errorMessage = response.error;
            alert(this.errorMessage);
          } else {
            this.showPdf(response.pdf);
          }
        }, error => {
          this.errorMessage = this.gs.getError(error);
        });

    } else {

      this.gs.getFile(this.gs.GLOBAL_REPORT_FOLDER, this._filename, this._filetype, this._filedisplayname).subscribe(response => {
        this.pdfViewerAutoLoad.pdfSrc = response;
        this.pdfViewerAutoLoad.refresh();
      }, error => {
        this.errorMessage = this.gs.getError(error);
        alert(this.errorMessage);
      });
    }
  }

  showPdf(base64Pdf: string) {

    const binaryString = window.atob(base64Pdf);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const header = String.fromCharCode(
      bytes[0],
      bytes[1],
      bytes[2],
      bytes[3],
      bytes[4]
    );
    const blob = new Blob(
      [bytes],
      { type: "application/pdf" }
    );

    const pdfUrl =
      URL.createObjectURL(blob);
    this.pdfViewerAutoLoad.pdfSrc = pdfUrl;
    this.pdfViewerAutoLoad.refresh();
    
    if (this.callbackevent) {
      this.callbackevent.emit({ action: 'PDF', base64Pdf: base64Pdf });
    }
  }

  report(action: string, emailmodal: any = null) {

  }

  mailcallbackevent(event: any) {
    // this.modal.close();
    // this.AutoLoad();
  }



}
