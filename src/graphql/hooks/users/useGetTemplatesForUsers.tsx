import { gql, useQuery } from "@apollo/client";

export const all_Formats = gql`
  query AllFormats {
    allFormats {
      id
      message
      type
      createdAt
      updatedAt
    }
  }
`;

interface Props {}

const useGetTemplatesForUsers = (/* { id }: { id?: string } */) => {
  let { data, loading, refetch } = useQuery(all_Formats, {
    // variables: {
    //   sickId: id,
    // },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return [data?.allFormats || [], loading, refetch];
};

export default useGetTemplatesForUsers;
