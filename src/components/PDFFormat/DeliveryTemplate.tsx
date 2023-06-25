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
  Svg,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { priceFormatHelper } from "../../utilities/helpers";
// import * as R from "ramda";
import { useRouter } from "next/router";
import { grey, red } from "@mui/material/colors";
import yaman_provinces from "../../utilities/data/api/yaman_provinces.json";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";

interface Props {
  dataList?: any;
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
    // paddingTop: 30,
    // paddingBottom: 30,
    // paddingHorizontal: 30,
    fontFamily: "Heebo",
    backgroundColor: grey[50],
    fontSize: 12,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 25,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  smFont: {
    fontSize: "9",
    color: grey[800],
  },
  horizontalDivider: {
    position: "absolute",
    top: 0,
    left: "50%",
    height: "100%",
    textAlign: "center",
    borderLeft: `2px dashed ${grey[300]}`,
  },
  verticalDivider: {
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    textAlign: "center",
    borderTop: `2px dashed ${grey[300]}`,
  },
});

const DeliveryTemplate = ({ dataList, userData }: Props) => {
  forceUpdate = useForceUpdate();

  if (!fontsLoaded) {
    return <div />;
  }

  // const loadFonts = useCallback(async () => {
  //   await Promise.all([Font.load({ fontFamily: "Heebo", fontWeight: 400 })]);
  // }, []);

  // useEffect(() => {
  //   loadFonts();
  // }, [loadFonts]);

  let canvas = null;
  // qrcode generator
  let qrCodeGenerator = (qrcode: any) => {
    canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, qrcode(), {
      margin: 2,
    });
    return canvas.toDataURL();
  };

  // codebar generator
  let codebarGenerator = (codeBox: string) => {
    canvas = document.createElement("canvas");
    JsBarcode(canvas, codeBox, {
      displayValue: false,
      margin: 10,
      // width: 1000,
      height: 58,
    });
    return canvas.toDataURL();
  };

  return (
    <PDFViewer width={"100%"} style={{ minHeight: "100vh" }}>
      <Document>
        <Page size={"A4"} style={styles.body}>
          <View
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              flexWrap: "wrap",
              minHeight: "100%",
            }}
          >
            {dataList?.map((shipmentData: any, i: number) => (
              <View
                key={i}
                style={{
                  width: "50%",
                  height: "50vh",
                  // maxHeight: "50%",
                  flexShrink: 0,
                  padding: 4,
                }}
              >
                <View
                  style={{
                    // display: "flex",
                    flexShrink: 0,
                    flexGrow: 0,
                    // flex: 1,
                    backgroundColor: grey[100],
                    height: "100%",
                    maxHeight: "100%",
                    minHeight: "100%",
                    padding: 8,
                    // margin: 4,
                  }}
                >
                  {/* header */}
                  <View
                    style={{
                      display: "flex",
                      flex: 1,
                      flexBasis: "20%",
                      flexDirection: "row",
                      margin: -4,
                    }}
                  >
                    {/* logo */}
                    <View
                      style={{
                        // flex: 1,
                        flexBasis: "25%",
                        display: "flex",
                        padding: 4,
                        margin: 4,
                        border: `1px solid ${grey[200]}`,
                        backgroundColor: "#FFF",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        src={
                          userData?.person?.company?.logo === "Default"
                            ? "/logo.png"
                            : userData?.person?.company?.logo
                        }
                        style={{ width: 34 }}
                      />
                    </View>
                    {/* seller info */}
                    <View
                      style={{
                        // flex: 1,
                        flexBasis: "75%",
                        display: "flex",
                        padding: 4,
                        margin: 4,
                        border: `1px solid ${grey[200]}`,
                        backgroundColor: "#FFF",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexBasis: "100%",
                          // height: "100%",
                          // display: "flex",
                          // // padding: 4,
                          // margin: 0,
                          // justifyContent: "center",
                          // alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {/* left section */}
                        <View
                          style={{
                            flex: 1,
                            flexBasis: "70%",
                            minHeight: "100%",
                            display: "flex",
                            // padding: 4,
                            margin: 2,
                            // border: `1px solid ${grey[200]}`,
                            // backgroundColor: "#080",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ ...styles.smFont, marginBottom: 4 }}
                          >{`${userData?.person?.first_name} ${userData?.person?.last_name}`}</Text>
                          <Text style={{ ...styles.smFont, marginBottom: 4 }}>
                            {userData?.person?.phone01}
                          </Text>
                          <Text style={styles.smFont}>{`${
                            JSON.parse(JSON.stringify(yaman_provinces))?.[
                              userData?.person?.city - 1
                            ]?.wilaya_name
                          } / ${userData?.person?.address}`}</Text>
                        </View>
                        {/* right section */}
                        <View
                          style={{
                            flex: 1,
                            flexBasis: "30%",
                            minHeight: "100%",
                            display: "flex",
                            // padding: 2,
                            margin: 2,
                            // border: `1px solid ${grey[200]}`,
                            backgroundColor: "#ccc",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            src={qrCodeGenerator(() => {
                              let { first_name, last_name } = userData?.person;
                              return JSON.stringify({
                                first_name,
                              });
                            })}
                            style={
                              {
                                /*  width: "100%", height: "100%" */
                              }
                            }
                          />
                          {/* <Text style={styles.smFont}>QRC</Text> */}
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* center */}

                  <View
                    style={{
                      display: "flex",
                      flex: 4,
                      flexBasis: "52%",
                      // margin: 4,
                      marginTop: 8,
                    }}
                  >
                    {/* center - section 1 */}
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        // backgroundColor: "#CCC",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                          margin: -4,
                        }}
                      >
                        {/* left section */}
                        <View
                          style={{
                            // flex: 1,
                            flexBasis: "75%",
                            display: "flex",
                            padding: 4,
                            margin: 4,
                            // border: `1px solid ${grey[200]}`,
                            // justifyContent: "space-between",
                            // alignItems: "",
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flex: 1,
                              margin: -6,
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                margin: 2,
                                // flexBasis: "60%",
                                // minHeight: "50%",
                                // padding: 4,
                                // alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexBasis: "100%",
                                  flexDirection: "row",
                                  // justifyContent: "flex-end",
                                  textAlign: "right",
                                  alignItems: "center",
                                  padding: 4,
                                  border: `1px solid ${grey[200]}`,
                                  backgroundColor: "#FFF",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    flex: 1,
                                    fontSize: 8,
                                    textAlign: "left",
                                  }}
                                >
                                  {shipmentData?.recipient_name}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    fontSize: 8,
                                    color: grey[700],
                                    textAlign: "right",
                                  }}
                                >
                                  إسم المستلم:
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flex: 1,
                                margin: 2,
                                // flexBasis: "60%",
                                // minHeight: "50%",
                                // padding: 4,
                                // alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexBasis: "100%",
                                  flexDirection: "row",
                                  // justifyContent: "flex-end",
                                  textAlign: "right",
                                  alignItems: "center",
                                  padding: 4,
                                  border: `1px solid ${grey[200]}`,
                                  backgroundColor: "#FFF",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    flex: 1,
                                    fontSize: 8,
                                    textAlign: "left",
                                  }}
                                >
                                  {shipmentData?.recipient_address}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    fontSize: 8,
                                    color: grey[700],
                                    textAlign: "right",
                                  }}
                                >
                                  العنوان:
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        {/* right section */}
                        <View
                          style={{
                            // flex: 1,
                            flexBasis: "25%",
                            display: "flex",
                            padding: 4,
                            margin: 4,
                            border: `1px solid ${grey[200]}`,
                            backgroundColor: "#FFF",
                            justifyContent: "center",
                            alignItems: "center",
                            // flexDirection: "row",
                          }}
                        >
                          <Text
                            style={{
                              ...styles.smFont,
                              fontSize: 20,
                            }}
                          >
                            {shipmentData?.recipient_city}
                          </Text>
                          <Text style={styles.smFont}>
                            {
                              JSON.parse(JSON.stringify(yaman_provinces))?.[
                                shipmentData?.recipient_city - 1
                              ]?.wilaya_name
                            }
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* center - section 2 */}
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        // backgroundColor: "#CCC",
                        flexDirection: "row",
                        marginTop: 8,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                          margin: -4,
                        }}
                      >
                        {/* left section */}
                        <View
                          style={{
                            // flex: 1,
                            flexBasis: "75%",
                            display: "flex",
                            padding: 4,
                            margin: 4,
                            // border: `1px solid ${grey[200]}`,
                            // justifyContent: "space-between",
                            // alignItems: "",
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flex: 1,
                              margin: -6,
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                margin: 2,
                                // flexBasis: "60%",
                                // minHeight: "50%",
                                // padding: 4,
                                // alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexBasis: "100%",
                                  flexDirection: "row",
                                  // justifyContent: "flex-end",
                                  textAlign: "right",
                                  alignItems: "center",
                                  padding: 4,
                                  border: `1px solid ${grey[200]}`,
                                  backgroundColor: "#FFF",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    flex: 1,
                                    fontSize: 8,
                                    textAlign: "left",
                                  }}
                                >
                                  {shipmentData?.recipient_phone1}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    fontSize: 8,
                                    color: grey[700],
                                    textAlign: "right",
                                  }}
                                >
                                  رقم الهاتف:
                                </Text>
                              </View>
                            </View>

                            <View
                              style={{
                                flex: 1,
                                margin: 2,
                                // flexBasis: "60%",
                                // minHeight: "50%",
                                // padding: 4,
                                // alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexBasis: "100%",
                                  flexDirection: "row",
                                  // justifyContent: "flex-end",
                                  textAlign: "right",
                                  alignItems: "center",
                                  padding: 4,
                                  border: `1px solid ${grey[200]}`,
                                  backgroundColor: "#FFF",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    flex: 1,
                                    fontSize: 8,
                                    textAlign: "left",
                                  }}
                                >
                                  {shipmentData?.command_number || "-"}
                                </Text>
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    fontSize: 8,
                                    color: grey[700],
                                    textAlign: "right",
                                  }}
                                >
                                  رقم الطلب:
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        {/* right section */}
                        <View
                          style={{
                            // flex: 1,
                            flexBasis: "25%",
                            display: "flex",
                            padding: 4,
                            margin: 4,
                            border: `1px solid ${grey[200]}`,
                            backgroundColor: "#FFF",
                            justifyContent: "center",
                            alignItems: "center",
                            // flexDirection: "row",
                          }}
                        >
                          <Text
                            style={{
                              ...styles.smFont,
                              textAlign: "center",
                              fontSize: 20,
                            }}
                          >
                            {shipmentData?.delivery_type == "house" ? "D" : "SD"}
                          </Text>
                          <Text style={{ ...styles.smFont, textAlign: "center" }}>
                            {shipmentData?.delivery_type == "house" ? "ت.للمنزل" : "ت.للمكتب"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* center - section 3 */}
                    <View
                      style={{
                        display: "flex",
                        flex: 1,
                        // backgroundColor: "#CCC",
                        flexDirection: "row",
                        marginTop: 8,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                          margin: -4,
                        }}
                      >
                        {/* left section */}
                        <View
                          style={{
                            // flex: 1,
                            flexBasis: "75%",
                            display: "flex",
                            padding: 4,
                            margin: 4,
                            // border: `1px solid ${grey[200]}`,
                            // justifyContent: "space-between",
                            // alignItems: "",
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flex: 1,
                              margin: -6,
                            }}
                          >
                            <View
                              style={{
                                flex: 1,
                                margin: -2,
                                flexDirection: "row",
                                // flexBasis: "60%",
                                // minHeight: "50%",
                                // padding: 4,
                                // alignItems: "center",

                                height: "100%",
                                // backgroundColor: "#FFF",
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  margin: 4,
                                  // flexBasis: "40%",
                                  // minHeight: "50%",
                                  // padding: 4,
                                  // alignItems: "center",
                                  // height: "100%",
                                  border: `1px solid ${grey[200]}`,
                                  backgroundColor: "#FFF",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    textAlign: "center",
                                    fontSize: 11,
                                    marginBottom: 6,
                                  }}
                                >
                                  {shipmentData?.price_delivery + shipmentData?.price_box} DA
                                </Text>
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    textAlign: "center",
                                    marginBottom: -4,
                                  }}
                                >
                                  المجموع
                                </Text>
                              </View>
                              <View
                                style={{
                                  flex: 1,
                                  margin: 4,
                                  // flexBasis: "60%",
                                  // minHeight: "50%",
                                  // padding: 4,
                                  // alignItems: "center",
                                  // height: "100%",
                                  border: `1px solid ${grey[200]}`,

                                  backgroundColor: "#FFF",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    ...styles.smFont,
                                    textAlign: "center",
                                    fontSize: 11,
                                    marginBottom: 2,
                                  }}
                                >
                                  {(shipmentData?.possibility_open && (
                                    <Image
                                      src="/openable-box-on.png"
                                      style={{ width: 22, height: 22 }}
                                    />
                                  )) || (
                                    <Image
                                      src="/openable-box-off.png"
                                      style={{ width: 25, height: 25 }}
                                    />
                                  )}
                                </Text>
                                {(shipmentData?.possibility_open && (
                                  <Text
                                    style={{
                                      ...styles.smFont,
                                      textAlign: "center",
                                      marginBottom: 4,
                                      // color: red[500],
                                    }}
                                  >
                                    يمكن فتح الطرد
                                  </Text>
                                )) || (
                                  <Text
                                    style={{
                                      ...styles.smFont,
                                      textAlign: "center",
                                      marginBottom: 4,
                                      color: red[500],
                                    }}
                                  >
                                    ممنوع فتح الطرد
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                        {/* right section */}
                        <View
                          style={{
                            // flex: 1,
                            flexBasis: "25%",
                            display: "flex",
                            padding: 4,
                            margin: 4,
                            border: `1px solid ${grey[200]}`,
                            backgroundColor: "#FFF",
                            justifyContent: "center",
                            alignItems: "center",
                            // flexDirection: "row",
                          }}
                        >
                          <Text
                            style={{
                              ...styles.smFont,
                              textAlign: "center",
                              fontSize: 20,
                            }}
                          >
                            {shipmentData?.price_box > 0 ? "E" : "C"}
                          </Text>
                          <Text style={{ ...styles.smFont, textAlign: "center" }}>
                            {shipmentData?.price_box > 0 ? "ت.تجاري" : "ت.كلاسيكي"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* footer */}
                  <View
                    style={{
                      display: "flex",
                      // flex: 3,
                      flexBasis: "28%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        // flex: 1,
                        flexBasis: "70%",
                        flexDirection: "row",
                        // justifyContent: "flex-end",
                        textAlign: "right",
                        alignItems: "center",
                        padding: 4,
                        // border: `1px solid ${grey[200]}`,
                        // backgroundColor: "#FFF",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexBasis: "60%",
                          margin: "0 auto",
                        }}
                      >
                        <Image
                          src={codebarGenerator(shipmentData?.code_box)}
                          style={
                            {
                              // width: "100%",
                              // height: "100%",
                            }
                          }
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexBasis: "30%",
                        margin: "0 auto",
                      }}
                    >
                      <Text style={{ color: grey[800] }}>{shipmentData?.code_box}</Text>
                    </View>
                    {shipmentData?.fragile && (
                      <View
                        style={{
                          // display: "none",
                          // flex: 1,
                          flexBasis: "30%",
                          flexDirection: "row",
                          // justifyContent: "flex-end",
                          textAlign: "right",
                          alignItems: "center",
                          padding: 4,
                          border: `1px solid ${grey[200]}`,
                          backgroundColor: "#FFF",
                        }}
                      >
                        <Text
                          style={{
                            ...styles.smFont,
                            flex: 1,
                            fontSize: 12,
                            textAlign: "center",
                            color: red[500],
                          }}
                        >
                          قابل للكسر
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View fixed style={styles.horizontalDivider}></View>
          <View fixed style={styles.verticalDivider}></View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default DeliveryTemplate;
