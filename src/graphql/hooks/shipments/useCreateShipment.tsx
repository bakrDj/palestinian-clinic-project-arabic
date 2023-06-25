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

export const CREATE_BOXE = gql`
  mutation CreateBox($content: boxContent!) {
    createBox(content: $content) {
      id
      code_box
      recipient_name
      recipient_phone1
      recipient_city
      recipient_address
      product_name
      manufactured_material
      number_cartons
      size
      weight
      insurance
      invoice_amount
      price_delivery
      note
      ID_number
      createdAt
      updatedAt
    }
  }
`;

interface VariableProps {
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

const useCreateShipment = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let createShipmentResult = useMutation<any, VariableProps>(CREATE_BOXE, {
    update: (cache, { data: { createBox } }) => {
      cache.modify({
        fields: {
          boxClient(existedBoxes = [], { readField }) {
            return [...existedBoxes, createBox];
          },
        },
      });
    },
  });
  return createShipmentResult;
};

export default useCreateShipment;
