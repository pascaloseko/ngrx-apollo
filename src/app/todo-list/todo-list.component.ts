import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from './../../redux/app.reducer';
import { Todo } from './../../redux/todo/todo.model';
import * as FilterActions from './../../redux/filter/filter.actions';
import * as TodoActions from './../../redux/todo/todo.actions';
import { getVisibleTodos, getStateCompleted } from './../../redux/todo/todo.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [];
  checkField: FormControl;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    this.checkField = new FormControl();
    this.readParams();
    this.readStateCompleted();
    this.readTodosState();
  }

  ngOnInit(): void {
  }

  toggleAll(): void {
    this.store.dispatch(new TodoActions.CompletedAllAction());
  }

  private setFilter(filter: string): void {
    switch (filter) {
      case 'active': {
        this.store.dispatch(new FilterActions.SetFilterAction('SHOW_ACTIVE'));
        break;
      }
      case 'completed': {
        this.store.dispatch(new FilterActions.SetFilterAction('SHOW_COMPLETED'));
        break;
      }
      default: {
        this.store.dispatch(new FilterActions.SetFilterAction('SHOW_ALL'));
        break;
      }
    }
  }

  private readTodosState(): void {
    this.store.select(getVisibleTodos)
      .subscribe(todos => {
        this.todos = todos;
      });
  }

  private readStateCompleted(): void {
    this.store.select(getStateCompleted)
      .subscribe(status => {
        this.checkField.setValue(status);
      });
  }

  private readParams(): void {
    this.route.params
      .subscribe(params => {
        this.setFilter(params.filter);
      });
  }

}
