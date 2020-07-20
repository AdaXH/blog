const Article = require('./../dbmodel/Article');
const User = require('./../dbmodel/User');
const { parseToken, reMapError } = require('../common/util');

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
      if (result === null) throw '删除失败，文章不存在';
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
      const { year, date, time = '0:0:0' } = result;
      if (/-/.test(date)) {
        result.date = new Date(`${year}-${date}/${time}`);
      }
      ctx.body = {
        success: true,
        data: result,
      };
    } catch (error) {
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
        { $set: { viewer: article.viewer + 1 } }
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
    const { _id, summary, title = '', type } = ctx.request.body;
    try {
      const updateResult = await Article.updateOne(
        { _id },
        { $set: { summary, type, title } }
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

routerExports.getArticlePageSize = {
  method: 'post',
  url: '/getArticlePageSize',
  route: async (ctx) => {
    const { pageSize, index } = ctx.request.body;
    try {
      const result = await callGetArticlePageSize(pageSize);
      const temp = [...result];
      const data = {
        data: temp.slice(index, pageSize),
      };
      ctx.body = {
        success: true,
        data: data.data,
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

function callGetArticlePageSize() {
  return new Promise((resolve, reject) => {
    Article.find({}, (err, res) => {
      const result = res.sort(
        (a, b) =>
          parseInt((b.year + b.date).replace(/-/g, '')) -
          parseInt((a.year + a.date).replace(/-/g, ''))
      );
      err ? reject([]) : resolve(result);
    });
  });
}

module.exports = routerExports;
