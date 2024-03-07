import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_Medicine = gql`
  mutation UpdateMedicine($updateMedicineId: Int!, $data: MedicineInputType) {
    UpdateMedicine(id: $updateMedicineId, data: $data) {
      id
    }
  }
`;

interface VariableProps {
  updateMedicineId?: string;
  data?: {
    name?: string;
    quantity?: string;
    times_per_day?: string;
    duration?: string;
    note?: string;
    giving?: string;
    prescriptionId?: number;
  };
}

const useUpdatePrescription = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_Medicine, {
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
