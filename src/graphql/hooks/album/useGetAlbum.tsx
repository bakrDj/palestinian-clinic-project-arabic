import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_Album = gql`
  query GetAllRadiologysByPatientID($patientsId: Int!) {
    GetAllRadiologysByPatientID(patientsId: $patientsId) {
      id
      title
      description
      images
      patientsId
      createdAt
      updatedAt
    }
  }
`;

interface Props {}

const useGetAlbum = ({ id }: { id: string | number }) => {
  let res = useLazyQuery(All_Album, {
    variables: {
      patientsId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetAlbum;
