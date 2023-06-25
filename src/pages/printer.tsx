import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useStore from "../store/useStore";
// import fontSrc from
import { useGetMultipleShipments, useGetOneShipments } from "../graphql/hooks/shipments";
import useGetOnePrescription from "../graphql/hooks/prescription/useGetOnePrescription";
import { useGetOneVitalSign, useGetVitalSignPrinter } from "../graphql/hooks/vitalSign";

const PrescriptionTemplate = dynamic(() => import("../components/PDFFormat/PrescriptionTemplate"), {
  ssr: false,
});

const VitalSignTemplate = dynamic(() => import("../components/PDFFormat/VitalSignTemplate"), {
  ssr: false,
});

interface Props {}

const Printer = (props: Props) => {
  const route = useRouter();
  const { prescriptionID, diagnosis, sickID, date, bordereau, receipt } = route.query;
  const userData = useStore((state: any) => state.userData);
  let [getData, { data: data }] = useGetOnePrescription();
  let [getData2, { data: data2 }] = useGetVitalSignPrinter();
  console.log("🚀 ~ file: printer.tsx ~ line 26 ~ Printer ~ data2", data2);

  React.useEffect(() => {
    useStore.setState({ isLayoutDisabled: true });
    prescriptionID &&
      getData({
        variables: { prescriptionId: prescriptionID as string[] },
      });

    diagnosis &&
      getData2({
        variables: {
          printSickId: sickID,
          date: date,
        },
      });
  }, [prescriptionID, diagnosis]);

  return (
    <>
      {prescriptionID && (
        <PrescriptionTemplate
          dataList={data?.prescription}
          userData={userData as any}
        ></PrescriptionTemplate>
      )}

      {diagnosis && (
        <VitalSignTemplate
          dataList={data2?.printSick}
          userData={userData as any}
        ></VitalSignTemplate>
      )}
    </>
  );
};

export default Printer;
