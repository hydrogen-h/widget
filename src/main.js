class Widget {
    constructor() {
    }

    async initialize({ targetId }) {
        const t = document.getElementById(targetId)

        const iframe = document.createElement('iframe');
        iframe.src = 'http://localhost:8081/me/request-quote-widget'
        iframe.width = '100%';
        iframe.height = '100%';
        t.appendChild(iframe);

        console.log("我是script，我成功引入啦！！！！！")
    }
}


export default new Widget();