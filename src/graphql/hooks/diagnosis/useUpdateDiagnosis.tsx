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

export const Update_Prescription = gql`
  mutation UpdateDiagnosis($content: contentDiagnosis!, $updateDiagnosisId: ID!) {
    updateDiagnosis(content: $content, id: $updateDiagnosisId) {
      status
    }
  }
`;

interface VariableProps {
  updateDiagnosisId: string;
  content?: {
    complaint?: string;
    physical_examination?: string;
    diagnosis?: string;
    recommendations?: string;
    id_sick?: string;
    medical_history?: string;
  };
}

const useUpdateDiagnosis = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Update_Prescription, {
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
