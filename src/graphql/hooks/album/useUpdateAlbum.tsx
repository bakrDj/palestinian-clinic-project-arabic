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

export const Update_Album = gql`
  mutation UpdateAlbum($content: contentAlbum!, $updateAlbumId: ID!) {
    updateAlbum(content: $content, id: $updateAlbumId) {
      status
    }
  }
`;

interface VariableProps {
  updateAlbumId: string;
  content?: {
    title?: string;
    description?: string;
    id_sick?: string;
    pictures?: any;
  };
}

const useUpdateDiagnosis = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Update_Album, {
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

export default useUpdateDiagnosis;
