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

export const Create_User = gql`
  mutation CreateUser($content: contentUser) {
    createUser(content: $content) {
      token
      user {
        id
        user_name
        role
        activation
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
  }
`;

interface VariableProps {
  content: {
    user_name?: string;
    password?: string;
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
const useCreateUser = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_User, {
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

export default useCreateUser;
