import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExpenseType } from '../../models/expenseType';
import { ExpenseTypeService } from '../../services/expense-type.service';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from '../../services/expenses.service';
import { Expense } from '../../models/expense';
import { SplitsService } from '../../services/splits.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit, OnDestroy {
  expenseTypes: ExpenseType[];
  splits: String[];
  expenseChanged: Subscription;
  expensesChanged: Subscription;
  responseReceived: Subscription;
  expenseTypesChanged: Subscription;
  expenseForm: FormGroup;
  awaitingData: boolean;
  awaitingOnMessage: string;

  constructor(
    private expenseTypeService: ExpenseTypeService, 
    private expenseService: ExpensesService,
    private splitsService: SplitsService) { 
    }
    
    ngOnInit() {
      this.expenseChanged = this.expenseService.expenseChanged.subscribe(
      value => this.updateForm(value)
      );
      this.expensesChanged = this.expenseService.expensesChanged.subscribe(
        value => this.onNewExpense()
      );
      this.expenseTypeService.expenseTypesChanged.subscribe(
        () => this.expenseTypes = this.expenseTypeService.getExpenseTypes()
      );
      this.responseReceived = this.expenseService.addExpenseReturned.subscribe(value => {
      this.expenseForm = this.createForm();
      this.awaitingData = false;
      this.awaitingOnMessage = "";
      });
      this.splits = this.splitsService.splits;
      this.expenseForm = this.createForm(null);
      this.awaitingData = false;
  }

  ngOnDestroy() {
    this.expenseChanged.unsubscribe();
  }

  onExpenseSubmit(){
    let expense = this.convertExpenseFormToExpense()
    // If it is a new expense, request to add a new else update existing
    if(expense.id < 1){
      this.expenseService.addExpense(expense);
      this.awaitingOnMessage = "Sparar utgift";
      this.awaitingData = true;
    } else {
      this.expenseService.updateExpense(expense);
      this.awaitingOnMessage = "Uppdaterar utgift";
      this.awaitingData = true;
    }
  }

  onNewExpense(){
    this.expenseForm = this.createForm();
  }

  onDeleteExpense(){
    // Send request to delete expense if the expenseform have a value. Else it is a new expense and does not exist in db. 
    if(this.expenseForm.value['id'] > 0){
      this.expenseService.deleteExpense(this.expenseForm.value['id']);
    }
    this.expenseForm = this.createForm();
  }

  updateForm(expense: Expense){
    this.expenseForm = this.createForm(expense);
  }

  createForm(expense: Expense = null){
    return new FormGroup({
      'id': new FormControl(expense ? expense.id : null),
      'expenseType': new FormControl(expense ? expense.expenseType.id : null, Validators.required),
      'amount': new FormControl(expense ? expense.amount : null, Validators.required),
      'split': new FormControl(expense ? expense.split : null, Validators.required),
      'date': new FormControl(expense ? expense.date : new Date(), Validators.required),
      'comment': new FormControl(expense ? expense.comment : null),
      'copyWithAmount': new FormControl(expense ? expense.copyWithAmount : false),
      'copyWithoutAmount': new FormControl(expense ? expense.copyWithoutAmount : false)
    })
  }

  convertExpenseFormToExpense(){
    let expense = new Expense(
      this.expenseTypeService.getExpenseTypeById(this.expenseForm.value['expenseType']),
      this.expenseForm.value['amount'],
      this.expenseForm.value['split'],
      this.expenseForm.value['comment'],
      this.expenseForm.value['date'],
      this.expenseForm.value['copyWithAmount'],
      this.expenseForm.value['copyWithoutAmount']
    );

    if(this.expenseForm.value['id'] > 0){
      expense.id = this.expenseForm.value['id'];
    }

    return expense;
  }
}
