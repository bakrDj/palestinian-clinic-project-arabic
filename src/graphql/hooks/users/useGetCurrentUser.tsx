import { gql, OperationVariables, QueryTuple, useLazyQuery, useQuery } from "@apollo/client";

export const CURRENT_USER = gql`
  query GetOneUserByGoogleId($googleAccountId: String!) {
    GetOneUserByGoogleId(google_account_id: $googleAccountId) {
      email
      google_account_id
      id
      personsId
      role
      updatedAt
      username
      createdAt
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

const UseGetCurrentUser = () => {
  let currentUserResult = useLazyQuery<any, { googleAccountId: string }>(CURRENT_USER);
  return currentUserResult;
};

export default UseGetCurrentUser;
