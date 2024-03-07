import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_Patient = gql`
  mutation UpdatePatient($personData: PersonInputType, $personId: Int!, $updatePatientId: Int!) {
    UpdatePatient(personData: $personData, personId: $personId, id: $updatePatientId) {
      id
      createdAt
      personsId
    }
  }
`;

interface VariableProps {
  personId: number;
  updatePatientId: number;
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

const useUpdatePatient = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_Patient, {
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

export default useUpdatePatient;
