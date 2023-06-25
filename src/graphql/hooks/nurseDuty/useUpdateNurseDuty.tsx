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

export const Update_NurseOrder = gql`
  mutation UpdateNurseOrder($content: contentNurseOrder!, $updateNurseOrderId: ID!) {
    updateNurseOrder(content: $content, id: $updateNurseOrderId) {
      status
    }
  }
`;

interface VariableProps {
  updateNurseOrderId: string;
  content?: {
    nurse_order?: string;
    completed?: boolean;
    id_sick?: string;
  };
}

const useUpdateNurseDuty = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Update_NurseOrder, {
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

export default useUpdateNurseDuty;
