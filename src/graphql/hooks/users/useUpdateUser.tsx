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

export const Update_User = gql`
  mutation UpdateUsers($idPerson: ID!, $content: contentUpdateUser) {
    updateUsers(id_person: $idPerson, content: $content) {
      status
    }
  }
`;

interface VariableProps {
  idPerson?: string;
  content: {
    user_name?: string;
    newPassword?: string;
    role?: string;
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
const useUpdateUser = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_User, {
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

export default useUpdateUser;
