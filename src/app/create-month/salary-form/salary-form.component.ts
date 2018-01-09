import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SalaryService } from '../../services/salary.service';
import { MonthService } from '../../services/month.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Salary } from '../../models/salary';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-salary-form',
  templateUrl: './salary-form.component.html',
  styleUrls: ['./salary-form.component.css']
})
export class SalaryFormComponent implements OnInit, OnDestroy {
  activeMonthChanged: Subscription;
  salaryChanged: Subscription;
  salaryForm: FormGroup;
  
  constructor(
    private salaryService: SalaryService, 
    private monthService: MonthService,
    private expensesService: ExpensesService) { }
  
  ngOnInit() {
    this.activeMonthChanged = this.monthService.dateChanged.subscribe(
      () => {
        this.salaryService.getSalariesForMonth(this.monthService.activeDate);
      }
    );
    this.salaryChanged = this.salaryService.salaryChanged.subscribe(
      () => {
        this.updateForm();
      }
    )
    this.salaryForm = this.createForm(null);
    this.salaryService.getSalariesForMonth(this.monthService.activeDate);
  }
  
  ngOnDestroy(): void {
    this.activeMonthChanged.unsubscribe();
  }

  getCopiedExpenses(){
    let date = new Date(this.monthService.activeDate.getFullYear(), this.monthService.activeDate.getMonth() -1, 1);
    this.expensesService.copyExpensesFromLastMonth(date);
  }
  
  updateForm(){
    this.salaryForm = this.createForm(this.salaryService.activeSalary);
  }
  
  createForm(salary: Salary){
    return new FormGroup({
      'incomeMarie': new FormControl(salary ? salary.incomeMarie : null),
      'incomeSamuel': new FormControl(salary ? salary.incomeSamuel : null),
      'id': new FormControl(salary ? salary.id : null)
    })
  }
  
  onSalarySubmit(){
    let salary = this.convertSalaryFormToSalary();
    if(salary.id < 1){
      this.salaryService.addSalary(salary);
    } else {
      this.salaryService.updateSalary(salary);
    }
  }

  onSalaryReset(){
    console.log(this.salaryService.activeSalary);
    this.salaryForm = this.createForm(this.salaryService.activeSalary);
  }
  
  convertSalaryFormToSalary() {
    let salary = new Salary(
      this.monthService.activeDate,
      this.salaryForm.value['incomeMarie'],
      this.salaryForm.value['incomeSamuel']
    );

    if(this.salaryForm.value['id'] > 0){
      salary.id = this.salaryForm.value['id'];
    }
    return salary;
  }
}
