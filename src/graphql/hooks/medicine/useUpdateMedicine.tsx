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

export const Update_Medicine = gql`
  mutation UpdateMedicine($content: contentMedicine!, $updateMedicineId: ID!) {
    updateMedicine(content: $content, id: $updateMedicineId) {
      status
    }
  }
`;

interface VariableProps {
  updateMedicineId?: string;
  content?: {
    name?: string;
    quantity?: number;
    times_per_day?: number;
    duration?: number;
    note?: string;
    giving?: string;
  };
}

const useUpdatePrescription = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
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
