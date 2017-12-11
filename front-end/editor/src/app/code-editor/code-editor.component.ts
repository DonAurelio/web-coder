import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { File } from '../models/file';
import { FileService } from '../services/file.service';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit, OnDestroy {

  /* To get the project id from the current url */
  params: any;

  /* To keep the project id */
  project_id: any;

  /* The current project data */
  project: Project;

  /* The file belonging to the project */
  files: Observable<File[]>;

  /* The selected file */
  selectedFile: File;

  /* Code editor right hand editor text */
  preview_text: string;

  /* Console text area text */
  textarea_log_text: string;

  constructor(private activatedRoute: ActivatedRoute, 
    private fileService: FileService, private projectService: ProjectService ) {
      this.project = new Project(undefined,'no name','no description','no type');
      this.selectedFile = new File(undefined,'somefile','somefiletype','example text');
      this.preview_text = "some preview text";
      this.textarea_log_text = "Welcome to web coder !!\n";
  }

  ngOnInit() {
    /* Getting the project id from the url */
    this.params = this.activatedRoute.params.subscribe(
      params => this.project_id = params['id']
    );
    this.loadProject();
    this.loadFiles();
  }

  ngOnDestroy(){
    this.params.unsubscribe();
  }

  loadProject(): void {
    this.projectService.getProjectById(this.project_id).subscribe(
      response => this.project = response,
      error => console.log("The project can not be loaded !!"),
      () => console.log("The project was loadded successfully !!")
    );
  }

  loadFiles(): void {
    this.files = this.fileService.getFilesFromProject(this.project_id);
  }

  setSelectedFile(file: File): void {
    this.selectedFile = file;
  }

  /* Send changes from the current selected file to the API */
  onSaveFile(): void {
    this.fileService.updateFile(this.selectedFile).subscribe(
      success => this.appendLogText("The file was saved successfully !!"),
      error => this.appendLogText("Some error has ocurred !!"),
    );
  }

  appendLogText(text:string): void {
    this.textarea_log_text += text + '\n';
  }

}
