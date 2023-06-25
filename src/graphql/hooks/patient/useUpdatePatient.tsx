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

export const Update_Sick = gql`
  mutation UpdateSick($content: contentSick!, $idPerson: ID!) {
    updateSick(content: $content, id_person: $idPerson) {
      status
    }
  }
`;

interface VariableProps {
  idPerson?: string;

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

const useUpdatePatient = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Update_Sick, {
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
