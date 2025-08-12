import { deleteBubble } from "./deleteBubbleSkin.js";
const log = (...args) => {
  if (global.cacheLogs) {
    global.cacheLogs.push(args);
  }
  console.log("[移除气泡装扮]", ...args);
};

try {
  if (global.IpcInterceptor) {
    IpcInterceptor.onIpcSend(deleteBubble);
    log("已启用");
  } else {
    throw new Error("未找到 IpcInterceptor，请安装前置插件 QWQNT-IpcInterceptor");
  }
} catch (err) {
  log("出现错误：" + err.message);
}
