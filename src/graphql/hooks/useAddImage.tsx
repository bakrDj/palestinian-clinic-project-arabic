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

export const Add_Images = gql`
  mutation AddImages($idAlbum: ID!, $pictures: [Upload!]) {
    addImages(id_album: $idAlbum, pictures: $pictures) {
      id
      name
    }
  }
`;

interface VariableProps {
  idAlbum?: string;
  pictures?: any;
}

const useAddImage = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Add_Images, {
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

export default useAddImage;
