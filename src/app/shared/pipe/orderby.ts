import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {

    constructor( private gs : GlobalService){

    }

    transform(value: any[], column: string = '', order = true): any[] {
        if (!value) {
            return value;
        }
        if (value.length <= 1) {
            return value;
        } 
        if (!column || column === '') {
            if (order) {
                return value.sort();
            }
            else {
                return value.sort().reverse();
            }
        }
        return this.gs.sortList(value, column, order);
    }



}
