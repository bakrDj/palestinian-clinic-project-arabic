import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const All_VitalSigns = gql`
  query GetAllVitalSignsByPatientID($patientsId: Int!) {
    GetAllVitalSignsByPatientID(patientsId: $patientsId) {
      blood_pressure
      blood_sugar
      body_temperature
      createdAt
      heart_beat
      id
      number_breaths
      oxygen_saturation
      patientsId
      updatedAt
    }
  }
`;

interface Props {}

const useGetVitalSign = ({ id }: { id: number | string }) => {
  let res = useLazyQuery(All_VitalSigns, {
    variables: {
      patientsId: id,
    },
    // fetchPolicy: "cache-first",
    // nextFetchPolicy: "cache-first",
  });
  return res;
};

export default useGetVitalSign;
