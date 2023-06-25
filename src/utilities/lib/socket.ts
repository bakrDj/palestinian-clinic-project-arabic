import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { IOType } from "child_process";
import produce from "immer";
import { io, Socket } from "socket.io-client";
import { ALL_CLIENT_BOXES } from "../../graphql/hooks/shipments/useGetAllClientShipments";
import useStore from "../../store/useStore";
import { sortByRecentTime } from "../helpers/filters";
// const events = require('events');

export default class SocketClient {
  io?: Socket;
  id?: string;
  snd = new Audio("/notification.wav");

  constructor({ user_id, user_username, stock_id, client_id }: any) {
    // ?: null;
    // this.id = null;
    const token = (useStore.getState() as any).token;
    // https://deliveryapi-5050.qafilaty.com/graphql
    try {
      this.io = io("wss://deliveryapi-5050.qafilaty.com", {
        path: "/socket.io",
        autoConnect: true,
        transports: ["websocket"],
        query: {
          user_id: user_id,
          user_username: user_username,
          stock_id: stock_id,
          client_id: client_id,
        },
        auth: {
          token: token || "",
        },
        // extraHeaders: {
        //   Authorization: token || "",
        // },
      });
    } catch (error) {
      alert(`Something went wrong; Can't connect to socket server`);
    }
  }

  disconnect() {
    this.io?.disconnect();
  }

  connect(client: ApolloClient<NormalizedCacheObject> | undefined) {
    this.io?.on("connect", async () => {
      this.id = this.io?.id;
    });
    this.io?.on("createBox", (data) => {
      this.snd.play();
      const notifyCount = (useStore.getState() as any)?.notifyCount;
      const notificationData = (useStore.getState() as any)?.notificationData;

      // console.info("ceate New Box => ", data);

      client?.cache.modify({
        fields: {
          boxClient(existedBoxes = [], { readField }) {
            // data = { ...data, __typename: "Box" };

            let cdata = produce(data, (draft: any) => {
              draft["__typename"] = "Box";
              draft.lastTrace[0]["__typename"] = {
                ["__typename"]: "BoxTrace",
                ...draft.lastTrace[0],
              };
            });

            let newBoxRef = client.cache.writeFragment({
              fragment: gql`
                fragment newBoxRef on Box {
                  id
                  recipient_name
                  recipient_city
                  code_box
                  lastTrace {
                    status
                    stock {
                      id
                    }
                  }
                  createdAt
                  archived
                }
              `,
              data: cdata,
            });

            return [newBoxRef, ...existedBoxes];
          },
        },
      });

      useStore.setState({
        notificationData: [data, ...notificationData],
        notifyCount: notifyCount + 1,
      });
    });

    this.io?.on("notifications", (data) => {
      console.table("notifications yaaay!!! => ", data);
      const notifyCount = (useStore.getState() as any)?.notifyCount;

      // let { newBoxes, newTrace } = data;
      if (!(notifyCount === null)) {
        if (data.newActions) {
          client?.refetchQueries({
            include: [ALL_CLIENT_BOXES],
          });
        }
      }

      useStore.setState({
        notificationData: sortByRecentTime(
          ["createdAt"],
          [...data.newTrace],
          "YYYY-MM-DDTHH:mm:ss.SSSZ"
        ),
        notifyCount: data.newActions,
      });
    });

    this.io?.on("newTrace", (data) => {
      this.snd.play();
      const notifyCount = (useStore.getState() as any)?.notifyCount;
      const notificationData = (useStore.getState() as any)?.notificationData;
      console.table("new trace update => ", data);

      let newBoxStatusUpdatedFragment = gql`
        fragment newBoxStatusUpdated on Box {
          id
          lastTrace {
            status
          }
        }
      `;

      client?.cache.modify({
        fields: {
          boxClient(existedBoxes = [], { readField }) {
            let newBoxRef = client.cache.readFragment({
              id: `Box:${data.id_box}`,
              fragment: newBoxStatusUpdatedFragment,
            });

            let newBox = produce(newBoxRef, (draft: any) => {
              draft.lastTrace[0].status = data.status;
            });

            client.cache.writeFragment({
              id: `Box:${data.id_box}`,
              fragment: newBoxStatusUpdatedFragment,
              data: newBox,
            });

            // return [...existedBoxes, newBoxRef];
          },
        },
      });

      useStore.setState({
        notificationData: [data, ...notificationData],
        notifyCount: notifyCount + 1,
      });
    });
  }
}
