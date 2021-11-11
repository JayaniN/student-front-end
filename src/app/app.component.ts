import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { State, process } from '@progress/kendo-data-query';
import { EditService } from './edit.service';
//import { Product } from "./models/student.model";
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public formGroup: FormGroup;
  private editService: EditService;
  private editedRowIndex: number;

  constructor(@Inject(EditService) editServiceFactory: any) {
    this.editService = editServiceFactory();
  }

  public ngOnInit(): void {}
}
