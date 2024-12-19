class Widget {
  constructor() {}

  async initialize({ targetId, widgetId }) {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const iframe = document.createElement("iframe");
      iframe.src = 'https://staging-app.avitor.ai/request-quote-widget';
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.style.minHeight = "40rem";
      iframe.referrerPolicy = "origin";
      targetElement.appendChild(iframe);

      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: "widget-sign",
            data: {
              widgetId: widgetId,
            },
          },
          "*"
        );
      }
    } else {
      console.error("Target element not found.");
    }
  }
}

export default new Widget();