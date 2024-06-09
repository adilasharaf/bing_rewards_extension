import { MOBILE } from "../constants/string.constants";
import { DataInterface } from "../interface/data.interface";
import { app } from "./chrome";

//   common
const core = {
  register: {
    netrequest: async function (data: DataInterface) {
      await app.netrequest?.display.badge.text(false);
      await app.netrequest?.rules.remove.by.action.type(
        "modifyHeaders",
        "requestHeaders"
      );
      /*  */
      if (data.deviceType === MOBILE) {
        if (data.userAgent) {
          app.netrequest?.rules.push({
            action: {
              type: "modifyHeaders",
              requestHeaders: [
                {
                  operation: "set",
                  header: "user-agent",
                  value: data.userAgent,
                },
              ],
            },
            condition: {
              urlFilter: "www.bing.com/*",
              resourceTypes: [
                "ping",
                "other",
                "websocket",
                "sub_frame",
                "csp_report",
                "main_frame",
                "xmlhttprequest",
              ],
            },
          });
          /*  */
          await app.netrequest?.rules.update();
        }
      }
    },
  },
  action: {
    changeUA: async function (data: DataInterface) {
      return await core.register.netrequest(data);
    },
  },
};

export { core };
