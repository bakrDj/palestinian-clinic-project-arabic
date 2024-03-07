import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_Patient = gql`
  mutation CreatePatient($personData: PersonInputType) {
    CreatePatient(personData: $personData) {
      id
      Person {
        id
        gender
        first_name
        createdAt
        age
        address
        identification_number
        last_name
        phone
        updatedAt
      }
      personsId
      createdAt
      updatedAt
    }
  }
`;

interface VariableProps {
  personData: {
    address: string;
    age: string;
    first_name: string;
    gender: string;
    identification_number: string;
    last_name: string;
    phone: string;
  };
}

const useCreatePatient = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_Patient, {
    //   update: (cache, { data: { createBox } }) => {
    //     cache.modify({
    //       fields: {
    //         boxClient(existedBoxes = [], { readField }) {
    //           return [...existedBoxes, createBox];
    //         },
    //       },
    //     });
    //   },
  });
  return res;
};

export default useCreatePatient;
