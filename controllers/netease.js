const { MusicClient } = require("netease-music-sdk");
const { getRandomLength } = require("../common/util");
const routerExports = {};

const sdk = new MusicClient();
routerExports["netease/get-comment"] = {
  method: "get",
  url: "/netease/get-comment",
  route: async ctx => {
    try {
      const {
        query: {
          limit = 3,
          keyword,
          type,
          offset = Math.floor(Math.random() * 10),
        },
      } = ctx;
      const ret = await sdk.search(keyword, type, limit, offset);
      const { playlists } = ret.result;
      const ids = load(playlists);
      let comments = [];
      for await (const item of ids) {
        const res = await sdk.getSongComment(item, limit, offset);
        const { hotComments = [], topComments = [], comments: coms = [] } = res;
        const list = [...hotComments, ...topComments, ...coms];
        if (list) {
          list.forEach(({ content, contentId, user: { nickname } }) => {
            if (content.length > 15) {
              comments.push({ content, contentId, name: nickname });
            }
          });
        }
      }
      const index = getRandomLength(comments.length);
      //   console.log()
      ctx.body = {
        success: true,
        comment: comments[index < 0 ? 0 : index],
      };
    } catch (error) {
      console.log("error", error);
      ctx.body = {
        success: false,
        errorMsg: error,
        error,
      };
    }
  },
};

async function queryFn(keyword, type, comments = [], offset = 1, limit = 1) {
  const ret = await sdk.search(keyword, type, limit, offset);
  const { playlists } = ret.result;
  const ids = load(playlists);
  console.log(comments, offset, limit);
  if (!comments.length) {
    for await (const item of ids) {
      const res = await sdk.getSongComment(item, limit, offset);
      const hotComments = res.hotComments || res.topComments || res.comments;
      console.log("hotComments", hotComments);
      if (hotComments) {
        comments = hotComments.map(
          ({ content, contentId, user: { nickname } }) => ({
            content,
            contentId,
            name: nickname,
          })
        );
      }
    }
    offset += 1;
    limit += 1;
    return await queryFn(keyword, type, comments, offset, limit);
  }
  return comments;
}

function load(result) {
  const temp = [];
  if (result) {
    result.forEach(({ track = {} }) => {
      if (track.id) {
        temp.push(track.id);
      }
    });
  }
  return temp;
}

module.exports = routerExports;
