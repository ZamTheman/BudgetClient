import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MonthService } from '../services/month.service';
import { ExpensesService } from '../services/expenses.service';
import { SalaryService } from '../services/salary.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  statisticsForm: FormGroup;
  years: number[];
  types: string[];
  statisticsType: string;

  constructor(
    private monthService: MonthService,
    private expensesService: ExpensesService,
    private salariesService: SalaryService) {}

  ngOnInit() {
    this.years = this.createYears();
    this.types = ['Utgifter', 'Löner'];
    this.statisticsForm = this.createForm();
    this.statisticsType = 'Expenses';
    this.selectedYearChanged();
  }

  selectedYearChanged(){
    // this.monthService.setStatisticDate(this.statisticsForm.value['year']);
    if(this.statisticsType == "Expenses")
      this.expensesService.requestExpensesForYear(new Date(this.statisticsForm.value['year'], 1, 1));
    else
      this.salariesService.requestSalariesForYear(new Date(this.statisticsForm.value['year'], 1, 1));
  }

  selectedTypeChanged(){
    switch(this.statisticsForm.value['type']){
      case 'Utgifter':
        this.statisticsType = 'Expenses';
        this.expensesService.requestExpensesForYear(new Date(this.statisticsForm.value['year'], 1, 1));
        break;
      case 'Löner':
        this.statisticsType = 'Salaries';
        this.salariesService.requestSalariesForYear(new Date(this.statisticsForm.value['year'], 1, 1));
        break;
      default:
        break;
    }
  }

  createForm() : FormGroup{
    return new FormGroup({
      'year': new FormControl(new Date().getFullYear()),
      'type': new FormControl('Utgifter')
    })
  }

  private createYears() : number[]{
    let years = new Array();
    for(let i = new Date().getFullYear() - 5; i < new Date().getFullYear() + 3; i++){
      years.push(i);
    }
    return years;
  }
}
