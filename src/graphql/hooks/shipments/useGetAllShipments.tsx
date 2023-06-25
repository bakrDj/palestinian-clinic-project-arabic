import { gql, useQuery } from "@apollo/client";

export const ALL_BOXES = gql`
  query AllBox($allBoxIdStock: ID!) {
    allBox(idStock: $allBoxIdStock) {
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

const useGetAllShipments = ({ stock_id }: { stock_id: string }) => {
  let { data } = useQuery(ALL_BOXES, {
    variables: {
      allBoxIdStock: stock_id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return data?.allBox || [];
};

export default useGetAllShipments;
