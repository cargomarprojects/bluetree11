import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
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
        return this.sortList(value, column, order);
    }

    private sortList(value: any[], key?: any, order?: boolean): any[] {

        const isInside = key && key.indexOf('.') !== -1;

        if (isInside) {
            key = key.split('.');
        }

        const array: any[] = value.sort((a: any, b: any): number => {
            if (!key) {
                return a > b ? 1 : -1;
            }

            if (!isInside) {
                return a[key] > b[key] ? 1 : -1;
            }

            return this.getValue(a, key) > this.getValue(b, key) ? 1 : -1;
        });

        if (!order) {
            return array.reverse();
        }

        return array;
    }

    private getValue(object: any, key: string[]) {
        for (let i = 0, n = key.length; i < n; ++i) {
            const k = key[i];
            if (!(k in object)) {
                return;
            }

            object = object[k];
        }

        return object;
    }

}
