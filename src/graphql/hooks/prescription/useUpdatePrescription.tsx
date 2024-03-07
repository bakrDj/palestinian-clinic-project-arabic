import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_Prescription = gql`
  mutation UpdatePrescription($updatePrescriptionId: Int!, $data: PrescriptionInputType) {
    UpdatePrescription(id: $updatePrescriptionId, data: $data) {
      id
    }
  }
`;

interface VariableProps {
  updatePrescriptionId?: number;
  data?: {
    patientsId?: number;
    title?: string;
  };
}

const useUpdatePrescription = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
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

export default useUpdatePrescription;
