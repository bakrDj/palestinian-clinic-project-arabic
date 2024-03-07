import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_Medicine = gql`
  mutation CreateMedicine($data: MedicineInputType) {
    CreateMedicine(data: $data) {
      id
      note
      name
      giving
      quantity
      times_per_day
      duration
      createdAt
      updatedAt
      prescriptionId
    }
  }
`;

interface VariableProps {
  data?: {
    duration?: any;
    giving?: any;
    name?: any;
    note?: any;
    quantity?: any;
    times_per_day?: any;
    prescriptionId: number;
  };
}

const useCreateMedicine = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_Medicine, {
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

export default useCreateMedicine;
