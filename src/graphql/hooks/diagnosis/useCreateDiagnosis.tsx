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

export const Create_Diagnosis = gql`
  mutation CreateDiagnosis($content: contentDiagnosis) {
    createDiagnosis(content: $content) {
      id
      complaint
      physical_examination
      diagnosis
      recommendations
      medical_history
      createdAt
      updatedAt
    }
  }
`;

interface VariableProps {
  content?: {
    complaint?: string;
    physical_examination?: string;
    diagnosis?: string;
    recommendations?: string;
    id_sick?: string;
    medical_history?: string;
  };
}

const useCreateDiagnosis = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
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
