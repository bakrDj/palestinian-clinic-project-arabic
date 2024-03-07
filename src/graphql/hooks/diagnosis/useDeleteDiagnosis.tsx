import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Delete_Diagnosis = gql`
  mutation DeleteDiagnosis($deleteDiagnosisId: Int!) {
    DeleteDiagnosis(id: $deleteDiagnosisId) {
      id
    }
  }
`;

interface VariableProps {
  deleteDiagnosisId?: string;
}

const useDeleteDiagnosis = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Delete_Diagnosis, {
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

export default useDeleteDiagnosis;
