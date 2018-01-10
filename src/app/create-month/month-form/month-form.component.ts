import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MonthService } from '../../services/month.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-month-form',
  templateUrl: './month-form.component.html',
  styleUrls: ['./month-form.component.css']
})
export class MonthFormComponent implements OnInit {
  monthForm: FormGroup;
  months: string[];
  years: number[];

  constructor(private monthService: MonthService) {}

  ngOnInit() {
    this.months = this.createMonths();
    this.years = this.createYears();
    this.monthForm = this.createForm();
  }

  selectedDateChanged(){
    this.monthService.activeMonthChanged(new Date(
      this.monthForm.value['year'],
      this.getIdForMonth(this.monthForm.value['month']),
      1
      ))
  }

  createForm() : FormGroup{
    return new FormGroup({
      'year': new FormControl(new Date().getFullYear()),
      'month': new FormControl(this.months[new Date().getMonth()])
    })
  }

  private createYears() : number[]{
    let years = new Array();
    for(let i = new Date().getFullYear() - 5; i < new Date().getFullYear() + 3; i++){
      years.push(i);
    }
    return years;
  }

  private createMonths() : string[]{
    return [
      'Januari',
      'Februari',
      'Mars',
      'April',
      'Maj',
      'Juni',
      'Juli',
      'Augusti',
      'September',
      'Oktober',
      'November',
      'December'
    ];
  }

  private getIdForMonth(month : string) : number{
    for(let i = 0; i < this.months.length; i++){
      if(month === this.months[i]){
        return i;
      }
    }
    return -1;
  }
}
