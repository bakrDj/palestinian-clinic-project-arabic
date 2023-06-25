import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_Prescription = gql`
  query AllPrescription($idSick: ID) {
    allPrescription(id_sick: $idSick) {
      id
      title
      createdAt
      updatedAt
      medicines {
        id
        name
        quantity
        times_per_day
        duration
        note
        giving
      }
    }
  }
`;

interface Props {}

const useGetPrescription = ({ id }: { id: string }) => {
  let res = useLazyQuery(All_Prescription, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetPrescription;
