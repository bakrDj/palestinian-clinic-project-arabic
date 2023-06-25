import React, { useCallback, useEffect, useState } from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
  Line,
  PDFViewer,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { priceFormatHelper } from "../../utilities/helpers";
import * as R from "ramda";
import { useRouter } from "next/router";
import theme from "../../styles/theme";
import { alpha } from "@mui/material";
import { grey } from "@mui/material/colors";
import JsBarcode from "jsbarcode";
import algerian_provinces from "../../utilities/data/api/yaman_provinces.json";

interface Props {
  shipmentDataList?: any;
  userData?: any;
}

Font.register({
  family: "Heebo",

  // src: path.join(__dirname, "/fonts/Heebo-Regular.ttf"),
  src: "/fonts/Heebo-Regular.ttf",
  fontStyle: "normal",
  fontWeight: 400,
});

let fontsLoaded: any = false;
let forceUpdate: any = null;

// Force loading and wait for loading to finish
Promise.all([Font.load({ fontFamily: "Heebo", fontWeight: 400 })]).then(() => {
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
    paddingTop: 25,
    paddingBottom: 100,
    paddingHorizontal: 30,
    fontFamily: "Heebo",
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

const ReceiptTemplate = ({ shipmentDataList, userData }: Props) => {
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
  //   await Promise.all([Font.load({ fontFamily: "Heebo", fontWeight: 400 })]);
  // }, []);

  // useEffect(() => {
  //   loadFonts();
  // }, [loadFonts]);

  return (
    <PDFViewer width={"100%"} style={{ minHeight: "100vh" }}>
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
                <Image style={{ width: 46, marginRight: 20 }} src={"/logo.png"}></Image>
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
                            {dayjs().format("DD/MM/YYYY HH:mm:ss")}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#909090",
                              margin: 2,
                            }}
                          >
                            حررت بتاريخ:
                          </Text>
                        </View>
                        <Text style={{ fontSize: 23, color: "#575757" }}>وصل إستلام</Text>
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
                <View
                  style={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    minHeight: 156,
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
                        justifyContent: "space-between",
                        flexDirection: "column-reverse",
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
                            color: "#707070",
                            margin: 4,
                          }}
                        >
                          {/* <Text style={{ fontSize: 9 }}>د.ج</Text> */}
                          {userData?.person?.phone01}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#909090",
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
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#707070",
                            margin: 4,
                          }}
                        >
                          {userData?.person?.email}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#909090",
                            margin: 4,
                          }}
                        >
                          البريد الالكتروني:
                        </Text>
                      </View>

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
                            color: "#707070",
                            margin: 4,
                            textAlign: "left",
                          }}
                        >
                          {/* <Text style={{ fontSize: 9 }}>د.ج</Text> */}
                          {userData?.person?.address}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#909090",
                            margin: 4,
                          }}
                        >
                          عنوان المستلم:
                        </Text>
                      </View>

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
                            color: "#707070",
                            margin: 4,
                            textAlign: "left",
                          }}
                        >
                          {algerian_provinces?.[userData?.person?.city - 1]?.wilaya_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#909090",
                            margin: 4,
                          }}
                        >
                          ولاية المستلم:
                        </Text>
                      </View>

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
                            color: "#707070",
                            margin: 4,
                          }}
                        >
                          {`${userData?.person?.first_name} ${userData?.person?.last_name}`}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#909090",
                            margin: 4,
                          }}
                        >
                          إسم العميل:
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "128px",
                      }}
                    >
                      {/*total payment*/}
                      {/* <View
                        style={{
                          width: 180,
                          height: 70,
                          backgroundColor: "#FFF",
                          borderRadius: 2,
                        }}
                      >
                        <View
                          style={{
                            color: "#FFF",
                            backgroundColor: "#FFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 70,
                            borderRadius: 2,
                            // margin: -8,
                          }}
                        >
                          <Image
                            src={barcode}
                            style={{
                              // width: "100%",
                              height: "100%",
                            }}
                          />
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#707070",
                          margin: 4,
                        }}
                      >
                        inv-1234567
                      </Text> */}
                    </View>
                  </View>
                </View>
                {/* section 2 */}
                {/* <View
              style={{
                marginTop: "14px",
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
              <Text style={{}}>منتجات البراند</Text>
            </View> */}
                {/* product table */}

                <View
                  style={{
                    border: `0.5 solid ${grey[300]}`,
                    marginTop: "32px",
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        سعر التوصيل
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        سعر الطرد
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        الوجهة
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        رقم العميل
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        إسم العميل
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        كود الطرد
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
                          color: "#9E9E9E",
                          fontSize: 9,
                          // height: '32px',
                        }}
                      >
                        #
                      </Text>
                    </View>
                  </View>
                  {/* table content */}
                  {shipmentDataList?.map((shipment: any, index: any) => (
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
                          <Text style={{ fontSize: 7 }}>د.ج</Text>

                          {shipment?.price_delivery}
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
                          <Text style={{ fontSize: 7 }}>د.ج</Text>

                          {shipment?.price_box}
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
                          {algerian_provinces[shipment?.recipient_city - 1].wilaya_name}
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
                          {shipment?.recipient_phone1}
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
                          {shipment?.recipient_name}
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
                          {shipment?.code_box}
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
                          {index + 1}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Total */}

                <View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "32px",
                      width: "50%",
                      marginLeft: "auto",
                      // border: `0.5 solid ${grey[300]}`,
                    }}
                  >
                    <View
                      style={{
                        flex: "1.5",
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
                          fontSize: 10,
                          // height: '32px',
                        }}
                      >
                        {/* {product?.number_sales} */}
                        <Text style={{ fontSize: 8 }}>د.ج</Text>
                        {shipmentDataList?.reduce(
                          (prev: any, shipment: any) => prev + shipment.price_box,
                          0
                        )}
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
                          color: grey[500],
                          fontSize: 10,
                          // height: '32px',
                        }}
                      >
                        م. سعر الطرد
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "50%",
                      marginLeft: "auto",
                      // border: `0.5 solid ${grey[300]}`,
                    }}
                  >
                    <View
                      style={{
                        flex: "1.5",
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
                          fontSize: 10,
                          // height: '32px',
                        }}
                      >
                        {/* {product?.number_sales} */}
                        <Text style={{ fontSize: 8 }}>د.ج</Text>
                        {shipmentDataList?.reduce(
                          (prev: any, shipment: any) => prev + shipment.price_delivery,
                          0
                        )}
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
                          color: grey[500],
                          fontSize: 10,
                          // height: '32px',
                        }}
                      >
                        م. س.التوصيل
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "50%",
                      marginLeft: "auto",
                      // border: `0.5 solid ${grey[300]}`,
                    }}
                  >
                    <View
                      style={{
                        flex: "1.5",
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
                          fontSize: 11,

                          // height: '32px',
                        }}
                      >
                        {/* {product?.number_sales} */}
                        <Text style={{ fontSize: 8 }}>د.ج</Text>
                        {shipmentDataList?.reduce(
                          (prev: any, shipment: any) => prev + shipment.price_delivery,
                          0
                        )}
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: "1",
                        flexShrink: 0,

                        backgroundColor: theme.palette.primary.main,
                        height: "32px",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        border: `0.5 solid ${grey[300]}`,
                        padding: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          fontSize: 10,
                          // height: '32px',
                        }}
                      >
                        المبلغ المستحق
                      </Text>
                    </View>
                  </View>
                </View>
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

export default ReceiptTemplate;
