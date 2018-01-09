import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MonthService } from '../../services/month.service';

@Component({
  selector: 'app-month-form',
  templateUrl: './month-form.component.html',
  styleUrls: ['./month-form.component.css']
})
export class MonthFormComponent implements OnInit {
  dateChanged = new Subject<Date>();
  dt: Date;

  constructor(private monthService: MonthService) { }

  ngOnInit() {
    this.dt = new Date();
  }

  onDateChanged($event){
    this.monthService.activeMonthChanged($event);
  }

}
