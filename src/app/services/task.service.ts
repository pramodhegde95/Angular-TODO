import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { Tasks } from '../Tasks';


/**
 * An interface that defines basic CRUD operations to minultate task objects.
 * You should implement this interface in a new service whose sole responsibily is
 * to interact with the mocked "backend". You can interface with the json db using angular's http library.
 *
 * The json db is hosted on port 3000. You can manually make requests to the "database" by 
 * navigating to the routes specified in the readme in your local browser
 *
 * e.g. `http://localhost:3000/tasks` to retreive all tasks.
 *
 * To learn more: https://angular.io/tutorial/toh-pt6   https://github.com/typicode/json-server
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  Url = "http://localhost:3000/tasks";
  constructor(public http:Http) {

    console.log("service");
  }

  /**
     * Retreives all tasks from the list
     */
  getAllTasks(): Observable<Tasks[]> {
    return this.http.get(this.Url)
      .pipe(map(res => res.json()))
      .pipe(catchError((error: any) => {
        return Observable.throw(error);
      }));

  }

   /**
     * Creates a new task
     * @param task The task object to create & add to list
     */
  createTasks(task: Tasks): Observable<number> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.post(this.Url, task, options)
      .pipe(map(success => success.status))
      .pipe(catchError((error: any) => {
        return Observable.throw(error);
      }));
  }


   /**
     * Retreives a task from the list
     * @param id Id of the task to retreive
     */
  getById(taskId: string): Observable<Tasks> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.get(this.Url + "/" + taskId)
      .pipe(map(res => res.json()))
      .pipe(catchError((error: any) => {
        return Observable.throw(error);
      }));

  }

   /**
     * Updates a task
     * @param id Id of the task you want to update
     * @param task the updated task (all fields must be present)
     */
  updateTasks(task: Tasks): Observable<number> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.put(this.Url + "/" + task.id, task, options)
      .pipe(map(success => success.status))
      .pipe(catchError((error: any) => {
        return Observable.throw(error);
      }));
  }

  /**
     * Removes a task
     * @param id Id of the task you want to remove
     */
  deleteTasksById(taskId: string): Observable<number> {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.delete(this.Url + "/" + taskId)
      .pipe(map(success => success.status))
      .pipe(catchError((error: any) => {
        return Observable.throw(error);
      }));
  }


  updateData(task: Tasks): Observable<number>  {
    let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    console.log(task.done);
    let options = new RequestOptions({ headers: cpHeaders });
    return this.http.put(this.Url + "/" + task.id , task, options)
      .pipe(map(success => success.status))
      .pipe(catchError((error: any) => {
        return Observable.throw(error);
      }));
    
  }


}
