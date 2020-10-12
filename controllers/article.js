const Article = require('./../dbmodel/Article');
const User = require('./../dbmodel/User');
const {
  parseToken,
  reMapError,
  sendEmail,
  escapeData,
} = require('../common/util');
const { setAllAvatar } = require('../common/apiPrefix');

const routerExports = {};

routerExports.deleteArticle = {
  method: 'post',
  url: '/deleteArticle',
  route: async (ctx, next) => {
    const {
      request: {
        body: { _id: articleId },
      },
    } = ctx;
    try {
      const result = await Article.findByIdAndDelete({ _id: articleId });
      if (result === null) throw '删除失败，文章已不存在';
      ctx.body = {
        success: true,
      };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.queryArticleById = {
  method: 'post',
  url: '/queryArticleById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    try {
      const result = await Article.findOne({ _id });
      const { message } = result;
      const newMsg = await setAllAvatar(message);
      const { year, date, time = '0:0:0' } = result;
      if (/-/.test(date)) {
        result.date = new Date(`${year}-${date}/${time}`);
      }
      ctx.body = {
        success: true,
        data: { ...result._doc, message: newMsg.reverse() },
      };
    } catch (error) {
      console.log('error', error);
      ctx.body = { success: false, errorMsg: reMapError(error) };
    }
  },
};

routerExports.saveArticle = {
  method: 'post',
  url: '/saveArticle',
  route: async (ctx, next) => {
    const {
      date,
      year,
      summary,
      type,
      time,
      title = 'title',
      abstract,
    } = ctx.request.body;
    try {
      const saveResult = await new Article({
        time,
        date,
        year,
        summary,
        type,
        viewer: 0,
        title,
        abstract,
      }).save();
      if (!saveResult._id) throw '保存失败';
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.updateArticle = {
  method: 'post',
  url: '/updateArticleViewerById',
  route: async (ctx, next) => {
    const { _id } = ctx.request.body;
    // const newViewer = Number(viewer) + 1
    try {
      // await callUpdateArticleViewer(_id, newViewer)
      const article = await Article.findOne({ _id });
      if (!article) throw '文章不存在';
      await Article.updateOne(
        { _id },
        { $set: { viewer: article.viewer + 1 } },
      );
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.updateArticleById = {
  method: 'post',
  url: '/updateArticleById',
  route: async (ctx, next) => {
    const { _id, summary, title = '', type, abstract } = ctx.request.body;
    try {
      await Article.updateOne(
        { _id },
        { $set: { summary, type, title, abstract } },
      );
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.deleteArticleMsg = {
  method: 'post',
  url: '/deleteArticleMsg',
  route: async (ctx, next) => {
    const { articleId, messageId, userId } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const { _id } = parseToken(authorization);
      const user = await User.findById(_id);
      if (!user.admin && userId !== _id) throw '无权限删除';
      const article = await Article.findById(articleId);
      const message = article.message || [];
      await Article.updateOne(
        { _id: articleId },
        { $set: { message: message.filter((item) => item._id != messageId) } },
      );
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.deleteArticleReplyMsg = {
  method: 'post',
  url: '/deleteArticleReplyMsg',
  route: async (ctx, next) => {
    const { articleId, messageId, userId, repeatId } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const { _id } = parseToken(authorization);
      const user = await User.findById(_id);
      if (!user.admin && userId !== _id) throw '无权限删除';
      const article = await Article.findById(articleId, { message: 1 });
      const message = article._doc.message || [];
      for await (const item of message) {
        if (item._id == messageId) {
          item.repeat = item.repeat.filter((item) => item._id != repeatId);
          break;
        }
      }
      await Article.updateOne(
        { _id: articleId },
        { $set: { message: [...message] } },
      );
      ctx.body = { success: true };
    } catch (error) {
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.discussArticle = {
  method: 'post',
  url: '/discussArticle',
  route: async (ctx) => {
    const { msg, date = Date.now(), articleId, quickReply } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      let tokenParse = {};
      if (!quickReply) {
        tokenParse = parseToken(authorization);
      }
      const newMsg = escapeData(msg);
      const { _id: userId } = tokenParse;
      if (!quickReply && !tokenParse._id) throw '登录过期，请重新登陆';
      const article = await Article.findById(articleId, {
        message: 1,
        title: 1,
      });
      if (!article) throw '文章已不存在';
      const { message } = article;
      let extraData = {};
      if (quickReply) {
        extraData = {
          name: '陌生人',
          avatar: '/upload/user_avatar/default_avatar.jpg',
        };
      }
      if (userId) {
        extraData.userId = userId;
      }
      await Article.updateOne(
        { _id: articleId },
        {
          $set: {
            message: [
              ...message,
              { msg: newMsg, date, quickReply, ...extraData },
            ],
          },
        },
      );
      const saveMsg = await Article.findById(articleId, { message: 1 });
      saveMsg.message = await setAllAvatar(saveMsg.message.reverse());
      const curUser =
        (await User.findById(userId, { name: 1, email: 1 })) || {};
      sendEmail(
        `hi，Ada，文章《${article.title}》评论中有了新的评论～\n
          ${curUser.name || '陌生人'}（${curUser.eamil || 'email'}） 说 ：\n
          “${newMsg}” \n
          详情(pc)：https://adaxh.site/article-detail?id=${articleId}
        `,
        '18668465750@163.com',
        '文章新评论通知',
      );
      ctx.body = { success: true, data: saveMsg };
    } catch (error) {
      console.log('error', error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

routerExports.replyArticleMsg = {
  method: 'post',
  url: '/replyArticleMsg',
  route: async (ctx) => {
    const {
      msg,
      date = Date.now(),
      toRepeatUserId,
      articleId,
      messageId,
    } = ctx.request.body;
    try {
      const {
        headers: { authorization },
      } = ctx;
      const { _id: userId } = parseToken(authorization);
      const article = await Article.findById(articleId, {
        message: 1,
        title: 1,
      });
      if (!article) throw '文章已不存在';
      const { message } = article;
      const newMsg = escapeData(msg);
      for await (const item of message) {
        const { _id, repeat } = item;
        if (_id == messageId) {
          item.repeat = [
            ...repeat,
            { msg: newMsg, date, toRepeatUserId, userId },
          ];
          await Article.updateOne(
            { _id: articleId },
            { $set: { message: [...message] } },
          );
          break;
        }
      }
      const data = await Article.findById(articleId, { message: 1 }).sort({
        _id: -1,
      });
      data.message = await setAllAvatar(data.message.reverse());
      const toRepeatUser = await User.findById(toRepeatUserId);
      const curUser = await User.findById(userId);
      if (toRepeatUser && toRepeatUser.email) {
        sendEmail(
          `hi，${toRepeatUser.name}，你在https://adaxh.site 的文章《${article.title}》评论中有了新的回复～\n
          ${curUser.name} 说 ：\n
          “${newMsg}” \n
          详情(pc)：https://adaxh.site/article-detail?id=${articleId}
        `,
          toRepeatUser.email,
          '文章评论回复通知',
        );
      }
      ctx.body = {
        success: true,
        data,
      };
    } catch (error) {
      console.log('error', error);
      ctx.body = {
        success: false,
        errorMsg: error,
      };
    }
  },
};

module.exports = routerExports;
