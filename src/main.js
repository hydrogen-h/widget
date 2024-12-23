class Widget {
  constructor() {}

  async initialize({ targetId, widgetId, salt }) {
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://staging-app.avitor.ai/request-quote-widget?widgetId=${widgetId}&salt=${salt}`;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.style.minHeight = "40rem";
      iframe.referrerPolicy = "origin";
      targetElement.appendChild(iframe);
    } else {
      console.error("Target element not found.");
    }
  }
}

export default new Widget();