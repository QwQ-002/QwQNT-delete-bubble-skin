import { deleteBubble, log } from "./deleteBubbleSkin.js";

try {
  if (global.IpcInterceptor) {
    IpcInterceptor.onIpcSend(deleteBubble);
    log("已加载");
  } else {
    throw new Error("未找到 IpcInterceptor，请安装前置插件 QWQNT-IpcInterceptor");
  }
} catch (err) {
  log("出现错误：" + err.message);
}
