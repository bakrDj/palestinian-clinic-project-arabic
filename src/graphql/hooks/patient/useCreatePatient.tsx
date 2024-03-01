import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Box } from "react-feather";

export const Create_Sick = gql`
  mutation CreatePatient($data: PatientInputType) {
    CreatePatient(data: $data) {
      id
      createdAt
      updatedAt
      personsId
      Person {
        id
        first_name
        last_name
        age
        gender
        address
        phone
        identification_number
        createdAt
        updatedAt
      }
    }
  }
`;

interface VariableProps {
  data: {
    personsId?: string;
  };
}

const useCreatePatient = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Create_Sick, {
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
