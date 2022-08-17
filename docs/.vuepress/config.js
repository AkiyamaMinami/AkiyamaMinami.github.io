module.exports = {
  theme: "reco",
  title: "Mobs Blog",
  description: "slowly slowly",
  // 移动端优化
  head: [
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  // 主题配置
  themeConfig: {
    type: "blog",
    logo: "https://s2.loli.net/2022/07/21/K4R6ZCIUyzxarHQ.png",
    author: "mobs",
    authorAvatar: "https://s2.loli.net/2022/07/21/K4R6ZCIUyzxarHQ.png",
    lastUpdated: 'Last Updated',
    // 首页导航栏
    nav: [
      { 
        text: 'FrontEnd', 
        link: '/frontend/', 
        icon: 'reco-document'
      },
      { 
        text: 'About', 
        link: '/about/', 
        icon: 'reco-account'
      },
      { 
        text: 'GitHub', 
        link: 'https://github.com/AkiyamaMinami', 
        icon: 'reco-github' 
      },
    ],
    // 不显示模式调节按钮
    modePicker: false,
    // valine
    valineConfig: {
      appId: "bbOLe8y3lSaOWtIub5FpYWu3-gzGzoHsz", // your appId
      appKey: "vWbPABOU1T22NBboQgGNj6Qv", // your appKey
      placeholder: '李在赣神魔？',
    },
    // 博客设置
    blogConfig: {
      category: {
        // 在导航栏菜单中所占的位置，默认2
        location: 2,
        // 默认 “分类”
        text: 'Category'
      },
    },
    sidebar: {
      '/frontend/': [
        {
          title: 'JavaScript',
          collapsable: true,
          children: [
            'javascript/hoist',
            'javascript/block-scope',
            'javascript/execution-context',
            'javascript/call-stack',
            'javascript/this',
            'javascript/closure',
            'javascript/prototype',
            'javascript/debounce-throttle',
          ]
        },
        {
          title: 'Browser',
          collapsable: true,
          children: [
            'browser/v8-run-js',
            'browser/chrome-thread-process'
          ]
        },
      ],
    },
  },
  markdown: {
    lineNumbers: true
  }
};
