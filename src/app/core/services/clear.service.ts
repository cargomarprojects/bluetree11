
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SeaImpMasterService } from '../../seaimport/services/seaimp-master.service';
import { SeaImpHouseService } from '../../seaimport/services/seaimp-house.service';
import { HouseService } from '../../seaexport/services/house.service';
import { seaexpMasterService } from '../../seaexport/services/seaexp-master.service';
import { AirExpHouseService } from '../../airexport/services/airexp-house.service';
import { AirExpMasterService } from '../../airexport/services/airexp-master.service';
import { AirImpMasterService } from '../../airimport/services/airimp-master.service';
import { AirImpHouseService } from '../../airimport/services/airimp-house.service';
import { ImportHblPageService } from '../../importdata/services/importhblpage.service';
import { ShipDataPageService } from '../../importdata/services/shipdatapage.service';
import { SettingPageService } from '../../importdata/services/settingpage.service';
import { QtnAirService } from '../../marketing/services/qtnair.service';
import { QtnFclService } from '../../marketing/services/qtnfcl.service';
import { QtnLclService } from '../../marketing/services/qtnlcl.service';
import { QtnRateService } from '../../marketing/services/qtnrate.service';
import { SalesJournalService } from '../../marketing/services/salesjournals.service';
import { PartyService } from '../../master/services/party.service';
import { PayrollMasterService } from '../../master/services/payrollmaster.service';
import { VendorService } from '../../master/services/vendor.service';
import { AlertLogPageService } from '../../other/services/alertlogpage.service';
import { ApprovedPageService } from '../../other/services/approvedpage.service';
import { DeliveryOrderService } from '../../other/services/deliveryorder.service';
import { OthGeneralService } from '../../other/services/oth-general.service';
import { OthGeneralExpenseService } from '../../other/services/oth-generalexpense.service';
import { GenFileUploadService } from '../../other/services/genfileupload.service';
import { LockUnlockService } from '../../other/services/lockunlock.service';
import { MblUsageService } from '../../other/services/mblusage.service';
import { MessengerSlipService } from '../../other/services/messengerslip.service';
import { OblReleaseService } from '../../other/services/oblrelease.service';
import { PayrollDetService } from '../../other/services/payrolldet.service';
import { CompanyService } from '../../useradmin/services/companym.service';
import { MenuService } from '../../useradmin/services/menum.service';
import { ModuleService } from '../../useradmin/services/modulem.service';
import { UserService } from '../../useradmin/services/userm.service';

@Injectable({
    providedIn: 'root'
})
export class ClearService {
    constructor(
        private http2: HttpClient,
        private gs: GlobalService,
        private sim: SeaImpMasterService,
        private sih: SeaImpHouseService,
        private sem: seaexpMasterService,
        private seh: HouseService,
        private aem: AirExpMasterService,
        private aeh: AirExpHouseService,
        private aim: AirImpMasterService,
        private aih: AirImpHouseService,
        private impdatahbl: ImportHblPageService,
        private impdataship: ShipDataPageService,
        private impdataset: SettingPageService,
        private qtnair: QtnAirService,
        private qtnfcl: QtnFclService,
        private qtnlcl: QtnLclService,
        private qtnrate: QtnRateService,
        private salesjournal: SalesJournalService,
        private partymaster: PartyService,
        private payrollmaster: PayrollMasterService,
        private vendormaster: VendorService,
        private alertpage: AlertLogPageService,
        private approvedpage: ApprovedPageService,
        private deliveryorder: DeliveryOrderService,
        private othgeneral: OthGeneralService,
        private othergenexp: OthGeneralExpenseService,
        private fileupload: GenFileUploadService,
        private lockunlock: LockUnlockService,
        private mblusage: MblUsageService,
        private messengerslip: MessengerSlipService,
        private oblrelease: OblReleaseService,
        private payrolldet: PayrollDetService,
        private companyservice: CompanyService,
        private menuservice: MenuService,
        private moduleservice: ModuleService,
        private userservice: UserService

    ) {
    }

    ClearInit() {
        this.sim.ClearInit();
        this.sih.ClearInit();
        this.sem.ClearInit();
        this.seh.ClearInit();
        this.aem.ClearInit();
        this.aeh.ClearInit();
        this.aim.ClearInit();
        this.aih.ClearInit();
        this.impdatahbl.ClearInit();
        this.impdataship.ClearInit();
        this.impdataset.ClearInit();
        this.qtnair.ClearInit();
        this.qtnfcl.ClearInit();
        this.qtnlcl.ClearInit();
        this.qtnrate.ClearInit();
        this.salesjournal.ClearInit();
        this.partymaster.ClearInit();
        this.payrollmaster.ClearInit();
        this.vendormaster.ClearInit();
        this.alertpage.ClearInit();
        this.approvedpage.ClearInit();
        this.deliveryorder.ClearInit();
        this.othgeneral.ClearInit();
        this.othergenexp.ClearInit();
        this.fileupload.ClearInit();
        this.lockunlock.ClearInit();
        this.mblusage.ClearInit();
        this.messengerslip.ClearInit();
        this.oblrelease.ClearInit();
        this.payrolldet.ClearInit();
        this.companyservice.ClearInit();
        this.menuservice.ClearInit();
        this.moduleservice.ClearInit();
        this.userservice.ClearInit();
    }
}


