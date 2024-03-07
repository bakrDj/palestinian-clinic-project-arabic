import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Delete_Prescription = gql`
  mutation DeletePrescription($deletePrescriptionId: Int!) {
    DeletePrescription(id: $deletePrescriptionId) {
      id
    }
  }
`;

interface VariableProps {
  deletePrescriptionId?: string;
}

const useDeletePrescription = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Delete_Prescription, {
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

export default useDeletePrescription;
