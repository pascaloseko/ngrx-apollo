import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Todo } from '../../redux/todo/todo.model';
import { Store } from '@ngrx/store';

import { AppState } from './../../redux/app.reducer';
import { FormControl, Validators } from '@angular/forms';
import * as TodoActions from './../../redux/todo/todo.actions';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  @Input() todo: Todo;
  @ViewChild('textInput') textInput: ElementRef;
  textField: FormControl;
  checkField: FormControl;
  editing: boolean;

  constructor(private store: Store<AppState>) {
    this.textField = new FormControl('', [Validators.required]);
    this.checkField = new FormControl(false);
    this.checkField.valueChanges
    .subscribe(state => {
      const action = new TodoActions.ToggleAction(this.todo.id);
      this.store.dispatch(action);
    });
   }

  ngOnInit(): void {
    this.textField.setValue(this.todo.text);
    this.checkField.setValue(this.todo.completed, {emitEvent: false});
  }

  updateText(): void {
    if (this.textField.valid && this.editing) {
      const newText: string = this.textField.value;
      const action = new TodoActions.UpdateAction({
        ...this.todo,
        text: newText
      });
      this.store.dispatch(action);
      this.editing = false;
    }
  }

  activeEditMode(): void {
    this.editing = true;
    setTimeout(() => {
      this.textInput.nativeElement.focus();
    });
  }

  deleteTodo(): void {
    const id = this.todo.id;
    const action = new TodoActions.DeleteTodoAction(id);
    this.store.dispatch(action);
  }

}
