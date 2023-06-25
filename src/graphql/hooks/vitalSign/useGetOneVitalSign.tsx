import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const vitalSigns = gql`
  query VitalSigns($vitalSignsId: ID) {
    vitalSigns(id: $vitalSignsId) {
      id
      body_temperature
      heart_beat
      blood_pressure
      number_breaths
      blood_sugar
      oxygen_saturation
      createdAt
      updatedAt
      sick {
        id
        person {
          id
          first_name
          last_name
          email
          phone
          address
          ID_number
        }
      }
    }
  }
`;

interface Props {}

const useGetOneVitalSign = () => {
  let res = useLazyQuery(vitalSigns);
  return res;
};

export default useGetOneVitalSign;
