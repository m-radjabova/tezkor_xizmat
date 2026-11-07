declare module "*css";
declare module "*.scss";
declare module 'react-slick';
declare module 'slick-carousel/slick/slick.css';
declare module 'slick-carousel/slick/slick-theme.css'

declare module "*.svg" {
    const content: string;
    export default content;
}
declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

declare module "*.json" {
    const value: unknown;
    export default value;
}

interface TelegramWebApp {
    viewportHeight: number;
    viewportStableHeight: number;
    ready(): void;
    expand(): void;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
    onEvent(eventType: 'viewportChanged', eventHandler: () => void): void;
    offEvent(eventType: 'viewportChanged', eventHandler: () => void): void;
    BackButton: {
        show(): void;
        hide(): void;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
    };
}

interface Window {
    Telegram?: {
        WebApp: TelegramWebApp;
    };
}
