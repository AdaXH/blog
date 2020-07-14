// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'umi-mobile',
        dll: false,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
            /lib\//,
          ],
        },
      },
    ],
  ],
  proxy: {
    '/api': {
      target: 'http://localhost:5050',
      changeOrigin: true,
      pathRewrite: { api: '/' },
    },
  },
};
