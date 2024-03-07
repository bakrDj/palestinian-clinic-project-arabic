import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Delete_Album = gql`
  mutation DeleteRadiology($deleteRadiologyId: Int!) {
    DeleteRadiology(id: $deleteRadiologyId) {
      id
    }
  }
`;

interface VariableProps {
  deleteRadiologyId?: string;
}

const useDeleteAlbum = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Delete_Album, {
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

export default useDeleteAlbum;
