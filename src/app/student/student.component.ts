import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { EditService } from '../edit.service';
import { StudentDetails } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { DialogService, DialogRef, DialogCloseResult } from "@progress/kendo-angular-dialog";
import { FileUploadService } from '../services/fileUpload.service';
import { FileState } from "@progress/kendo-angular-upload";
import { FileUploadGatewayService } from '../services/fileUpload-gateway.service';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  providers: [StudentService, NotificationService]
})

export class StudentComponent implements OnInit {
  constructor(
    private studentService: StudentService,
    private dialogService: DialogService,
    private uploadService: FileUploadService,
    private socketService: FileUploadGatewayService,
    private notificationService: NotificationService
  ) {};

  public studentGridDataList: GridDataResult;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public formGroup: FormGroup;
  private editService: EditService;
  private editedRowIndex: number;
  public result;
  selectedFile: File;
  // selectedFile: FileList;

  public ngOnInit(): void {
    this.socketService.getEmmitMessage().subscribe(async (msg: any) => {
      const { status } = msg;
      
      if (status === 1) {
        this.fileUploadNotification(true);
        await this.getStudentDetails();
      } else {
        this.fileUploadNotification(false);
      }
    });

    this.getStudentDetails();
  }

  public async getStudentDetails() {
    await this.studentService
    .getAllStudents()
    .subscribe((studentDataAll: any) => {
      if(studentDataAll && studentDataAll.length > 0) {
        for(let data of studentDataAll) {
          let dob = moment(data.dateOfBirth).format('MM/DD/YYYY');
          let age = moment().diff(data.dateOfBirth, "years", false);
          data.dateOfBirth = dob;
          data.age = age;
        }
        this.studentGridDataList = process(studentDataAll, this.gridState);
      }
    });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.getStudentDetails();
  }

  public addHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      name: new FormControl(),
      dateOfBirth: new FormControl(
        new Date(),
        Validators.required
      ),
      email: new FormControl()
    });
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      id: new FormControl(dataItem.id),
      name: new FormControl(dataItem.name),
      dateOfBirth: new FormControl(
        new Date(dataItem.dateOfBirth),
        Validators.required
      ),
      email: new FormControl(dataItem.email)
    });

    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const StudentDetails: StudentDetails = formGroup.value;
    if(isNew) {
      this.createStudents([StudentDetails]);
    } else {
      this.updateStudent(StudentDetails);
    }
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }) {
    const studentId = dataItem.id;
    this.openConfirmationDialog(studentId);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  async createStudents(studentDetails) {
    this.studentService
    .createStudents(studentDetails)
    .subscribe(async (createStudents: any) => {
      if(createStudents.data && createStudents.data.createStudents) {
        this.showNotification(true);
      } else  {
        this.showNotification(false);
      }
      await this.getStudentDetails();
    });
  }

  async updateStudent(studentDetails) {
    this.studentService
    .updateStudent(studentDetails)
    .subscribe(async (updateStudent: any) => {
      if(updateStudent.data && updateStudent.data.updateStudent) {
        this.showNotification(true);
      } else {
        this.showNotification(false);
      }
      await this.getStudentDetails();
    });
  }

  async removeStudent(studentId) {
    this.studentService
    .removeStudent(studentId)
    .subscribe((removeStudent: any) => {
      if(removeStudent.data && removeStudent.data.removeStudent) {
        this.showNotification(true);
      } else {
        this.showNotification(false);
      }
      this.getStudentDetails();
    });
  }

  public upload(fileSelect, file) {
    this.selectedFile = file.rawFile;

    const fileData = new FormData();
    fileData.append('file', this.selectedFile);

    this.uploadService.uploadFile(fileData);
  }

  public remove(fileSelect, uid) {
    fileSelect.removeFileByUid(uid);
  }

  public showButton(state: FileState): boolean {    
    return state === FileState.Selected ? true : false;
  }

  openConfirmationDialog(studentId) {
    const dialog: DialogRef = this.dialogService.open({
      title: "Please Confirm",
      content: "Are you sure you want to remove this record permenantly ?",
      actions: [{ text: "Cancel" }, { text: "Confirm", primary: true}],
      width: 400,
      height: 200,
      minWidth: 250,
    });

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
      } else {
        if(result.text && result.text == 'Confirm') {
          this.removeStudent(studentId);
        }
      }
      this.result = JSON.stringify(result);
    });
  }

  fileUploadNotification(value) {
    if(value) {
      this.notificationService.show({
        content: "File Upload Successfully",
        hideAfter: 2000,
        position: { horizontal: "right", vertical: "top" },
        animation: { type: "fade", duration: 500 },
        type: { style: "success", icon: true }
      });
    } else {
      this.notificationService.show({
        content: "File Uplaod Failed",
        hideAfter: 2000,
        position: { horizontal: "right", vertical: "top" },
        animation: { type: "fade", duration: 500 },
        type: { style: "error", icon: true }
      });
    }
  }

  showNotification(value) {
    if(value) {
      this.notificationService.show({
        content: "Success",
        hideAfter: 2000,
        position: { horizontal: "right", vertical: "top"},
        animation: { type: "fade", duration: 500 },
        type: { style: "success", icon: true },
        width: 100
      });
    } else {
      this.notificationService.show({
        content: "Fail",
        hideAfter: 2000,
        position: { horizontal: "right", vertical: "top" },
        animation: { type: "fade", duration: 500 },
        type: { style: "error", icon: true },
        width: 100
      });
    }
  }

  refresh(): void {
    window.location.reload();
  }

}


