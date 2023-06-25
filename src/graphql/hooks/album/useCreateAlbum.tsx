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

export const Create_Album = gql`
  mutation CreateAlbum($content: contentAlbum) {
    createAlbum(content: $content) {
      title
      description
      id
      createdAt
      updatedAt
      pictures {
        id
        name
      }
    }
  }
`;

interface VariableProps {
  content?: {
    title?: string;
    description?: string;
    id_sick?: string;
    pictures?: any;
  };
}

const useCreateAlbum = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Create_Album, {
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

export default useCreateAlbum;
