import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { of } from "rxjs/observable/of";
import { tap, finalize, concatMap } from "rxjs/operators";

@Injectable()
export class CustomLoaderService {
    loadingSubject = new BehaviorSubject<boolean>(false);
    stepperSubject = new BehaviorSubject<string>("");
    loading$: Observable<boolean> = this.loadingSubject.asObservable();
    stepper$: Observable<string> = this.stepperSubject.asObservable();
    /*customLoadingSubject = new BehaviorSubject<boolean>(false);
    loaderCustom$: Observable<
        boolean
    > = this.customLoadingSubject.asObservable();*/
    constructor() {}
    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null).pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        );
    }
    setHeaderTitle(step) {
        this.stepperSubject.next(step);
    }
    removeHeaderTitle() {
        this.stepperSubject.next("");
    }
    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }
}
