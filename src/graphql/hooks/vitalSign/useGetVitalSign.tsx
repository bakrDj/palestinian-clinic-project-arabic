import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_VitalSigns = gql`
  query AllVitalSigns($idSick: ID) {
    allVitalSigns(id_sick: $idSick) {
      id
      body_temperature
      heart_beat
      blood_pressure
      number_breaths
      blood_sugar
      oxygen_saturation
      createdAt
      updatedAt
    }
  }
`;

interface Props {}

const useGetVitalSign = ({ id }: { id: string }) => {
  let res = useLazyQuery(All_VitalSigns, {
    variables: {
      idSick: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetVitalSign;
