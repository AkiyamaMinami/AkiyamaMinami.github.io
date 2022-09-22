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
  plugins: {
    'sitemap': {
      hostname: 'https://mobs.fun'
    },
  },
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
        text: 'GitHub', 
        link: 'https://github.com/AkiyamaMinami', 
        icon: 'reco-github' 
      },
      { 
        text: 'Home', 
        link: '/about/', 
        icon: 'reco-blog'
      },
    ],
    // 不显示模式调节按钮
    modePicker: false,
    // valine
    valineConfig: {
      // your appId
      appId: "bbOLe8y3lSaOWtIub5FpYWu3-gzGzoHsz",
      // your appKey
      appKey: "vWbPABOU1T22NBboQgGNj6Qv",
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
          collapsable: false,
          children: [
            'javascript/hoist',
            'javascript/block-scope',
            'javascript/execution-context',
            'javascript/call-stack',
            'javascript/this',
            'javascript/closure',
            'javascript/prototype',
            'javascript/setTimeout',
            'javascript/XMLHttpRequest',
            'javascript/promise',
            'javascript/async-await',
            'javascript/shallow-deep-copy',
            'javascript/debounce-throttle',
          ]
        },
        {
          title: 'Browser',
          collapsable: false,
          children: [
            'browser/chrome-thread-process',
            'browser/what-happen-input-url',
            'browser/render-process',
            'browser/render-process-dom-tree',
            'browser/queue-event-loop',
            'browser/macro-micro-task',
            'browser/v8-run-js',
          ]
        },
        {
          title: 'Network',
          collapsable: false,
          children: [
            'network/browser-tcp',
            'network/browser-http',
          ]
        },
        {
          title: 'Vue2',
          collapsable: false,
          children: [
            'vue2/obj_add_attrs'
          ]
        },
        {
          title: 'Algorithm && DataStructure',
          collapsable: false,
          children: [
            'algorithm/leetcode/001',
            'algorithm/leetcode/020',
            'algorithm/leetcode/pointoffer-024'
          ]
        },
      ],
    },
  },
  markdown: {
    lineNumbers: true
  }
};
