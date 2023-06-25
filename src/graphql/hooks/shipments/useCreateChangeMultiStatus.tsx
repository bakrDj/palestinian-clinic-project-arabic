import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import produce from "immer";
import { Box } from "react-feather";

export const CREATE_MULTI_STATUS = gql`
  mutation CreateMultiTrace($content: multiTraceContent) {
    createMultiTrace(content: $content) {
      id
      status
      note
      validation
      createdAt
    }
  }
`;

interface VariableProps {
  content: {
    boxTrace: {
      id_box: string;
      status: string;
    };
    id_stock: string;
    id_person: string;
    id_company: string;
    note: string;
  };
}

const useCreateChangeMultiStatus = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let Result = useMutation<any, VariableProps>(CREATE_MULTI_STATUS, {
    update: (cache, { data: { createMultiTrace } }) => {
      cache.modify({
        fields: {
          boxClient(existedBoxes = [], { readField }) {
            let newdata = produce((existedBoxes: any, draft: any) => {
              for (let i = 0; i < createMultiTrace.length; i++) {
                let index = existedBoxes.findIndex(
                  (item: any) => item.id === createMultiTrace[i].box.id
                );
                draft[index].lastTrace[0].status = createMultiTrace[i].status;
              }
              return draft;
            });

            return newdata;
          },
        },
      });
    },
  });
  return Result;
};

export default useCreateChangeMultiStatus;
