const path = require('path')
const { version } = require('./package.json')
import pxtorem from 'postcss-pxtorem';
const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, '')
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  theme: "./theme.config.js",
  publicPath: `/${version}/`,
  outputPath: `./dist/${version}`,
  // extraPostCSSPlugins : [
  //   pxtorem( {
  //     rootValue : 16 ,
  //     propWhiteList : [] ,
  //   } ) ,
  // ] ,
  // 接口代理示例
  proxy: {
    "/api": {
      "target": "http://m.pandafun.io",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "/api" }
    },
    "ws://localhost:3000/ws": {
      "target": "ws://m.pandafun.io",
      "changeOrigin": true,
      "pathRewrite": { "^/ws" : "/ws" }
    }
  },
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr",
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ]
    },
    production: {
      "compact": false ,
      extraBabelPlugins: [
        "transform-runtime",
        [
          "import", {
            "libraryName": "antd",
            "style": true
          }
        ]
      ],

    }
  },
  dllPlugin: {
    exclude: ["babel-runtime", "roadhog", "cross-env"],
    include: ["dva/router", "dva/saga", "dva/fetch"]
  }
}
