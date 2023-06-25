import React, { useEffect } from "react";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import algerian_provinces from "../../utilities/data/api/yaman_provinces.json";
import dayjs from "dayjs";

interface Props {
  shipmentDataList?: any;
  userData?: any;
}

const ReceiptTemplate = ({ shipmentDataList, userData }: Props) => {
  useEffect(() => {
    async function exportExcel() {
      /* load local template */
      const filePath: string = `/receipt-template.xlsx`;
      const buffer = await fetch(filePath).then((res) => res.arrayBuffer());
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.getWorksheet(1);
      /* insert today's date */
      worksheet.getCell("H5").value = dayjs().format("DD-MM-YYYY");

      /* add company info */
      let companyInfo = userData?.person?.company;
      worksheet.getCell("B4").value = companyInfo.name;
      worksheet.getCell("B5").value = companyInfo.email;
      worksheet.getCell("B6").value = companyInfo.phone01;
      /* add client info */
      let { first_name, last_name, email, address, city, phone01 } = userData?.person;
      worksheet.getCell("H9").value = first_name + " " + last_name;
      worksheet.getCell("H10").value = email;
      worksheet.getCell("D9").value = phone01;
      worksheet.getCell("D10").value = algerian_provinces[city - 1].wilaya_name + ", " + address;
      /* create Table */
      const rows = shipmentDataList?.map((shipment: any, i: number) => {
        console.log("🚀 ~ file: ReceiptTemplate.tsx ~ line 22 ~ rows ~ shipment", shipment);
        return [
          shipment?.price_delivery,
          shipment?.price_box,
          shipment?.recipient_city,
          shipment?.recipient_phone1,
          shipment?.recipient_name,
          shipment?.code_box,
          i + 1,
        ];
      });

      const table2 = worksheet.addTable({
        displayName: "Table2",
        columns: [
          {
            name: "سعر التوصيل",
            totalsRowLabel: "Total",
            filterButton: false,
          },
          {
            name: " سعر الطرد",
            filterButton: false,
          },
          {
            name: "الوجهة",
            filterButton: false,
          },
          {
            name: "رقم المستلم",
            filterButton: false,
          },
          {
            name: " إسم المستلم",
            filterButton: false,
          },
          {
            name: " كود الطرد",
            filterButton: false,
          },
          {
            name: "#",
            totalsRowFunction: "sum",
            filterButton: false,
          },
        ],
        name: "MyTable",
        ref: "B12",
        headerRow: true,
        totalsRow: false,
        style: {
          theme: "TableStyleMedium13",
          showFirstColumn: false,
          showLastColumn: false,
          showRowStripes: true,
          showColumnStripes: false,
        },
        rows: rows,
      });
      await table2.commit();

      /* access table */
      // const table1 = worksheet.getTable("Table1");
      // console.log("🚀 ~ file: index.tsx ~ line 21 ~ test ~ table1", table1);

      //   for (let shipment in shipmentDataList) {
      //     table1.addRow([
      //       shipmentDataList[shipment]?.price_delivery,
      //       shipmentDataList[shipment]?.price_box,
      //       shipmentDataList[shipment]?.recipient_city,
      //       shipmentDataList[shipment]?.recipient_phone1,
      //       shipmentDataList[shipment]?.recipient_name,
      //       shipmentDataList[shipment]?.code_box,
      //       shipment + 1,
      //     ]);
      //   }

      //   table1.commit();
      //   worksheet.commit();

      workbook.xlsx
        .writeBuffer()
        .then(async function (buffer) {
          // done
          console.log(buffer);

          const blob = new Blob([buffer], { type: "applicationi/xlsx" });
          await saveAs(blob, `receipt - ${dayjs().format("DD-MM-YYYY")}.xlsx`);
        })
        .then(() => {
          return setTimeout(() => window.close(), 1500);
        });
    }
    if (shipmentDataList) {
      exportExcel();
    }
  }, [shipmentDataList]);

  return <></>;
};

export default ReceiptTemplate;
