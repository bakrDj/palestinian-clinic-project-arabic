import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_User = gql`
  mutation UpdateUser($data: UserInputType, $updateUserId: Int!, $personId: Int!, $personData: PersonInputType) {
    UpdateUser(data: $data, id: $updateUserId, personId: $personId, personData: $personData) {
      id
    }
  }
`;

interface VariableProps {
  updateUserId?: number;
  personId?: number;
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
