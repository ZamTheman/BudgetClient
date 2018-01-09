import { Component, OnInit } from '@angular/core';
import { ExpenseType } from '../../models/expenseType';
import { ExpenseTypeService } from '../../services/expense-type.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-type-form',
  templateUrl: './expense-type-form.component.html',
  styleUrls: ['./expense-type-form.component.css']
})
export class ExpenseTypeFormComponent implements OnInit {
  expenseTypes: ExpenseType[];
  newExpenseTypeForm: FormGroup;
  deleteExpenseTypeForm: FormGroup;
  
  constructor(private expenseTypeService: ExpenseTypeService) { }

  ngOnInit() {
    this.expenseTypes = this.expenseTypeService.getExpenseTypes();
    this.newExpenseTypeForm = this.createNewExpenseTypeForm();
    this.deleteExpenseTypeForm = this.createDeleteExpenseTypeForm();
  }

  createNewExpenseTypeForm(){
    return new FormGroup({
      'newExpenseTypeName': new FormControl(null, Validators.required),
    })
  }

  createDeleteExpenseTypeForm(){
    return new FormGroup({
      'expenseType': new FormControl(null, Validators.required),
    })
  }

  onNewExpenseTypeSubmit(){
    let expenseType = this.convertExpenseTypeFormToExpenseType();
    this.expenseTypeService.addExpenseType(expenseType);
    this.newExpenseTypeForm = this.createNewExpenseTypeForm();
  }

  onDeleteExpenseTypeSubmit(){
    this.deleteExpenseTypeForm.reset();
  }

  private convertExpenseTypeFormToExpenseType(){
    let expenseType = new ExpenseType(
      this.newExpenseTypeForm.value['newExpenseTypeName']
    );
    return expenseType;
  }

}
