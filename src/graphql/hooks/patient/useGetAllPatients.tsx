import { gql, useQuery } from "@apollo/client";

export const Get_All_Patients = gql`
  query GetAllPatients {
    GetAllPatients {
      id
      createdAt
      updatedAt
      personsId
      last_update
      Person {
        id
        first_name
        last_name
        age
        gender
        address
        phone
        identification_number
        createdAt
        updatedAt
      }
    }
  }
`;

interface Props {}

const useGetAllPatients = ({ id }: { id?: string }) => {
  let { data, loading, refetch } = useQuery(Get_All_Patients, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return [data?.GetAllPatients || [], loading, refetch];
};

export default useGetAllPatients;
