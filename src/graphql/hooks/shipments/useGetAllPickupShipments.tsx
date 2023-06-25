import { gql, OperationVariables, QueryTuple, useLazyQuery, useQuery } from "@apollo/client";

export const LIST_PICKUP_CLIENT = gql`
  query ListPickUpClient($idClient: ID) {
    listPickUpClient(idClient: $idClient) {
      code
      status
      createdAt
      numberBox
    }
  }
`;

interface Props {}

interface VartiableProps {
  idClient: string;
}

const useGetAllPickupShipments = (): QueryTuple<any, VartiableProps> => {
  let res = useLazyQuery<any, VartiableProps>(LIST_PICKUP_CLIENT);
  return res;
};

export default useGetAllPickupShipments;
