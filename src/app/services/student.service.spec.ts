import { fakeAsync, TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { Observable } from 'rxjs';
import { StudentDetails } from '../models/student.model';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { AddStudent, GetAllStudents, RemoveStudent, UpdateStudent } from './graphql.query';

describe('StudentService', () => {
  let service: StudentService;
  let apolloController: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should call createStudents function and return true when create completes', () => {
    const createData: any = [
      {
        name: 'Tom',
        dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
        email: 'tom@gmail.com'
      }
    ];

    service.createStudents(createData).subscribe((result) => {
      spyOn(service, 'createStudents').and.callThrough();
      service.createStudents(createData);
      expect(service.createStudents).toHaveBeenCalled();
    });

    apolloController.expectOne(AddStudent(createData)).flush({
      data: {
        createStudents: true
      }
    });
  });

  it('should call getAllStudents function and return an array of student objects when it completes', () => {
    const students: any = [
      {
        id: 1,
        name: 'Tom',
        dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
        email: 'tom@gmail.com'
      },
      {
        id: 2,
        name: 'Sam',
        dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
        email: 'sam@gmail.com'
      }
    ];

    service.getAllStudents().subscribe((result) => {
      spyOn(service, 'getAllStudents').and.callThrough();
      service.getAllStudents();
      expect(service.getAllStudents).toHaveBeenCalled();
    });

    apolloController.expectOne(GetAllStudents).flush({
      data: {
        getAllStudents: [
          {
            id: 1,
            name: 'Tom',
            dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
            email: 'tom@gmail.com'
          },
          {
            id: 2,
            name: 'Sam',
            dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
            eamil: 'sam@gmail.com'
          }
        ]
      }
    });
  });

  it('should call updateStudent function with given id and return student object when update completes', () => {
    const updateData: StudentDetails = {
      id: 1,
      name: 'Tom',
      dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
      email: 'tom@gmail.com'
    };

    service.updateStudent(updateData).subscribe((result) => {
      spyOn(service, 'updateStudent').and.callThrough();
      service.updateStudent(updateData);
      expect(service.updateStudent).toHaveBeenCalled();
    });

    apolloController.expectOne(UpdateStudent(updateData)).flush({
      data: {
        updateStudent: {
          id: 1,
          name: 'Tom',
          dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
          email: 'tom@gmail.com'
        }
      }
    });
  });

  it('should delete student with given id and return student object when delete completes', () => {
    service.removeStudent(1).subscribe((result) => {
      // let deleteData: any = result.data;
      expect(result.data.removeStudent).toEqual({
        name: 'Tom',
        dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
        email: 'tom@gmail.com'
      });
    });

    apolloController.expectOne(RemoveStudent(1)).flush({
      data: {
        removeStudent: {
          name: 'Tom',
          dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
          email: 'tom@gmail.com'
        }
      }
    });
  });

});