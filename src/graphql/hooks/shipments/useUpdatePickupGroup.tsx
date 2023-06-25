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

export const ADD_BOX_TO_PICKUP_GROUP = gql`
  mutation AddBoxToPickUpGroup($codePickUp: String!, $content: multiTraceContent!) {
    addBoxToPickUpGroup(codePickUp: $codePickUp, content: $content) {
      id
      status
      note
      validation
      createdAt
      updatedAt
    }
  }
`;

interface VariableProps {
  codePickUp: string;
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

const useUpdatePickupGroup = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let Result = useMutation<any, VariableProps>(ADD_BOX_TO_PICKUP_GROUP, {
    // update: (cache, { data: { addBoxToPickUpGroup } }) => {
    //   cache.modify({
    //     fields: {
    //       // boxClient(existedBoxes = [], { readField }) {
    //       //   let index = existedBoxes.findIndex(
    //       //     (item: any) => item.id === createMultiTrace[0].box.id
    //       //   );
    //       //   return produce((existedBoxes, draft: any) => {
    //       //     draft[index].lastTrace.status = createMultiTrace[0].status;
    //       //   });
    //       // },
    //       boxClient(existedBoxes = [], { readField }) {
    //         let newdata = produce((existedBoxes: any, draft: any) => {
    //           for (let i = 0; i < createMultiTrace.length; i++) {
    //             let index = existedBoxes.findIndex(
    //               (item: any) => item.id === createMultiTrace[i].box.id
    //             );
    //             draft[index].lastTrace[0].status = createMultiTrace[i].status;
    //           }
    //           return draft;
    //         });
    //         return newdata;
    //       },
    //     },
    //   });
    // },
  });
  return Result;
};

export default useUpdatePickupGroup;
