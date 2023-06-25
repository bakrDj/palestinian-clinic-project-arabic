import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_NurseOrder = gql`
  query AllNurseOrder($idSick: ID) {
    allNurseOrder(id_sick: $idSick) {
      id
      nurse_order
      completed
      createdAt
      updatedAt
    }
  }
`;

interface Props {}

const useGetNurseDuty = ({ id }: { id: string }) => {
  let res = useLazyQuery(All_NurseOrder, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetNurseDuty;
