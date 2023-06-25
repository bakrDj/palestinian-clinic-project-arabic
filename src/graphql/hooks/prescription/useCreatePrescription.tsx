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

export const Create_Prescription = gql`
  mutation CreatePrescription($content: contentPrescription) {
    createPrescription(content: $content) {
      id
      createdAt
      updatedAt
      medicines {
        id
        name
        quantity
        times_per_day
        duration
        note
      }
    }
  }
`;

interface VariableProps {
  content?: {
    id_sick?: string;
    title?: string;
  };
}

const useCreatePrescription = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
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
