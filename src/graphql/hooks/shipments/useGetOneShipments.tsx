import { gql, OperationVariables, QueryTuple, useLazyQuery } from "@apollo/client";

export const ONE_BOXE = gql`
  query Box($boxId: ID) {
    box(id: $boxId) {
      id
      code_box
      createdAt
      lastTrace {
        status
        stock {
          id
        }
      }
      insurance
      invoice_amount
      price_delivery
      container {
        name
      }
      picture {
        id
        name
      }
      # recipient
      recipient_name
      recipient_phone1
      recipient_city
      recipient_address
      ID_number
      # box details

      product_name
      manufactured_material
      note
      size
      number_cartons

      weight
      client {
        person {
          first_name
          last_name
          city
          id
        }
      }

      traceBox {
        id
        note
        status
        createdAt
        person {
          first_name
          last_name
        }
        stock {
          name
        }
      }
    }
  }
`;

interface Props {}

const useGetOneShipments = (): QueryTuple<any, OperationVariables> => {
  return useLazyQuery(ONE_BOXE);
};

export default useGetOneShipments;
