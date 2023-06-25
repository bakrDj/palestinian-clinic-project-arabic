import { gql, useQuery } from "@apollo/client";

export const All_Sicks = gql`
  query AllSicks {
    allSicks {
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

const useGetAllPatients = ({ id }: { id?: string }) => {
  let { data, loading, refetch } = useQuery(All_Sicks, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return [data?.allSicks || [], loading, refetch];
};

export default useGetAllPatients;
