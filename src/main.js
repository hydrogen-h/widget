import { styles, CLOSE_ICON, MESSAGE_ICON } from "./assets.js";

class Widget {
    constructor(position = "bottom-right") {
        this.position = this.getPosition(position);
        this.open = false;
        this.initialize();
        this.injectStyles();
    }

    position = "";
    open = false;
    widgetContent = null;

    getPosition(position) {
        const [vertical, horizontal] = position.split("-");
        return {
            [vertical]: "30px",
            [horizontal]: "30px",
        };
    }

    async initialize() {
        // const iframe = document.createElement('iframe');
        // iframe.src = 'http://localhost:8081/me/request-quote'
        // iframe.width = '600';
        // iframe.height = '400';
        // document.body.appendChild(iframe);

        console.log("我是script，我成功引入啦！！！！！")


        /**
         * Create and append a div element to the document body
         */
        const container = document.createElement("div");
        container.style.position = "fixed";
        Object.keys(this.position).forEach(
            (key) => (container.style[key] = this.position[key])
        );
        document.body.appendChild(container);

        /**
         * Create a button element and give it a class of button__container
         */
        const buttonContainer = document.createElement("button");
        buttonContainer.classList.add("button__container");

        /**
         * Create a span element for the widget icon, give it a class of `widget__icon`, and update its innerHTML property to an icon that would serve as the widget icon.
         */
        const widgetIconElement = document.createElement("span");
        widgetIconElement.innerHTML = MESSAGE_ICON;
        widgetIconElement.classList.add("widget__icon");
        this.widgetIcon = widgetIconElement;

        /**
         * Create a span element for the close icon, give it a class of `widget__icon` and `widget__hidden` which would be removed whenever the widget is closed, and update its innerHTML property to an icon that would serve as the widget icon during that state.
         */
        const closeIconElement = document.createElement("span");
        closeIconElement.innerHTML = CLOSE_ICON;
        closeIconElement.classList.add("widget__icon", "widget__hidden");
        this.closeIcon = closeIconElement;

        /**
         * Append both icons created to the button element and add a `click` event listener on the button to toggle the widget open and close.
         */
        buttonContainer.appendChild(this.widgetIcon);
        buttonContainer.appendChild(this.closeIcon);
        buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

        /**
         * Create a container for the widget and add the following classes:- `widget__hidden`, `widget__container`
         */
        this.widgetContainer = document.createElement("div");
        this.widgetContainer.classList.add("widget__hidden", "widget__container");

        /**
         * Invoke the `createWidget()` method
         */
        this.createWidgetContent();

        /**
         * Append the widget's content and the button to the container
         */
        container.appendChild(this.widgetContainer);
        container.appendChild(buttonContainer);
    }

    createWidgetContent() {
        this.widgetContainer.innerHTML = `
        <header class="widget__header">
            <h3>Start a search</h3>
            <p>A tool for searching aircraft routes！</p>
        </header>
    `;
    }

    injectStyles() {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
        document.head.appendChild(styleTag);
    }

    toggleOpen() {
        this.open = !this.open;
        if (this.open) {
            this.widgetIcon.classList.add("widget__hidden");
            this.closeIcon.classList.remove("widget__hidden");
            this.widgetContainer.classList.remove("widget__hidden");
        } else {
            this.createWidgetContent();
            this.widgetIcon.classList.remove("widget__hidden");
            this.closeIcon.classList.add("widget__hidden");
            this.widgetContainer.classList.add("widget__hidden");
        }
    }
}

function initializeWidget() {
    return new Widget();
}

initializeWidget();
