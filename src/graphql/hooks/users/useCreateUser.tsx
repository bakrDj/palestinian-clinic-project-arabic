import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_User = gql`
  mutation CreateUser($data: UserInputType, $personData: PersonInputType) {
    CreateUser(data: $data, personData: $personData) {
      id
      email
      username
      role
      google_account_id
      personsId
      Person {
        id
        first_name
      }
      createdAt
      updatedAt
    }
  }
`;

interface VariableProps {
  data: {
    email?: string;
    // google_account_id?: string;
    role?: string;
    username?: string;
  };
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
