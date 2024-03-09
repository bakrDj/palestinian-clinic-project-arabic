import { gql, OperationVariables, QueryTuple, useLazyQuery, useQuery } from "@apollo/client";

export const ALL_USERS = gql`
  query GetAllUsers {
    GetAllUsers {
      id
      email
      username
      role
      google_account_id
      personsId
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
      createdAt
      updatedAt
    }
  }
`;

interface Props {}

const useGetAllUsers = () => {
  let { data, loading, refetch } = useQuery(ALL_USERS);
  return [data?.GetAllUsers || [], loading, refetch];
};

export default useGetAllUsers;
