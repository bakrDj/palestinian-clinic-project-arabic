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

export const Update_Format = gql`
  mutation UpdateFormat($content: contentFormat!, $updateFormatId: ID!) {
    updateFormat(content: $content, id: $updateFormatId) {
      status
    }
  }
`;

interface VariableProps {
  updateFormatId: string;
  content?: {
    message?: string;
    type?: string;
  };
}

const useUpdateTemplate = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Update_Format, {
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

export default useUpdateTemplate;
