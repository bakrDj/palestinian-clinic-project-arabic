import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Delete_NurseTask = gql`
  mutation DeleteNurseTask($deleteNurseTaskId: Int!) {
    DeleteNurseTask(id: $deleteNurseTaskId) {
      id
    }
  }
`;

interface VariableProps {
  deleteNurseTaskId?: string;
}

const useDeleteNurseDuty = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Delete_NurseTask, {
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
