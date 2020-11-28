import { Component, Input, ChangeDetectionStrategy, AfterViewInit, OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, map, tap, take, concatAll, toArray, combineLatest } from 'rxjs/operators';

@Component({
    selector: 'search-map-user',
    styleUrls: ['search-map-user.component.scss'],
    templateUrl: 'search-map-user.component.html',
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class SearchMapUserComponent implements OnChanges {
    @Input()
    userList;
    @Output()
    closeSlide = new EventEmitter();
    @Output() 
    viewUserInMap = new EventEmitter()
    showloader:boolean = true;
    userListSubject$ =  new BehaviorSubject<any>(this);
    userListAction$ = this.userListSubject$.asObservable();
    searchInputSubject$ = new BehaviorSubject<string>('');
    searchInputAction$ = this.searchInputSubject$.asObservable();
    displayCount:number = 10;
    totalRecordSubject$ = new BehaviorSubject<number>(10);
    totalRecordAction$ = this.totalRecordSubject$.asObservable()
    // .subscribe(res => {
    //     this.displayCount = res;
    // });
    resultData = [];
    users$ = combineLatest([this.userListAction$,this.searchInputAction$, this.totalRecordAction$]);

    constructor(
    ) {
    }
    ngOnChanges(changes: SimpleChanges) {
        if(this.userList) {
            this.userListSubject$.next(this.userList);
        }
    }

    onSearchUser =(event) => {
        this.searchInputSubject$.next(event);
        this.totalRecordSubject$.next(10);
    }
    loadMoreUser = (count= 10) =>{
        this.totalRecordSubject$.next(count+10);
    }


    getUserLegend = (item) => {
        if(!!item.user.firstName) {
            const fName = ( item.user.firstName.length)? item.user.firstName.charAt(0): '';
            const lName = (item.user.lastName.length)? item.user.lastName.charAt(0): '';
            return `${fName}${lName}`;
        }
        return '';
    }
    closepanel =() => {
        this.closeSlide.emit()
    }
    getTranslate(word) {
        let translatedWord = word;
        return translatedWord[word];
    }
    viewUserSeat=(item) => {
        this.viewUserInMap.emit(item);
    }
}