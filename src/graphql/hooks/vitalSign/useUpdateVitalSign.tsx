import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationTuple,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { Box } from "react-feather";

export const Update_VitalSigns = gql`
  mutation UpdateVitalSigns($updateVitalSignsId: ID!, $content: contentVitalSigns!) {
    updateVitalSigns(id: $updateVitalSignsId, content: $content) {
      status
    }
  }
`;

interface VariableProps {
  updateVitalSignsId?: string;
  content?: {
    body_temperature?: string;
    heart_beat?: string;
    blood_pressure?: string;
    number_breaths?: string;
    blood_sugar?: string;
    oxygen_saturation?: string;
    id_sick?: string;
  };
}

const useUpdateVitalSign = (): MutationTuple<
  any,
  VariableProps,
  DefaultContext,
  ApolloCache<any>
> => {
  let res = useMutation<any, VariableProps>(Update_VitalSigns, {
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
