import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { TaskService } from '../services/task.service';
import { Tasks } from '../Tasks';
declare let jquery: any;
declare let $: any;

@Component({
  selector: 'app-task-list',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  allTasks: Tasks[];
  statusCode: number;
  requestProcessing = false;
  tasksIdToUpdate = null;
  processValidation = false;

  //form for tasks
  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required),
  });

  taskFormNew = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    due: new FormControl('', Validators.required),
    done: new FormControl('', Validators.required)
  });

  
  constructor(private taskService: TaskService) {
  }

  
  ngOnInit(): void {
    this.getAllTasks();
  }

  //get all tasks
  getAllTasks() {
    this.taskService.getAllTasks()
      .subscribe(
        data => this.allTasks = data,
        errorCode => this.statusCode = errorCode);
  }
  //create and update a task 
  onTaskFormSubmit() {
    this.processValidation = true;
    if (this.taskForm.invalid) {
      return; 
    }

    //form validation
    this.preProcessConfigurations();
    let task = this.taskForm.value;
    if (this.tasksIdToUpdate === null) {

      //creating task id
      this.taskService.getAllTasks()
        .subscribe(tasks => {

          
          let maxIndex = tasks.length - 1;
          if (maxIndex <= 0) {
            let taskId = 1;
            task.id = taskId;
          }
          else {
            let taskWithMaxIndex = tasks[maxIndex];
            let taskId = taskWithMaxIndex.id + 1;
            task.id = taskId;
          }

          task.done = false;
          //Create task
          this.taskService.createTasks(task)
            .subscribe(successCode => {
              this.statusCode = successCode;
              this.getAllTasks();
              this.backToCreateTask();
            },
              errorCode => this.statusCode = errorCode
            );
        });
    } else {
      //update task
      task.id = this.tasksIdToUpdate;
      task.done = false;
      this.taskService.updateTasks(task)
        .subscribe(successCode => {
          this.statusCode = successCode;
          this.getAllTasks();
          this.backToCreateTask();
        },
          errorCode => this.statusCode = errorCode);
    }

    
  }

  //Load task by id to edit
  loadTaskToEdit(taskId: string) {
    this.preProcessConfigurations();
    this.taskService.getById(taskId)
      .subscribe(task => {
        this.tasksIdToUpdate = task.id;
        this.taskForm.setValue({ title: task.title, description: task.description, due: task.due});
        this.processValidation = true;
        this.requestProcessing = false;
        $("#desc").hide();
        $("#addTaskDiv").show();

 
      },
        errorCode => this.statusCode = errorCode);
  }

  //mark task as done
  taskMarkComplete(taskId: string) {
    this.taskService.getById(taskId)
      .subscribe(tasks => {
        if (!tasks.done) {
          tasks.done = true;
          this.taskService.updateData(tasks)
            .subscribe(successCode => {
              this.statusCode = successCode;
            },
            errorCode => this.statusCode = errorCode);
          $("#desc").hide();
          alert("Marked Complete");
        }
       
      });
  
  }

  //load the task to view
  loadTaskToView(taskId: string) {
    this.preProcessConfigurations();
    this.taskService.getById(taskId)
      .subscribe(task => {
        this.taskFormNew.setValue({ title: task.title, description: task.description, due: task.due, done: task.done });
        $(document).ready(function () {
          $("#desc").toggle();
          $(".addButton").show();
          $("#addTaskDiv").hide();
        });

      });
  }


  //Delete task
  deleteTask(taskId: string) {
    this.preProcessConfigurations();
    this.taskService.deleteTasksById(taskId)
      .subscribe(successCode => {
        this.statusCode = 204;
        this.getAllTasks();
        this.backToCreateTask();
      },
      errorCode => this.statusCode = errorCode);
    $("#desc").hide();
  }


  preProcessConfigurations() {
    this.statusCode = null;
    this.requestProcessing = true;
  }

  backToCreateTask() {
    this.tasksIdToUpdate = null;
    this.taskForm.reset();
    this.processValidation = false;
  }

  taskAddUpdate() {
    this.tasksIdToUpdate = null;
    this.taskForm.setValue({ title: null, description: null, due: null});
    $("#addTaskDiv").toggle();
  }
}

