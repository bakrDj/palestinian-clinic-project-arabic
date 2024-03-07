import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Create_Album = gql`
  mutation CreateRadiology($data: RadiologyInputType) {
    CreateRadiology(data: $data) {
      id
      title
      description
      images
      patientsId
      createdAt
      updatedAt
    }
  }
`;

interface VariableProps {
  data?: {
    title?: string;
    images?: string[];
    description?: string;
    patientsId?: number;
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
