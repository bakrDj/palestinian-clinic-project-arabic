import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_NurseTask = gql`
  mutation CreateNurseTask($data: NurseTaskInputType) {
    CreateNurseTask(data: $data) {
      id
      createdAt
      checked
      note
      patientsId
      updatedAt
    }
  }
`;

interface VariableProps {
  data?: {
    checked?: boolean;
    patientsId?: number;
    note?: string;
  };
}

const useCreateNurseDuty = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_NurseTask, {
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
