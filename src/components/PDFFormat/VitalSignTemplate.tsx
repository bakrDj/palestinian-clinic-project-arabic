import React, { useCallback, useEffect, useState } from "react";
import { Page, Text, Image, Document, StyleSheet, View, Font, Line, PDFViewer } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { priceFormatHelper } from "../../utilities/helpers";
import * as R from "ramda";
import { useRouter } from "next/router";
import theme, { primary } from "../../styles/theme";
import { alpha } from "@mui/material";
import { grey } from "@mui/material/colors";
import JsBarcode from "jsbarcode";
import parse from "html-react-parser";
import algerian_provinces from "../../utilities/data/api/yaman_provinces.json";

interface Props {
  dataList?: any;
  userData?: any;
}

Font.register({
  family: "Montserrat-Arabic",

  // src: path.join(__dirname, "/fonts/Montserrat-Arabic-Regular.ttf"),
  src: "/fonts/Montserrat-Arabic-Regular.ttf",
  fontStyle: "normal",
  fontWeight: 400,
});

let fontsLoaded: any = false;
let forceUpdate: any = null;

// Force loading and wait for loading to finish
Promise.all([Font.load({ fontFamily: "Montserrat-Arabic", fontWeight: 400 })]).then(() => {
  fontsLoaded = true;
  if (forceUpdate) forceUpdate();
});

// Helper to trigger an update in a functional component
function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 20,
    fontFamily: "Montserrat-Arabic",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    // bottom: 65,
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },

  companyInfofooter: {
    position: "absolute",
    fontSize: 12,
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "grey",
    // paddingHorizontal: 30,
    margin: "0 auto",
  },
});

const VitalSignTemplate = ({ dataList, userData }: Props) => {
  forceUpdate = useForceUpdate();

  // codebar generator
  let canvas = document.createElement("canvas");
  JsBarcode(canvas, "inv-1234567", {
    displayValue: false,
    background: "#FFF",
    margin: 12,
    marginLeft: 16,
    marginRight: 16,
    // width: 1000,
    height: 58,
  });
  const barcode = canvas.toDataURL();

  if (!fontsLoaded) {
    return <div />;
  }

  // const loadFonts = useCallback(async () => {
  //   await Promise.all([Font.load({ fontFamily: "Montserrat-Arabic", fontWeight: 400 })]);
  // }, []);

  // useEffect(() => {
  //   loadFonts();
  // }, [loadFonts]);

  return (
    <PDFViewer
      width={"100%"}
      style={{ minHeight: "100vh" }}
    >
      <Document>
        <Page style={styles.body}>
          {/* header */}
          <View
            style={{
              width: "100%",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              //   alignItems: "space-between",
            }}
          >
            <View style={{}}>
              <View
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* left section */}
                <Image
                  style={{ width: 46, marginRight: 20 }}
                  src={"/logo.png"}
                ></Image>
                {/* right section */}

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      display: "flex",
                    }}
                  >
                    <View style={{ display: "flex" }}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            margin: -4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              color: "#707070",
                              margin: 2,
                            }}
                          >
                            08-644-1313
                            {/* תאריך מודפס: */}
                            {/* {dayjs().format("YYYY-MM-DD[T]HH:mm:ss[Z]")} */}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#909090",
                              margin: 2,
                            }}
                          >
                            {/* תאריך מודפס: */}
                            تواصل معنا:
                          </Text>
                        </View>
                        <Text style={{ fontSize: 16, color: "#575757" }}>مركز نبض الحياة الطبي</Text>
                      </View>
                      <View
                        style={{
                          flex: "1 1 1",
                          padding: "1px",
                          marginTop: 6,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: "2px",
                          // color: "black",
                        }}
                      ></View>
                    </View>
                  </View>
                </View>
              </View>
              {/* section 1 */}

              <View>
                {/* <View
              style={{
                marginTop: "48px",
                paddingHorizontal: 10,
                width: "100%",
                height: "32px",
                backgroundColor: "grey",
                color: "#FFF",
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
                fontSize: 14,
                marginBottom: 14,
              }}
            >
              <Text style={{}}>معلومات البراند</Text>
            </View> */}
                {/* brand info */}

                {/* brand info */}

                <View
                  style={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    // minHeight: 156,
                    padding: 14,
                    marginTop: "32px",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row-reverse",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "flex-end",
                        flexDirection: "column-reverse",
                        flexBasis: "49.5%",
                        // backgroundColor: "blue",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          margin: -4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[700],
                            margin: 4,
                            textAlign: "left",
                          }}
                        >
                          {/* <Text style={{ fontSize: 9 }}>د.ج</Text> */}
                          {dataList?.person?.address || "-"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[600],
                            margin: 4,
                          }}
                        >
                          العنوان:
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          margin: -4,
                          paddingBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[700],
                            margin: 4,
                            textAlign: "left",
                          }}
                        >
                          {dataList?.person?.ID_number || "-"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[600],
                            margin: 4,
                          }}
                        >
                          رقم الجواز
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          margin: -4,
                          paddingBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[700],
                            margin: 4,
                          }}
                        >
                          {`${dataList?.person?.first_name} ${dataList?.person?.last_name}`}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[600],
                            margin: 4,
                          }}
                        >
                          الإسم الكامل:
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: "flex-end",
                        flexDirection: "column-reverse",
                        // backgroundColor: "red",
                        flexBasis: "49.5%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          margin: -4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[700],
                            margin: 4,
                          }}
                        >
                          {/* <Text style={{ fontSize: 9 }}>د.ج</Text> */}
                          {/* תאריך מודפס: */}
                          {dayjs().format("DD/MM/YYYY HH:mm")}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[600],
                            margin: 4,
                          }}
                        >
                          تاريخ الطباعة:
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          margin: -4,
                          paddingBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[700],
                            margin: 4,
                          }}
                        >
                          {/* <Text style={{ fontSize: 9 }}>د.ج</Text> */}
                          {dataList?.person?.phone || "-"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[600],
                            margin: 4,
                          }}
                        >
                          رقم الهاتف:
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          margin: -4,
                          paddingBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[700],
                            margin: 4,
                          }}
                        >
                          {dataList?.age || "-"}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: grey[600],
                            margin: 4,
                          }}
                        >
                          العمر:
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* product table */}

                <View
                  style={{
                    border: `0.5 solid ${grey[300]}`,
                    marginTop: "18px",
                  }}
                >
                  {/* table header */}
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      // border: `0.5 solid ${grey[300]}`,
                    }}
                  >
                    <View
                      style={{
                        flex: "1",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 8,
                          // height: '32px',
                        }}
                      >
                        <Text style={{ fontSize: 7 }}>(mg/dl)</Text>
                        <Text>السكري</Text>
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: "1",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 8,
                          // height: '32px',
                        }}
                      >
                        <Text style={{ fontSize: 7 }}>(%)</Text> تشبع الاكسجين{" "}
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: "1.1",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 8,
                          // height: '32px',
                        }}
                      >
                        <Text style={{ fontSize: 7 }}>(brpm)</Text>مرات التنفس
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: "1",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 8,
                          // height: '32px',
                        }}
                      >
                        <Text style={{ fontSize: 7 }}>(mmHg)</Text>ضغط الدم
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: "1",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 8,
                          // height: '32px',
                        }}
                      >
                        <Text style={{ fontSize: 7 }}>(bpm)</Text>نبضات القلب
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: "1",
                        flexShrink: 0,

                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 8,
                          // height: '32px',
                        }}
                      >
                        <Text style={{ fontSize: 7 }}>(c°)</Text>حرارة الجسم
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: "0.3",
                        flexShrink: 0,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "center",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: grey[600],
                          fontSize: 9,
                          // height: '32px',
                        }}
                      ></Text>
                    </View>
                  </View>
                  {/* table content */}
                  {dataList?.vitalSigns?.map((shipment: any, index: any) => (
                    <View
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          flex: "1",
                          flexShrink: 0,
                          // backgroundColor: '#F5F5F5',
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {shipment?.blood_sugar || "-"}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: "1",
                          flexShrink: 0,
                          // backgroundColor: '#F5F5F5',
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {shipment?.oxygen_saturation || "-"}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: "1.1",
                          flexShrink: 0,
                          // backgroundColor: '#F5F5F5',
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {shipment?.number_breaths || "-"}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: "1",
                          flexShrink: 0,
                          // backgroundColor: '#F5F5F5',
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {shipment?.blood_pressure || "-"}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: "1",
                          flexShrink: 0,
                          // backgroundColor: '#F5F5F5',
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {shipment?.heart_beat || "-"}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: "1",
                          flexShrink: 0,

                          // backgroundColor: '#F5F5F5',
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "flex-end",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {shipment?.body_temperature || "-"}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: "0.3",
                          flexShrink: 0,
                          // backgroundColor: '#F5F5F5',

                          // flexGrow: 1,
                          height: "32px",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `0.5 solid ${grey[300]}`,
                          padding: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#707070",
                            fontSize: 9,
                            // height: '32px',
                          }}
                        >
                          {dayjs(shipment?.createdAt).format("HH:mm")}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* diagnosis */}

                <View
                  style={{
                    marginTop: "18px",
                    display: "flex",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      textAlign: "right",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: primary[500] }}>الشكوى:</Text>
                    <Text style={{ fontSize: 10, color: grey[600] }}>
                      {(dataList?.diagnosis?.[0]?.complaint &&
                        parse(
                          dataList?.diagnosis?.[0]?.complaint
                            .split("\n")
                            .map((line: any) => `<div>${line.trim()}</div>`)
                            .join("\n")
                        )) ||
                        "ללא הערה"}
                      {/* {dataList?.diagnosis?.[0]?.complaint?.trim() || "ללא הערה"} */}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      textAlign: "right",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: primary[500] }}>التاريخ المرضي:</Text>
                    <Text style={{ fontSize: 10, color: grey[600] }}>
                      {(dataList?.diagnosis?.[0]?.medical_history &&
                        parse(
                          dataList?.diagnosis?.[0]?.medical_history
                            .split("\n")
                            .map((line: any) => `<div>${line.trim()}</div>`)
                            .join("\n")
                        )) ||
                        "ללא הערה"}
                      {/* {dataList?.diagnosis?.[0]?.medical_history?.trim() || "ללא הערה"} */}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      textAlign: "right",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: primary[500] }}>الفحص الطبي:</Text>
                    <Text style={{ fontSize: 10, color: grey[600] }}>
                      {(dataList?.diagnosis?.[0]?.physical_examination &&
                        parse(
                          dataList?.diagnosis?.[0]?.physical_examination
                            .split("\n")
                            .map((line: any) => `<div>${line.trim()}</div>`)
                            .join("\n")
                        )) ||
                        "ללא הערה"}
                      {/* <span dangerouslySetInnerHTML={{ __html: "<strong>strong text</strong>" }} /> */}
                      {/* {dataList?.diagnosis?.[0]?.physical_examination?.replace(
                        /(?:\r\n|\r|\n)/g,
                        " <br /> "
                      ) || "ללא הערה"} */}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      textAlign: "right",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: primary[500] }}>التشخيص:</Text>
                    <View
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        textAlign: "left",
                      }}
                    >
                      <Text style={{ fontSize: 10, color: grey[600] }}>
                        {(dataList?.diagnosis?.[0]?.diagnosis &&
                          parse(
                            dataList?.diagnosis?.[0]?.diagnosis
                              .split("\n")
                              .map((line: any) => `<div>${line.trim()}</div>`)
                              .join("\n")
                          )) ||
                          "ללא הערה"}
                        {/* {dataList?.diagnosis?.[0]?.diagnosis?.replace(/(?:\r\n|\r|\n)/g, "\n") ||
                          "ללא הערה"} */}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      textAlign: "right",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, color: primary[500] }}>توصيات الطبيب:</Text>
                    <Text style={{ fontSize: 10, color: grey[600] }}>
                      {/* {dataList?.diagnosis?.[0]?.recommendations?.trim() || "ללא הערה"} */}
                      {(dataList?.diagnosis?.[0]?.recommendations &&
                        parse(
                          dataList?.diagnosis?.[0]?.recommendations
                            .split("\n")
                            .map((line: any) => `<div>${line.trim()}</div>`)
                            .join("\n")
                        )) ||
                        "ללא הערה"}
                    </Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      marginTop: 18,
                      width: "80px",
                      paddingLeft: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: grey[700],
                        paddingBottom: 2,
                        borderBottom: "1px solid " + grey[800],
                      }}
                    >
                      توقيع الطبيب
                    </Text>
                  </View>
                </View>

                {/* Total */}
              </View>
            </View>
          </View>
          {/* 
          <View style={styles.companyInfofooter} fixed>
            <View
              style={{
                display: "flex",
                position: "absolute",
                width: "100%",
                bottom: 0,
              }}
            >
              <View style={{ display: "flex" }}>
                <View
                  style={{
                    flex: "1 1 1",
                    padding: "1px",
                    marginTop: 6,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "2px",
                    // color: "black",
                  }}
                ></View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "8px 0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // margin: -4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#707070",
                        margin: 2,
                      }}
                    >
                      +213 658-42-48-56
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // margin: -4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#707070",
                        margin: 2,
                      }}
                    >
                      email@qafilaty.com
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // margin: -4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#707070",
                        margin: 2,
                      }}
                    >
                      El-oued
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View> */}

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default VitalSignTemplate;
