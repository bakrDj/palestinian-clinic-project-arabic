import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_Diagnosis = gql`
  mutation CreateDiagnosis($data: DiagnosisInputType) {
    CreateDiagnosis(data: $data) {
      complaint
      createdAt
      diagnosis
      id
      medical_history
      patientsId
      physical_examination
      recommendations
      updatedAt
    }
  }
`;

interface VariableProps {
  data?: {
    complaint?: string;
    diagnosis?: string;
    medical_history?: string;
    physical_examination?: string;
    recommendations?: string;
    patientsId?: number;
  };
}

const useCreateDiagnosis = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_Diagnosis, {
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

export default useCreateDiagnosis;
