import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { tap, finalize, concatMap } from "rxjs/operators";

@Injectable()
export class LoaderService {
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$: Observable<boolean> = this.loadingSubject.asObservable();
    constructor() {}
    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null).pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        );
    }

    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }
}
