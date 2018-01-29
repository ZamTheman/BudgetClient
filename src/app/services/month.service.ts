import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MonthService {
  dateChanged = new Subject<Date>();
  activeDate: Date;
  activeStatisticsDate: Date;
  
  constructor() { 
    this.activeDate = new Date();
  }

  activeMonthChanged(date: Date){
    let localDate = new Date(date.toString());
    this.activeDate = localDate;
    this.dateChanged.next(localDate);
  }

  setStatisticDate(date: Date){
    let localDate = new Date(date.toString());
    this.activeStatisticsDate = date;
  }
}
