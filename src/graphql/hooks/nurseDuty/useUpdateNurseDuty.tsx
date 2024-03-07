import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_NurseTask = gql`
  mutation UpdateNurseTask($updateNurseTaskId: Int!, $data: NurseTaskInputType) {
    UpdateNurseTask(id: $updateNurseTaskId, data: $data) {
      id
    }
  }
`;

interface VariableProps {
  updateNurseTaskId?: string;
  data?: {
    checked?: boolean;
    patientsId?: number;
    note?: string;
  };
}

const useUpdateNurseDuty = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_NurseTask, {
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
