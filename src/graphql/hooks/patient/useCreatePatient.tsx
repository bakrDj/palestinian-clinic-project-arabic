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
  mutation CreateSick($content: contentSick) {
    createSick(content: $content) {
      id
      age
      lastUpdate
      person {
        id
        first_name
        last_name
        email
        phone
        address
        ID_number
        createdAt
        updatedAt
      }
    }
  }
`;

interface VariableProps {
  content: {
    age?: string;
    person?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      address?: string;
      ID_number?: string;
    };
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
