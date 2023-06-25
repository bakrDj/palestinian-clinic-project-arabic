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

export const Delete_NurseOrder = gql`
  mutation DeleteNurseOrder($deleteNurseOrderId: ID!) {
    deleteNurseOrder(id: $deleteNurseOrderId) {
      status
    }
  }
`;

interface VariableProps {
  deleteNurseOrderId?: string;
}

const useDeleteNurseDuty = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Delete_NurseOrder, {
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

export default useDeleteNurseDuty;
