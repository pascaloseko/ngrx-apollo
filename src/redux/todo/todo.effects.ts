import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as TodosActions from './todo.actions';

const SERVER_GRAPHQL = 'https://fathomless-ridge-84301.herokuapp.com/query';

@Injectable()
export class TodoEffects {

  @Effect() loadTodos$: Observable<Action> = this.actions$.pipe(
    ofType(TodosActions.LOAD_TODOS),
    switchMap((action: TodosActions.LoadTodosAction) => {
      const query = `{
        todos {
          id
          text
          completed
        }
      }`;
      return this.http.post(SERVER_GRAPHQL, { query })
        .pipe(
          map((response: any) => {
            return new TodosActions.PopulateTodosAction(response.data.todos);
          }),
          catchError(() => of({ type: 'LOGIN_FAILED' }))
        );
    })
  );

  @Effect() addTodo$: Observable<Action> = this.actions$.pipe(
    ofType(TodosActions.ADD_TODO),
    switchMap((action: TodosActions.AddTodoAction) => {
      const query = `mutation createTodo($input: TodoInput!) {
        todo: createTodo(input: $input) {
          id
          text
          completed
        }
      }`;
      const input = {
        text: action.text,
      };
      return this.http.post(SERVER_GRAPHQL, {
        query,
        variables: { input }
      })
        .pipe(
          map((response: any) => {
            return new TodosActions.AddTodoSuccessAction(response.data.todo);
          }),
          catchError(() => of({ type: 'LOGIN_FAILED' }))
        );
    })
  );

  @Effect() updateTodo$: Observable<Action> = this.actions$.pipe(
    ofType(TodosActions.UPDATE_TODO),
    switchMap((action: TodosActions.UpdateAction) => {
      const query = `mutation updateTodo($todoID: Int!, $input: TodoInput!) {
        todo: updateTodo(todoID: $todoID, input: $input) {
          id
          text
          completed
        }
      }`;
      const input = {
          text: action.todo.text,
          completed: action.todo.completed
      };
      return this.http.post(SERVER_GRAPHQL, {
        query,
        variables: {
          todoID: action.todo.id,
          input
        }
      })
        .pipe(
          map((response: any) => {
            const todo = response.data.todo;
            return new TodosActions.UpdateActionSuccess(todo);
          }),
          catchError(() => of({ type: 'LOGIN_FAILED' }))
        );
    })
  );

  @Effect() deleteTodo$: Observable<Action> = this.actions$.pipe(
    ofType(TodosActions.DELETE_TODO),
    switchMap((action: TodosActions.DeleteTodoAction) => {
      const query = `mutation($id: Int!) {
        id: deleteTodo(todoID: $id)
      }`;
      return this.http.post(SERVER_GRAPHQL, {
        query,
        variables: {
          id: action.id,
        }
      })
        .pipe(
          map((response: any) => {
            const id = response.data.id;
            const newAction = new TodosActions.DeleteTodoSuccessAction(id);
            return newAction;
          }),
          catchError(() => of({ type: 'LOGIN_FAILED' }))
        );
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions
  ) { }
}