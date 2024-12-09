class Widget {
    constructor() {
    }

    async initialize({ targetId }) {
        const t = document.getElementById(targetId)
        const iframe = document.createElement('iframe');
        iframe.src = 'https://staging-app.avitor.ai/me/request-quote-widget'
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = 'none'
        iframe.style.minHeight = '40rem'
        t.appendChild(iframe);
    }
}

export default new Widget();