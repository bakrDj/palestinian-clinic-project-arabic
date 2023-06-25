import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_Album = gql`
  query AllAlbum($idSick: ID) {
    allAlbum(id_sick: $idSick) {
      id
      title
      description
      createdAt
      updatedAt
      pictures {
        id
        name
      }
    }
  }
`;

interface Props {}

const useGetAlbum = ({ id }: { id: string }) => {
  let res = useLazyQuery(All_Album, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetAlbum;
