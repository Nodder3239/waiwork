(() => {
  try {
    const runType = ['SIT', 'UAT', 'PROD'].includes(_waiBrowser.getTarget()) ? _waiBrowser.getTarget() : 'DEV';
    if (runType) {
      const objConfig = {
        DEV: {
          projectAccessKey: "x604fok8e1dvh-x39u62m688djnu-x4nnjckqu7v4dr",
          pcode: 36805,
          sampleRate: 100,
          proxyBaseUrl: "https://rum-ap-northeast-2.whatap-browser-agent.io/",
        },
        UAT: {
          projectAccessKey: "x604a5k87b3fq-z37ic76cu36fno-z39lj9h080pdtj",
          pcode: 35373,
          sampleRate: 100,
          proxyBaseUrl: "https://rum-ap-northeast-2.whatap-browser-agent.io/",
        }
      };
      
      if (Object.keys(objConfig).includes(runType)) {
        console.log('runType -> ', runType);
        runAgent(window, document, 'script', 'https://repo.whatap-browser-agent.io/rum/prod/v1/whatap-browser-agent.js', 'WhatapBrowserAgent', '');
      }

      function runAgent(w, h, _a, t, a, b) {
        w = w[a] = w[a] || {
          config: objConfig[runType],
        };
        a = h.createElement(_a);
        a.async = 1;
        a.src = t;
        t = h.getElementsByTagName(_a)[0];
        t.parentNode.insertBefore(a, t);
      }
    }
  } catch (e) {
    console.log(e);
  }
})();
