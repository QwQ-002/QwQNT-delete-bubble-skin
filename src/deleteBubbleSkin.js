import { findEvent } from "./findEvent.js";
import { checkChatType } from "./checkChatType.js";

const log = (...args) => {
  if (global.cacheLogs) {
    global.cacheLogs.push(args);
  }
  console.log("[移除气泡装扮]", ...args);
};

/**
 * 根据配置替换给定参数中的小程序卡片。
 *
 * @param {Array} args - 包含小程序卡片的参数数组。
 * @return {void} 此函数不返回任何值。
 */
function deleteBubble(...args) {
  // 接收到获取历史消息列表
  const msgList = args[2]?.msgList;
  if (msgList && msgList.length && checkChatType(msgList[0])) {
    log("命中聊天记录事件");
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
    log("命中更新聊天记录事件");
    deleteBubbleSkin(args[2].payload.msgList);
  }

  // 转发消息
  const onForwardMsg = findEvent(args, "nodeIKernelMsgListener/onAddSendMsg");
  if (onForwardMsg && checkChatType(args?.[2]?.payload?.msgRecord)) {
    log("命中自身转发消息事件");
    deleteBubbleSkin([args[2].payload.msgRecord]);
  }
}

/**
 * 将给定消息列表中的小程序卡片替换为 replaceArk 函数的结果。
 *
 * @param {Array} msgList - 包含小程序卡片的消息对象数组。
 * @return {void} 此函数不返回任何内容。
 */
function deleteBubbleSkin(msgList) {
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
}

export { deleteBubble };
