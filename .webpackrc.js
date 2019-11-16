const path = require('path')

export default {
    "extraBabelPlugins":[
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": true
    }]
  ],
  "externals":{
    "hljs":"auto"
  },
  "proxy":{
    "/api":{
      "target":"http://localhost:3000",
      "changeOrigin":true,
      "pathRewrite":{"^/api":"/"}
    }
  },
  "alias":{
    "Utils":path.resolve(__dirname,"./src/utils")
  }
 
}
