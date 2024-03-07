import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_Album = gql`
  mutation UpdateRadiology($updateRadiologyId: Int!, $data: RadiologyInputType) {
    UpdateRadiology(id: $updateRadiologyId, data: $data) {
      id
    }
  }
`;

interface VariableProps {
  updateRadiologyId: string;
  data?: {
    title?: string;
    images?: string[];
    description?: string;
    patientsId?: number;
  };
}

const useUpdateDiagnosis = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_Album, {
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

export default useUpdateDiagnosis;
