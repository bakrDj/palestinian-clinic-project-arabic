import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_Prescription = gql`
  mutation CreatePrescription($data: PrescriptionInputType) {
    CreatePrescription(data: $data) {
      id
      createdAt
      patientsId
      title
      updatedAt
    }
  }
`;

interface VariableProps {
  data?: {
    patientsId?: number;
    title?: string;
  };
}

const useCreatePrescription = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_Prescription, {
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

export default useCreatePrescription;
