import { gql, useQuery } from "@apollo/client";

export const Sick = gql`
  query Sick($sickId: ID!) {
    sick(id: $sickId) {
      id
      age
      lastUpdate
      history {
        id
        createdAt
        updatedAt
      }
      person {
        id
        first_name
        last_name
        email
        phone
        address
        ID_number
        createdAt
        updatedAt
      }
    }
  }
`;

interface Props {}

const useGetOnePatients = ({ id }: { id?: string }) => {
  let { data, loading, refetch } = useQuery(Sick, {
    variables: {
      sickId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return [data?.sick || [], loading, refetch];
};

export default useGetOnePatients;
