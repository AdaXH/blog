const Message = require("./../dbmodel/Message");
const User = require("./../dbmodel/User");
const {
  getJWTPayload,
  timeago,
  reMapError,
  sendEmail,
} = require("../common/util");
const { queryUser, setAllAvatar } = require("../common/apiPrefix");
const routerExports = {};

function escapeMessage(str) {
  if (!str) return "";
  else return str.replace(/<\/?script>/g, "");
}

routerExports.deleteInnerRepeat = {
  method: "post",
  url: "/deleteInnerRepeat",
  route: async (ctx, next) => {
    const { _id, _parent_id } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw "token认证失败";
      const user = await User.findOne({ _id: payload._id });
      if (!user) throw "当前用户不存在或会话已过期";
      const curMsg = await Message.findOne({ _id: _parent_id });
      if (!curMsg) {
        throw "该条回复不存在";
      }
      const repeat = curMsg.repeat.filter(item => item._id != _id);
      const na = curMsg.repeat.filter(item => item._id == _id)[0].name;
      // const result = await deleteInnerRepeat(_id, _parent_id, user.name)
      const curUser = await User.findOne({ name: user.name });
      if (!curUser) throw "用户不存在";
      if (user.name === na || curUser.admin) {
        await Message.updateOne(
          { _id: _parent_id },
          { $set: { repeat: [...repeat] } }
        );
      } else if (user.name !== na) throw "只能删除自己的回复";
      ctx.body = { success: true, data: repeat };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function setAvatar(name) {
  return new Promise(resolve => {
    User.findOne({ name }).then(result => {
      if (result) resolve(result.avatar || "");
      else resolve("");
    });
  });
}

routerExports.getMessageByPageSize = {
  method: "post",
  url: "/getMessageByPageSize",
  route: async ctx => {
    const { pageSize, index } = ctx.request.body;
    try {
      const result = await callGetMessageByPageSize(pageSize);
      const temp = [...result].reverse();
      const data = {
        data: temp.slice(index, pageSize),
      };
      async function setAllAvatar(result) {
        for (let item of result) {
          const avatar = await setAvatar(item.name);
          item.avatar = avatar;
        }
        return result;
      }
      const msgWithAvatar = await setAllAvatar(data.data);
      ctx.body = {
        success: true,
        data: msgWithAvatar,
        total: result.length,
        isOver: result.length <= pageSize,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

function callGetMessageByPageSize() {
  return new Promise((resolve, reject) => {
    Message.find({}, (err, res) => {
      err ? reject([]) : resolve(res);
      let rebuildMsg = [];
      const _result = res.sort((a, b) => {
        const time1 = new Date(
          a.date.replace(/-----/g, " ").replace(/ : /g, ":")
        ).getTime();
        const time2 = new Date(
          b.date.replace(/-----/g, " ").replace(/ : /g, ":")
        ).getTime();
        return time1 - time2;
      });
      for (let item of _result)
        if (item.repeat && item.repeat.length !== 0) {
          for (let item2 of item.repeat) {
            if (item2 && item2 !== null) {
              let temp = new Date(item2.date).getTime();
              item2.date = timeago(temp);
            }
          }
        }
    });
  });
}

routerExports._repeatMsg = {
  method: "post",
  url: "/repeatmsg",
  route: async ctx => {
    const { _id, toRepeat, info } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw "token认证失败";
      const user = await User.findOne({ _id: payload._id });
      if (!user) throw "当前用户不存在";
      if (payload._id === _id) throw "请勿回复自己";
      const repeatUserVo = (await queryUser({ name: toRepeat })) || {};
      const msg = {
        toRepeat,
        date: Date.now(),
        info,
        name: user.name,
        userId: payload._id,
        toRepeatUser: repeatUserVo,
      };
      const currentMsg = await Message.findOne({ _id });
      const newRepeat = [...currentMsg.repeat, msg];
      await Message.updateOne({ _id }, { $set: { repeat: newRepeat } });
      if (repeatUserVo.email) {
        sendEmail(
          `hi，${repeatUserVo.name}，你在https://adaxh.site 的留言板有了新的回复～\n
          ${user.name} 说 ：\n
          “${info}”
        `,
          undefined,
          "留言回复通知"
        );
      }
      const newMsg = await Message.findOne({ _id });
      newMsg.repeat = await setAllAvatar(newMsg.repeat.reverse());
      ctx.body = { success: true, data: { ...newMsg._doc } };
    } catch (error) {
      console.log("error", error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.deleteMsg = {
  method: "post",
  url: "/deleteMsgById",
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw "token认证失败";
      const currentMsg = await Message.findOne({ _id });
      const user = await User.findOne({ _id: payload._id });
      if (!user) throw "会话已过期";
      if (currentMsg.name === user.name || user.admin) {
        await Message.deleteOne({ _id });
        ctx.body = { success: true };
      } else throw "暂无权限";
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports._leaveMsg = {
  method: "post",
  url: "/leaveMsg",
  route: async ctx => {
    const { date, content } = ctx.request.body;
    const newContent = escapeMessage(content);
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw "token认证失败";
      if (!date || !content) throw "入参错误";
      const user = await User.findOne({ _id: payload._id });
      const data = await new Message({
        name: user.name,
        date,
        content: newContent,
        repeat: [],
        userId: payload._id,
      }).save();
      if (/default_avatar/.test(data.avatar)) {
        const user = await User.findOne({ _id: payload._id });
        data.avatar = user.avatar;
      }
      ctx.body = { success: true, data };
      sendEmail(
        `${user.name}（${user.email}）给你留言了：${newContent}`,
        undefined,
        "留言回复通知"
      );
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.superSU = {
  method: "post",
  url: "/supersu",
  route: async ctx => {
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw "nndsnnds";
      const user = await User.findOne({ _id: payload._id });
      if (!user || !user.admin) throw "token error";
      const msgs = await Message.find({});
      msgs.forEach(async item => {
        const { userId, name, _id, repeat } = item;
        if (!userId) {
          const result = await queryUser({ name });
          console.log("result", result);
          if (result.userId) {
            await Message.updateOne(
              { _id },
              {
                $set: { ...result },
              }
            );
          }
          // item.userId = newId;
          // item.avatar = avater;
        }
        if (repeat) {
          const newRepeat = [];
          for await (const i of repeat) {
            const { toRepeatUser, userId } = i;
            if (!toRepeatUser || !toRepeatUser.userId) {
              const newUser = await queryUser({ name: i.toRepeat });
              if (newUser.userId) {
                i.toRepeatUser = { ...toRepeatUser, ...newUser };
              }
            }
            console.log("userId", userId);
            if (!userId) {
              const nUser = await queryUser({ name: i.name });
              const { userId: nId, avatar } = nUser;
              i.userId = nId;
              i.avatar = avatar;
              console.log("nUser", nUser);
            }
            newRepeat.push(i);
          }
          // console.log("newRepeat", newRepeat);
          await Message.updateOne(
            { _id },
            {
              $set: { repeat: newRepeat },
            }
          );
        }
      });
      console.log("msgs", msgs);
      ctx.body = { success: true, msgs };
    } catch (error) {
      console.log("error", error);
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

module.exports = routerExports;
