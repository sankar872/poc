import { Component, Input,OnInit, TemplateRef, ChangeDetectionStrategy, AfterViewInit, OnChanges, SimpleChange, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { filter, map, tap, take, concatAll, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-user-search-view',
  templateUrl: './user-search-view.component.html',
  styleUrls: ['./user-search-view.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class UserSearchViewComponent implements OnChanges {

  @Input() public stuff: TemplateRef<any>;

  @Input()
    userList;
    @Input()
    seatsList;
    @Output()
    closeSlide = new EventEmitter();
    @Output() 
    viewUserInMap = new EventEmitter();

    userListInfo;
    seatListInfo;

    showloader:boolean = true;
    userListSubject$ =  new Subject<any[]>();
    userListAction$ = this.userListSubject$.asObservable();
    seatListSubject$ = new Subject<any[]>();
    seatListAction$ = this.seatListSubject$.asObservable();
    searchInputSubject$ = new BehaviorSubject<string>('');
    searchInputAction$ = this.searchInputSubject$.asObservable();
    displayCount:number = 10;
    radioOptions = 'users';
    isSeats:Boolean = false;
    isUsers:Boolean = false;
    totalRecordSubject$ = new BehaviorSubject<number>(10);
    totalRecordAction$ = this.totalRecordSubject$.asObservable()
    // .subscribe(res => {
    //     this.displayCount = res;
    // });
    resultData = [];
    users$ = Observable.combineLatest([this.userListAction$,this.searchInputAction$, this.totalRecordAction$])
    .subscribe(([users, search, listCount]) => {
            if(!!users && users != null) {
                let searchStr = search.toLowerCase();
                let filteredData = users.filter(usr => {
                        if(!!usr['entityInfo']['displayName'] && !!usr['entityInfo']['displayName']!= null) {
                            if(searchStr != '') {
                                let seatNumber = usr['entityInfo']['displayName'];
                                if(seatNumber.indexOf(searchStr)>= 0) {
                                    return usr
                                }
                            }
                            else {
                                return usr;
                            }
                        }   
                        if(!!usr['user'] && !!usr['user']!= null) {
                            if(!!usr['user']['name'] && !!usr['user']['name']!= null) {
                                if(searchStr != '') {
                                    let userName = usr['user']['name'];
                                    let desk = usr['entityInfo']['displayName'];
                                    userName = userName.toLowerCase();
                                    desk = desk.toLowerCase();
                                    if(userName.indexOf(searchStr)>= 0) {
                                        return usr
                                    }else if(desk.indexOf(searchStr) >= 0) {
                                        return usr
                                    }
                                }
                                else {
                                    return usr;
                                }
                            }   
                    }
                })
                this.userListInfo = filteredData;
                //return filteredData.slice(0,listCount)
                return {filteredData, listCount};
            }
        });
    
    seats$ = Observable.combineLatest([this.seatListAction$,this.searchInputAction$, this.totalRecordAction$])
    .subscribe(([users, search, listCount]) => {
            console.log("hereee",search);
            if(!!users && users != null) {
                let searchStr = search.toLowerCase();
                let filteredData = users.filter(usr => {
                        if(!!usr['entityInfo']['displayName'] && !!usr['entityInfo']['displayName']!= null) {
                            if(searchStr != '') {
                                let seatNumber = usr['entityInfo']['displayName'];
                                if(seatNumber.indexOf(searchStr)>= 0) {
                                    return usr
                                }
                            }
                            else {
                                return usr;
                            }
                        }   
                        if(!!usr['user'] && !!usr['user']!= null) {
                            if(!!usr['user']['name'] && !!usr['user']['name']!= null) {
                                if(searchStr != '') {
                                    let userName = usr['user']['name'];
                                    let desk = usr['entityInfo']['displayName'];
                                    userName = userName.toLowerCase();
                                    desk = desk.toLowerCase();
                                    if(userName.indexOf(searchStr)>= 0) {
                                        return usr
                                    }else if(desk.indexOf(searchStr) >= 0) {
                                        return usr
                                    }
                                }
                                else {
                                    return usr;
                                }
                            }   
                    }
                })
                console.log(filteredData);
                this.seatListInfo = filteredData;
                return {filteredData, listCount};
            }
        });

    constructor(
       
    ) {
    }
    ngOnChanges(changes: SimpleChanges) {
        if(this.userList) {
            this.userListSubject$.next(this.userList);
            this.userListInfo = this.userList;
        }
        if(this.seatsList){
            this.seatListSubject$.next(this.seatsList);
            this.seatListInfo = this.seatsList;
        }

        this.radioOptionsChange();
    }

    onSearchUser =(event) => {
        console.log(event);
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
        return word;
    }

    viewSeatNumber=(item) => {
        this.viewUserInMap.emit(item);
    }

    viewUserSeat=(item) => {
        this.viewUserInMap.emit(item);
    }

    radioOptionsChange(){
        if(this.radioOptions == 'users'){
            this.isUsers = true;
            this.isSeats = false;
            this.userListSubject$.next(this.userList);
        } else{
            this.isUsers = false;
            this.isSeats = true;
            this.seatListSubject$.next(this.seatsList);
        }
    }
}
