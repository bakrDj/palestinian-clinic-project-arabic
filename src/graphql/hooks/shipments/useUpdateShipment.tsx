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

export const UPDATE_BOXE = gql`
  mutation UpdateBox($updateBoxId: ID!, $content: boxContent!) {
    updateBox(id: $updateBoxId, content: $content) {
      status
    }
  }
`;

interface VariableProps {
  updateBoxId: string;
  content: {
    recipient_name?: string;
    recipient_phone1?: string;
    recipient_city?: string;
    recipient_address?: string;

    product_name?: string;
    manufactured_material?: string;
    number_cartons?: number;
    size?: string;
    weight?: string;
    insurance?: boolean;
    invoice_amount?: number;
    price_delivery?: number;
    note?: string;
    status_box?: string;
    id_stock?: string;
    id_client?: string;
    id_person?: string;
    ID_number?: string;
  };
}

const useUpdateShipment = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(UPDATE_BOXE, {
    // update: (cache, { data: { updateBox } }) => {
    //   console.log("🚀 ~ file: useUpdateShipment.tsx ~ line 64 ~ createBox", updateBox);
    //   // cache.modify({
    //   //   fields: {
    //   //     boxClient(existedBoxes = [], { readField }) {
    //   //       let index = existedBoxes.findIndex((item: any) => item.id === createBoxTrace.box.id);
    //   //       return produce((existedBoxes, draft: any) => {
    //   //         draft[index].lastTrace.status = createBoxTrace.status;
    //   //       });
    //   //     },
    //   //   },
    //   // });
    // },
  });
  return res;
};

export default useUpdateShipment;
