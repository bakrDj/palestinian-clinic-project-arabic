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

export const Delete_User = gql`
  mutation DeleteUser($idPerson: ID!) {
    deleteUser(id_person: $idPerson) {
      status
    }
  }
`;

interface VariableProps {
  idPerson?: string;
}

const useDeleteUser = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Delete_User, {
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

export default useDeleteUser;
