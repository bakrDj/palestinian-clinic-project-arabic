import { gql } from "@apollo/client";

export const statistics = gql`
  query StatisticsClient($idClient: ID) {
    statisticsClient(idClient: $idClient) {
      numberAllBox
      totalAmountDelivered
      totalAmountTax
      totalAmountBox
      allStatus {
        status
        numberBox
      }
    }
  }
`;
