import { ApolloCache, DefaultContext, gql, MutationTuple, OperationVariables, useMutation, useQuery } from "@apollo/client";
import { Box } from "react-feather";

export const Update_VitalSign = gql`
  mutation UpdateVitalSign($updateVitalSignId: Int!, $data: VitalSignInputType) {
    UpdateVitalSign(id: $updateVitalSignId, data: $data) {
      id
    }
  }
`;

interface VariableProps {
  updateVitalSignId?: number;
  data: {
    blood_pressure?: string;
    blood_sugar?: string;
    body_temperature?: string;
    heart_beat?: string;
    number_breaths?: string;
    oxygen_saturation?: string;
    patientsId: number;
  };
}

const useUpdateVitalSign = (): MutationTuple<any, VariableProps, DefaultContext, ApolloCache<any>> => {
  let res = useMutation<any, VariableProps>(Update_VitalSign, {
    //   update: (cache, { data: { createBox } }) => {
    //     cache.modify({
    //       fields: {
    //         boxClient(existedBoxes = [], { readField }) {
    //           return [...existedBoxes, createBox];
    //         },
    //       },
    //     });
    //   },
  });
  return res;
};

export default useUpdateVitalSign;
