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

export const MULTIPLE_UPLOAD_MUTATION = gql`
  mutation MultiUploads($idBox: ID!, $files: [Upload!]) {
    multiUploads(id_box: $idBox, files: $files) {
      id
      name
    }
  }
`;

interface VariableProps {
  idBox: string;
  files: any;
}

const useCreateUploadMultiFiles = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(MULTIPLE_UPLOAD_MUTATION, {
    // update: (cache, { data: { createBox } }) => {
    //   // cache.modify({
    //   //   fields: {
    //   //     boxClient(existedBoxes = [], { readField }) {
    //   //       return [...existedBoxes, createBox];
    //   //     },
    //   //   },
    //   // });
    // },
  });
  return res;
};

export default useCreateUploadMultiFiles;
