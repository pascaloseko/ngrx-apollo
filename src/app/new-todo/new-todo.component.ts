import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { AppState } from './../../redux/app.reducer';
import * as TodoActions from './../../redux/todo/todo.actions';

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.scss']
})
export class NewTodoComponent implements OnInit {
  textField: FormControl;

  constructor(private store: Store<AppState>) {
    this.textField = new FormControl('', [Validators.required]);
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  saveTodo() {
    if(this.textField.valid) {
      const text: string = this.textField.value;
      const action = new TodoActions.AddTodoAction(text.trim());
      this.store.dispatch(action);
      this.textField.setValue('', { emitEvent: false});
    }
  }

}
