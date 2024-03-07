import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_Diagnosis = gql`
  mutation UpdateDiagnosis($updateDiagnosisId: Int!, $data: DiagnosisInputType) {
    UpdateDiagnosis(id: $updateDiagnosisId, data: $data) {
      id
    }
  }
`;

interface VariableProps {
  updateDiagnosisId: string;
  data?: {
    complaint?: string;
    diagnosis?: string;
    medical_history?: string;
    physical_examination?: string;
    recommendations?: string;
    patientsId?: number;
  };
}

const useUpdateDiagnosis = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_Diagnosis, {
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
