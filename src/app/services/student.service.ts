import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentDetails } from '../models/student.model';
import { AddStudent, GetAllStudents, RemoveStudent, UpdateStudent } from './graphql.query';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private apollo: Apollo) {};

  getAllStudents() : Observable<StudentDetails[]> {
    return this.apollo
    .query({
      query: GetAllStudents,
      fetchPolicy: 'no-cache'
    })
    .pipe(
      map((result: any) => result?.data?.getAllStudents),
      map((result: any) => {
        return result?.map((data: any) => ({
          id: data.id,
          name: data.name,
          dateOfBirth: data.dateOfBirth,
          email: data.email
        } as StudentDetails));
      })
    )
  }

  updateStudent(studentDetails: StudentDetails) : Observable<StudentDetails> {
    return this.apollo
    .mutate({
      mutation: UpdateStudent(studentDetails)
    })
    .pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  removeStudent(id: number) {
    return this.apollo
    .mutate({
      mutation: RemoveStudent(id)
    })
    .pipe(
      map((result: any) => {
        return result;
      })
    )
  }

  createStudents(studentDetails: StudentDetails) : Observable<StudentDetails[]> {
    return this.apollo
    .mutate({
      mutation: AddStudent(studentDetails)
    })
    .pipe(
      map((result: any) => {
        return result;
      })
    )
  }

}
