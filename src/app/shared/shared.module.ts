
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { LovService } from './services/lov.service';
import { GenerateDocService } from './services/generatedoc.service';
import { GenService } from './services/gen.services';

import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

import { AutoCompleteComponent } from './autocomplete/autocomplete.component';

import { AutoComplete2Component } from './autocomplete2/autocomplete2.component';


import { OsRemSharedComponent } from './osrem/osremshared.component';


import { DateComponent } from './date/date.component';

import { DialogComponent } from './dialog/dialog.component';
import { WaitComponent } from './dialog-wait/wait.component';

import { ErrorMessageComponent } from './error/errorMessage';


import { FileUploadComponent } from './fileupload/fileupload.component';

import { FileUploadEditComponent } from './fileupload/fileupload-edit.component';

import { ClipBoardComponent } from './clipboarddata/clipboard.component';

import { QtnComponent } from './qtn/qtn.component';

import { LoadQtnComponent } from './qtn/loadqtn.component';

import { MailComponent } from './mail/mail.component';
import { HistoryComponent } from './history/history.component';
import { ApprovalComponent } from './approval/approval.component';

import { PasteDataComponent } from './pastedata/pastedata.component';

import { RateUpdateComponent } from './rateupdate/rateupdate.component';
import { XmlomsComponent } from './xmloms/xmloms.component';
import { AllReportComponent } from './allreport/allreport.component';
import { FtpReportComponent } from './ftpreport/ftpreport.component';
import { PageComponent } from './page/page.component';
import { Page2Component } from './page2/page2.component';

import { InputBoxComponent } from './input/inputbox.component';
import { InputBoxNumberComponent } from './inputnumber/inputboxnumber.component';
import { ReportComponent } from './report/report.component';
import { GenListComponent } from './genlist/genlist.component';
import { SortByPipe } from './pipe/orderby';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PdfJsViewerModule,    
    HttpClientModule,
    NgbModule
  ],
  declarations: [
    
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    ErrorMessageComponent,
    DialogComponent,
    WaitComponent,
    FileUploadComponent,

    ClipBoardComponent,
    QtnComponent,
    LoadQtnComponent,
    MailComponent,
    HistoryComponent,
    OsRemSharedComponent,
    ApprovalComponent,
    PasteDataComponent,
    RateUpdateComponent,
    XmlomsComponent,
    AllReportComponent,
    FtpReportComponent,
    PageComponent,
    Page2Component,
    InputBoxComponent,
    InputBoxNumberComponent,
    ReportComponent,
    FileUploadEditComponent,
    GenListComponent,
    SortByPipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    
    AutoCompleteComponent,
    AutoComplete2Component,
    DateComponent,
    ErrorMessageComponent,
    DialogComponent,
    WaitComponent,
    FileUploadComponent,
    
    ClipBoardComponent,
    QtnComponent,
    LoadQtnComponent,
    MailComponent,
    HistoryComponent,
    OsRemSharedComponent,
    ApprovalComponent,
    PasteDataComponent,
    RateUpdateComponent,
    XmlomsComponent,
    AllReportComponent,
    FtpReportComponent,
    PageComponent,
    Page2Component,
    InputBoxComponent,
    InputBoxNumberComponent,
    ReportComponent,
    FileUploadEditComponent,
    GenListComponent,
    SortByPipe
  ],
  providers: [
    LovService,
    GenerateDocService
  ]
})
export class SharedModule { }
