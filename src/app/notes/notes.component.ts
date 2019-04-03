import { Component, OnInit } from '@angular/core';
import { Notebook } from './model/notebook';
import { ApiService } from '../shared/api.service';
import { Note } from './model/note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notebooks: Notebook[] = [];
  notes: Note[] = [];
  selectedNotebook: Notebook;
  searchText: string;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getAllNotebooks();
    this.getAllNotes();
    
  }

  public getAllNotebooks(){
    
    this.apiService.getAllNotebooks().subscribe(
      res => {
        this.notebooks = res;
      },
      err => {
        alert("An error has occured while");
      }
    );
  }

  createNotebook(){
    let newNotebook:Notebook = {
      id:null,
      name:"New Notebook",
      nbOfNotes:0
    }
    this.apiService.postNotebook(newNotebook).subscribe(
      res => {
        newNotebook.id = res.id;
        this.notebooks.push(newNotebook);
      },
      err=>{
        alert("An error has occured while saving notebook");
      }
    );
  }

  updateNotebook(updatedNotebook: Notebook){
    this.apiService.postNotebook(updatedNotebook).subscribe(
      res => {},
      err => {
        alert("an error has occured while updating notebook");
      }
    );
  }

  deleteNotebook(notebook: Notebook){
    if (confirm("Cofnirm Delete?")){
      this.apiService.deleteNotebook(notebook.id).subscribe(
        res => {
          let indexOfNotebook = this.notebooks.indexOf(notebook);
          this.notebooks.splice(indexOfNotebook, 1);
        },
        err => {
          alert("An error has occured while deleting notebook");
        }
      );
    }
  }

  selectNotebook(notebook: Notebook){
    this.selectedNotebook = notebook;
    this.apiService.getNotesByNotebook(notebook.id).subscribe(
      res => {
        this.notes = res;
      },
      err => {
        alert("An error has occured while fetching notes");
      }
    );
  }

  selectAllNotes(){
    this.selectedNotebook = null;
    this.getAllNotes();
  }

  getAllNotes(){
    this.apiService.getAllNotes().subscribe(
      res => {
        this.notes = res;
      },
      err => {
        alert("An error occured while fetching all notes");
      }
    );
  }

  createNote(notebookId: string){
    let newNote: Note = {
      id: null,
      title: "New Note",
      text: "Write some text here",
      lastModifiedOn:null,
      notebookId:notebookId
    }

    this.apiService.postNote(newNote).subscribe(
      res => {
        newNote.id = res.id;
        this.notes.push(newNote);
      },
      err => {
        alert("Error occured while creating Note");
      }
    );
  }
  
  updateNote(updatedNote: Note){
    this.apiService.postNote(updatedNote).subscribe(
      res => {},
      err => {
        alert("An error has occured while updating note");
      }
    );
  }

  deleteNote(note: Note){
    this.apiService.deleteNote(note.id).subscribe(
      res => {
        if(confirm("Are you sure you want to delete the note?")){
          let indexOfNote = this.notes.indexOf(note);
          this.notes.splice(indexOfNote,1);
        }
      },
      err => {
        alert("An error occured while deleting note.");
      }
    );
  }

}
