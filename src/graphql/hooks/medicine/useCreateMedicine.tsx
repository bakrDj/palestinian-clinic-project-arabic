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

export const Create_Medicine = gql`
  mutation CreateMedicine($idPrescription: ID!, $content: contentMedicine!) {
    createMedicine(id_prescription: $idPrescription, content: $content) {
      id
      name
      quantity
      times_per_day
      duration
      note
      giving
    }
  }
`;

interface VariableProps {
  idPrescription?: string;
  content?: {
    name?: string;
    quantity?: number;
    times_per_day?: number;
    duration?: number;
    note?: string;
    giving?: string;
  };
}

const useCreateMedicine = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
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
