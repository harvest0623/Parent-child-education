// 立即执行函数表达式 (IIFE)
(function(win, doc) {
    const docEl = doc.documentElement;  // 获取 html 元素（根元素）
    const width = docEl.clientWidth;     // 获取 html 元素的客户端宽度（即视口宽度）

    // 设置 html 元素的字体大小为视口宽度的 1/10
    docEl.style.fontSize = width / 10 + 'px';  

    // 监听窗口 resize 事件，当窗口大小改变时重新计算
    win.addEventListener('resize', () => {
        const newWidth = docEl.clientWidth;  // 获取新的视口宽度
        // console.log(newWidth);

        docEl.style.fontSize = newWidth / 10 +'px';  // 重新设置 html 元素的字体大小
    })

    // 设置 body 标签的字体大小为 16px
    doc.body.style.fontSize = '16px';
})(window, document); 