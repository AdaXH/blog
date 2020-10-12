const Message = require('./../dbmodel/Message');
const User = require('./../dbmodel/User');
const { getJWTPayload, sendEmail, escapeData } = require('../common/util');
const { queryUser, setAllAvatar } = require('../common/apiPrefix');
const routerExports = {};

routerExports.deleteInnerRepeat = {
  method: 'post',
  url: '/deleteInnerRepeat',
  route: async (ctx, next) => {
    const { _id, _parent_id: parentId, toRepeatUserId } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw 'token认证失败';
      const user = await User.findOne({ _id: payload._id });
      if (!user) throw '当前用户不存在或会话已过期';
      if (toRepeatUserId !== payload._id && !user.admin) {
        throw '只能删除自己的回复';
      }
      const curMsg = await Message.findOne({ _id: parentId });
      if (!curMsg) {
        throw '该条回复不存在';
      }
      const repeat = curMsg.repeat.filter((item) => item._id != _id);
      await Message.updateOne(
        { _id: parentId },
        { $set: { repeat: [...repeat] } },
      );
      ctx.body = { success: true, data: repeat };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports._repeatMsg = {
  method: 'post',
  url: '/repeatmsg',
  route: async (ctx) => {
    const { _id, toRepeat, info, toRepeatId } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw 'token认证失败';
      const user = await User.findOne({ _id: payload._id });
      if (!user) throw '当前用户不存在';
      if (payload._id === toRepeatId) throw '请勿回复自己';
      const repeatUserVo = await queryUser({
        userId: toRepeatId,
        name: toRepeat,
      });
      const { name, avatar, eamil } = user;
      const msg = {
        userId: payload._id,
        toRepeat,
        date: Date.now(),
        info: escapeData(info),
        name,
        avatar,
        eamil,
        toRepeatUser: repeatUserVo,
      };
      const currentMsg = await Message.findOne({ _id });
      const newRepeat = [...currentMsg.repeat, msg];
      await Message.updateOne({ _id }, { $set: { repeat: newRepeat } });
      if (repeatUserVo.email) {
        sendEmail(
          `hi，${repeatUserVo.name}，你在https://adaxh.site 的留言板有了新的回复～\n${user.name} 说 ：\n“${info}”
        `,
          repeatUserVo.email,
          '留言回复通知',
        );
      }
      const newMsg = await Message.findOne({ _id });
      newMsg.repeat = await setAllAvatar(newMsg.repeat);
      ctx.body = { success: true, data: { ...newMsg._doc } };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.deleteMsg = {
  method: 'post',
  url: '/deleteMsgById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    try {
      const payload = getJWTPayload(ctx.headers.authorization);
      if (!payload) throw 'token认证失败';
      const currentMsg = await Message.findOne({ _id });
      const user = await User.findOne({ _id: payload._id });
      if (!user) throw '会话已过期';
      if (currentMsg.name === user.name || user.admin) {
        await Message.deleteOne({ _id });
        ctx.body = { success: true };
      } else throw '暂无权限';
    } catch (error) {
      ctx.body = { success: false, errorMsg: error };
    }
  },
};

routerExports._leaveMsg = {
  method: 'post',
  url: '/leaveMsg',
  route: async (ctx) => {
    const { date, content, quickReply = false } = ctx.request.body;
    const newContent = escapeData(content);
    try {
      let user = {
        name: '陌生人',
      };
      let payload = { _id: 'null' };
      if (!quickReply) {
        payload = getJWTPayload(ctx.headers.authorization);
        if (!payload) throw 'token认证失败';
        if (!date || !content) throw '入参错误';
        user = await User.findOne(
          { _id: payload._id },
          { name: 1, avatar: 1, email: 1 },
        );
      }
      const data = await new Message({
        name: user.name,
        date,
        content: newContent,
        repeat: [],
        userId: payload._id,
        ...user,
      }).save();
      if (/default_avatar/.test(data.avatar)) {
        const user =
          payload._id === 'null'
            ? {
                avatar: '/upload/user_avatar/default_avatar.jpg',
              }
            : await User.findOne({ _id: payload._id });
        data.avatar = user.avatar;
      }
      ctx.body = { success: true };
      sendEmail(
        `${user.name}（${user.email}）给你留言了：${newContent}`,
        undefined,
        '留言回复通知',
      );
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports._leaveMsgv2 = {
  method: 'post',
  url: '/leaveMsgv2',
  route: async (ctx) => {
    const { date, content, quickReply = false } = ctx.request.body;
    const newContent = escapeData(content);
    try {
      let user = {
        name: '陌生人',
      };
      let payload = { _id: 'null' };
      if (!quickReply) {
        payload = getJWTPayload(ctx.headers.authorization);
        if (!payload) throw 'token认证失败';
        if (!date || !content) throw '入参错误';
        user = await User.findOne(
          { _id: payload._id },
          { name: 1, avatar: 1, email: 1 },
        );
      }
      const data = await new Message({
        name: user.name,
        date,
        content: newContent,
        repeat: [],
        userId: payload._id,
        ...user,
      }).save();
      if (/default_avatar/.test(data.avatar)) {
        const user =
          payload._id === 'null'
            ? {
                avatar: '/upload/user_avatar/default_avatar.jpg',
              }
            : await User.findOne({ _id: payload._id });
        data.avatar = user.avatar;
      }
      ctx.body = { success: true, data };
      sendEmail(
        `${user.name}（${user.email}）给你留言了：${newContent}`,
        undefined,
        '留言回复通知',
      );
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.getAllMessage = {
  method: 'post',
  url: '/getAllMessage',
  route: async (ctx) => {
    try {
      const { page = 1, pageSize = 10 } = ctx.request.body;
      ctx.body = { success: true };
      const result = await Message.find({})
        .sort({ _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const totalCount = await Message.find().count();
      const msgWithAvatar = await setAllAvatar(result);
      msgWithAvatar.forEach((item) => {
        if (item.repeat) {
          item.repeat = item.repeat.reverse();
        }
      });
      ctx.body = { success: true, data: msgWithAvatar, totalCount };
    } catch (err) {
      ctx.body = {
        success: false,
        errorMsg: err,
      };
    }
  },
};

module.exports = routerExports;
