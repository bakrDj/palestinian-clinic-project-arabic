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

export const Create_NurseOrder = gql`
  mutation CreateNurseOrder($content: contentNurseOrder) {
    createNurseOrder(content: $content) {
      nurse_order
      completed
      createdAt
      updatedAt
      id
    }
  }
`;

interface VariableProps {
  content?: {
    nurse_order?: string;
    completed?: boolean;
    id_sick?: string;
  };
}

const useCreateNurseDuty = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Create_NurseOrder, {
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

export default useCreateNurseDuty;
