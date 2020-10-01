const { MusicClient } = require('netease-music-sdk');
const { getRandomLength } = require('../common/util');
const Config = require('./../dbmodel/BlogConfig');
const routerExports = {};

const sdk = new MusicClient();
routerExports['netease/get-comment'] = {
  method: 'get',
  url: '/netease/get-comment',
  route: async (ctx) => {
    try {
      const {
        query: {
          limit = 40,
          keyword = '爱',
          type = 1,
          offset = Math.floor(Math.random() * 20),
        },
      } = ctx;
      const { result = {} } = await sdk.search(
        keyword === 'undefined' ? '爱' : keyword,
        type,
        limit,
        offset,
      );
      let commentObj = { song: {}, comments: [] };
      if (result.songs) {
        for await (const song of result.songs) {
          const res = await sdk.getSongComment(song.id);
          if (res.hotComments && res.hotComments.length) {
            const { id: songId, name: songName } = song;
            commentObj = {
              comments: res.hotComments,
              song: {
                songId,
                songName,
              },
            };
            if (commentObj.comments.length > 3) {
              break;
            }
          }
        }
      }
      const index = getRandomLength(commentObj.comments.length);
      const curComment = commentObj.comments[index < 0 ? 0 : index] || {
        user: {},
      };
      const {
        content,
        user: { nickname: name, avatarUrl },
        commentId,
      } = curComment;
      ctx.body = {
        success: true,
        comment: {
          content,
          commentId,
          name,
          ...commentObj.song,
          avatarUrl,
        },
      };
    } catch (error) {
      console.log('error', error);
      ctx.body = {
        success: false,
        errorMsg: error,
        error,
      };
    }
  },
};
routerExports['/ada/get-comment'] = {
  method: 'get',
  url: '/ada/get-comment',
  route: async (ctx) => {
    try {
      let {
        query: { keyword },
      } = ctx;
      if (!keyword) {
        const [cfg] = (await Config.find({}, { neteaseKeyword: 1 })) || [{}];
        const { neteaseKeyword } = cfg;
        if (neteaseKeyword) {
          const keywordsArr = neteaseKeyword.split(',');
          const idx = getRandomLength(keywordsArr.length);
          keyword = keywordsArr[idx];
        }
      }
      const limit = 40;
      const type = 1;
      const offset = Math.floor(Math.random() * 20);
      const utf8Keyword = decodeURIComponent(keyword).replace(/鲸小萌 /, '');
      const { result = {} } = await sdk.search(
        utf8Keyword,
        type,
        limit,
        offset,
      );
      let commentObj = { song: {}, comments: [] };
      if (result.songs) {
        for await (const song of result.songs) {
          const res = await sdk.getSongComment(song.id);
          if (res.hotComments && res.hotComments.length) {
            const { id: songId, name: songName } = song;
            commentObj = {
              comments: res.hotComments,
              song: {
                songId,
                songName,
              },
            };
            if (commentObj.comments.length > 5) {
              break;
            }
          }
        }
      }
      const index = getRandomLength(commentObj.comments.length);
      const curComment = commentObj.comments[index < 0 ? 0 : index] || {};
      const { content } = curComment;
      if (!content) {
        ctx.body = '糟糕，系统坏了T.T';
        return;
      }
      ctx.body = content;
    } catch (error) {
      console.log('error', error);
      ctx.body = error;
      ctx.body = {
        success: false,
        errorMsg: error,
        error,
      };
    }
  },
};

module.exports = routerExports;
