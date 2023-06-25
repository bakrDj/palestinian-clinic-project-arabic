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

export const Active_User = gql`
  mutation ActiveUser($idPerson: ID!, $activation: Activation) {
    activeUser(id_person: $idPerson, activation: $activation) {
      status
    }
  }
`;

interface VariableProps {
  idPerson?: string;
  activation?: string;
}

const useActivateUser = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Active_User, {
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

export default useActivateUser;
