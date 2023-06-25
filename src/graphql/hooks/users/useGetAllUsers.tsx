import { gql, OperationVariables, QueryTuple, useLazyQuery, useQuery } from "@apollo/client";

export const ALL_USERS = gql`
  query AllUsers {
    allUsers {
      id
      user_name
      role
      activation
      person {
        email
        last_name
        first_name
        id
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

const useGetAllUsers = () => {
  let { data, loading, refetch } = useQuery(ALL_USERS);
  return [data?.allUsers || [], loading, refetch];
};

export default useGetAllUsers;
