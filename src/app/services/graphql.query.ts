import { gql } from "apollo-angular";
import { StudentDetails } from "../models/student.model";

export const GetAllStudents = gql `
    query {
        getAllStudents {
            id
            name
            email
            dateOfBirth
        }
    }
`;

export const AddStudent = (student: StudentDetails) => {
    return gql `
        mutation {
            createStudents(createStudents: [{
                name: "${student[0].name}"
                dateOfBirth: "${student[0].dateOfBirth}"
                email: "${student[0].email}"
            }])
        }
    `;
};

export const UpdateStudent = (student: StudentDetails) => {
    return gql `
        mutation {
            updateStudent (updateStudent: {
                id: ${student.id}
                name: "${student.name}"
                dateOfBirth: "${student.dateOfBirth}"
                email: "${student.email}"
            }) {
                id
                name
                dateOfBirth
                email
            }
        }
    `;
};

export const RemoveStudent = (id: number) => {
    return gql `
        mutation {
            removeStudent(id: ${id}) {
                name
                dateOfBirth
                email
            }
        }
    `;
};