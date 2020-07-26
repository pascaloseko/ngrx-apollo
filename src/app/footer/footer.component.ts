import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './../../redux/app.reducer';
import * as FilterActions from './../../redux/filter/filter.actions';
import * as TodoActions from './../../redux/todo/todo.actions';
import { getStateCompleted } from './../../redux/todo/todo.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  countTodos: number;
  currentFilter: string;
  showFooter: boolean;

  constructor(
    private store: Store<AppState>
  ) {
    this.readFilterState();
    this.readTodosState();
  }

  ngOnInit(): void {
  }

  clearCompleted(): void {
    const action = new TodoActions.ClearCompletedAction();
    this.store.dispatch(action);
  }

  completedAll(): void {
    const action = new TodoActions.CompletedAllAction();
    this.store.dispatch(action);
  }

  private readTodosState(): void {
    this.store.select('todos')
      .subscribe(todos => {
        this.countTodos = todos.filter(t => !t.completed).length;
        this.showFooter = todos.length > 0;
      });
  }

  private readFilterState(): void {
    this.store.select('filter')
      .subscribe(filter => {
        this.currentFilter = filter;
      });
  }

}
