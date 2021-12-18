import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tbl_mast_filesm } from '../models/Tbl_mast_filesm';
import { GlobalService } from '../../core/services/global.service';
import { AiDocsService } from '../services/aidocs.service';

@Component({
  selector: 'app-aidocs',
  templateUrl: './app-aidocs.component.html',
  providers: [AiDocsService]
})
export class AiDocsComponent {
  // Local Variables 
  @Input() menuid: string = '';
  @Input() type: string = '';


  sub: any;

  constructor(
    public ms: AiDocsService,
    private route: ActivatedRoute,
    public gs: GlobalService
  ) {
    // URL Query Parameter 
  }

  ngOnInit() {
    this.gs.checkAppVersion();
    this.ms.init(this.route.snapshot.queryParams);
  }

  // Destroy Will be called when this component is closed
  ngOnDestroy() {

  }

  resetRights(){
  }

  ActionHandler(action : string){
    if ( action == "LIST") {
      this.ms.List(action);
    }
    if ( action == "ADD") {
      
    }
  }

  // Query List Data

  Close() {
    this.gs.ClosePage('home');
  }

}
