import { gql, OperationVariables, QueryTuple, useLazyQuery, useQuery } from "@apollo/client";

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      user_name
      role
      activation
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

const UseGetCurrentUser = () => {
  let currentUserResult = useLazyQuery(CURRENT_USER);
  return currentUserResult;
};

export default UseGetCurrentUser;
