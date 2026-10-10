
import { GlobalVariables } from '../../core/models/globalvariables';

export class WarningMsg {
    rowcolor:string;
    pkid: string;
    source: string;
    name: string;
    category: string;
    message_type: string;
    message: string;
    ctr: number;
    _globalvariables: GlobalVariables;
}