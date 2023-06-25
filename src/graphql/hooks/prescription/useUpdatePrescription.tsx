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
  mutation UpdatePrescription($updatePrescriptionId: ID!, $content: contentPrescription!) {
    updatePrescription(id: $updatePrescriptionId, content: $content) {
      status
    }
  }
`;

interface VariableProps {
  updatePrescriptionId?: string;
  content?: {
    id_sick?: string;
    medicines?: [
      {
        name?: string;
        quantity?: string;
        times_per_day?: string;
        duration?: string;
        note?: string;
      }
    ];
  };
}

const useUpdatePrescription = (): MutationTuple<
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

export default useUpdatePrescription;
