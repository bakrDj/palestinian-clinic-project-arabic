import { gql, useQuery } from "@apollo/client";

export const ALL_CLIENT_BOXES = gql`
  query BoxClient($idClient: ID) {
    boxClient(idClient: $idClient) {
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
      createdAt
      updatedAt
      picture {
        id
      }
      lastTrace {
        status
        stock {
          id
        }
      }
    }
  }
`;

interface Props {}

const useGetAllClientShipments = ({ client_id }: { client_id: string }) => {
  let { data, loading, refetch } = useQuery(ALL_CLIENT_BOXES, {
    variables: {
      idClient: client_id,
    },
    fetchPolicy: "network-only",
    // nextFetchPolicy: "cache-first",
  });
  // return data?.boxClient || [];
  return [data?.boxClient || [], loading, refetch];
};

export default useGetAllClientShipments;
