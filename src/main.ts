interface WidgetConfig {
  targetId: string;
  widgetId: string;
  salt: string;
}

interface WidgetInstance {
  iframe: HTMLIFrameElement;
  container: HTMLDivElement;
}

interface WidgetMessage {
  type: string;
  payload?: any;
}

interface ResizePayload {
  height: number;
}

class Widget {
  private instances: Map<string, WidgetInstance>;
  private readonly DEFAULT_TIMEOUT: number;
  private readonly ALLOWED_ORIGINS: string[];
  private readonly WIDGET_URL: string;

  constructor() {
    this.instances = new Map();
    this.DEFAULT_TIMEOUT = 10000;
    this.ALLOWED_ORIGINS = ["https://staging-app.avitor.ai"];
    this.WIDGET_URL = "https://staging-app.avitor.ai/request-quote-widget";
  }

  /**
   * @param {string} targetId Target element ID
   * @param {string} widgetId Widget identifier
   * @param {string} salt Security salt
   */
  async initialize({ targetId, widgetId, salt }: WidgetConfig): Promise<void> {
    try {
      // 第一步：确保必要参数无误
      if (!targetId || !widgetId || !salt) {
        throw new Error("Required parameters missing");
      }
      // 第二步：在必要参数无误的情况下，确保targetElement存在
      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        throw new Error(`Target element "${targetId}" not found`);
      }

      // 第三步：targetElement存在，即可开始创建targetElement和iframe的控制布局的中间元素
      const container = document.createElement("div");
      container.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 40rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;

      // 健全功能：添加加载指示器
      const loader = this._createLoader();
      container.appendChild(loader);

      // 第四步：创建和设置 iframe
      const iframe = this._createIframe({ widgetId, salt });

      // 健全功能：设置postMessage消息处理
      this._setupMessageHandling(iframe, targetId);

      // 健全功能：处理 iframe 加载，返回iframe加载完成后的promise
      const loadPromise = this._handleIframeLoad(iframe, container, loader);

      // 健全功能：添加超时promise, 返回超时后的promise
      const timeoutPromise = this._createTimeout();

      // 第五步：添加元素到 DOM
      container.appendChild(iframe);
      targetElement.appendChild(container);

      // 健全功能：比较加载和超时快慢
      await Promise.race([loadPromise, timeoutPromise]);

      // 存储实例以便清理
      this.instances.set(targetId, { iframe, container });
    } catch (error) {
      this._handleError(error, targetId);
    }
  }

  private _createIframe({
    widgetId,
    salt,
  }: Omit<WidgetConfig, "targetId">): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    // 使用new URL()创建url更加安全规范
    const url = new URL(this.WIDGET_URL);
    // 使用encodeURIComponent()对参数进行编码，确保了参数值能够正确且安全地传递
    url.searchParams.set("widgetId", encodeURIComponent(widgetId));
    url.searchParams.set("salt", encodeURIComponent(salt));

    iframe.src = url.toString();
    iframe.style.cssText = `
      border: none;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      min-height: 40rem;
    `;

    // 规范iframe的功能
    iframe.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms"
    );
    iframe.setAttribute("referrerPolicy", "origin");
    iframe.setAttribute("loading", "lazy");

    return iframe;
  }

  private _createLoader(): HTMLDivElement {
    const loader = document.createElement("div");
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `;

    const style = document.createElement("style");
    style.textContent =
      "@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }";
    document.head.appendChild(style);

    return loader;
  }

  private _setupMessageHandling(
    frame: HTMLIFrameElement,
    containerId: string
  ): void {
    window.addEventListener("message", (event: MessageEvent) => {
      // 验证消息来源
      if (!this.ALLOWED_ORIGINS.includes(event.origin)) {
        console.warn("Received message from untrusted domain:", event.origin);
        return;
      }

      if (event.data.type === 'resize') {
        const instance = this.instances.get(containerId);
        if (instance?.container) {
          instance.container.style.height = `${event.data.height}rem`;
        }
      }
    });
  }

  private _handleIframeLoad(
    iframe: HTMLIFrameElement,
    container: HTMLDivElement,
    loader: HTMLDivElement
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      iframe.onload = () => {
        loader.remove();
        container.style.opacity = "1";
        resolve();
      };

      iframe.onerror = () => {
        reject(new Error("Failed to load widget"));
      };
    });
  }

  private _createTimeout(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Widget loading timeout"));
      }, this.DEFAULT_TIMEOUT);
    });
  }

  private _handleError(error: Error, targetId: string): void {
    console.error("Widget initialization failed:", error);

    // 清理失败的实例
    this.destroy(targetId);

    // 显示错误 UI
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
          Failed to load widget. Please try again later.
        </div>
      `;
    }
  }

  destroy(targetId: string): void {
    const instance = this.instances.get(targetId);
    if (instance) {
      instance.container.remove();
      this.instances.delete(targetId);
    }
  }

  
}

export default new Widget();

