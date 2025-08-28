import { findEvent } from "./findEvent.js";
import { checkChatType } from "./checkChatType.js";

const log =
  typeof global.Logs === "function"
    ? new global.Logs("移除气泡装扮")
    : (...args) => {
        console.log("[移除气泡装扮]", ...args);
      };

function deleteBubble(...args) {
  // 接收到获取历史消息列表
  const msgList = args[2]?.msgList;
  if (msgList && msgList.length && checkChatType(msgList[0])) {
    // log("命中聊天记录事件");
    deleteBubbleSkin(msgList);
  }
  // 接收到的新消息
  const onRecvMsg = findEvent(args, [
    "nodeIKernelMsgListener/onRecvMsg",
    "nodeIKernelMsgListener/onRecvActiveMsg",
    "nodeIKernelMsgListener/onMsgInfoListUpdate",
    "nodeIKernelMsgListener/onActiveMsgInfoUpdate",
  ]);
  if (onRecvMsg && checkChatType(args?.[2]?.payload?.msgList?.[0])) {
    // log("命中更新聊天记录事件");
    deleteBubbleSkin(args[2].payload.msgList);
  }

  // 转发消息
  const onForwardMsg = findEvent(args, "nodeIKernelMsgListener/onAddSendMsg");
  if (onForwardMsg && checkChatType(args?.[2]?.payload?.msgRecord)) {
    // log("命中自身转发消息事件");
    deleteBubbleSkin([args[2].payload.msgRecord]);
  }
}

function deleteBubbleSkin(msgList) {
  try {
    msgList.forEach((msgItem) => {
      if (msgItem.msgAttrs.get(0)?.vasMsgInfo?.bubbleInfo) {
        msgItem.msgAttrs.get(0).vasMsgInfo.bubbleInfo = {
          bubbleId: 0,
          bubbleDiyTextId: null,
          subBubbleId: null,
          canConvertToText: null,
        };
      }
    });
  } catch (err) {
    log("出现错误：", err);
  }
}

export { deleteBubble, log };
