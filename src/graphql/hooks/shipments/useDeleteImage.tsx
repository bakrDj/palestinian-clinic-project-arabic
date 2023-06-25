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

export const DELETE_IMAGE = gql`
  mutation DeleteImage($deleteImageId: ID!) {
    deleteImage(id: $deleteImageId) {
      status
    }
  }
`;

interface VariableProps {
  deleteImageId?: string;
}

const useDeleteImage = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(DELETE_IMAGE, {
    // update: (cache, { data: { createBox } }) => {
    //   cache.modify({
    //     fields: {
    //       boxClient(existedBoxes = [], { readField }) {
    //         return [...existedBoxes, createBox];
    //       },
    //     },
    //   });
    // },
  });
  return res;
};

export default useDeleteImage;
