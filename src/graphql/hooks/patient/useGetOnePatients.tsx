import { gql, useQuery } from "@apollo/client";

export const Get_One_Patient = gql`
  query GetOnePatient($getOnePatientId: Int!) {
    GetOnePatient(id: $getOnePatientId) {
      id
      personsId
      createdAt
      updatedAt
      Person {
        address
        age
        createdAt
        first_name
        gender
        id
        identification_number
        last_name
        phone
        updatedAt
      }
    }
  }
`;

interface Props {}

const useGetOnePatients = ({ id }: { id?: number }) => {
  let { data, loading, refetch } = useQuery(Get_One_Patient, {
    variables: {
      getOnePatientId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return [data?.GetOnePatient || [], loading, refetch];
};

export default useGetOnePatients;
