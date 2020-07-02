const Listeners = [];

export default class EventHandler {
    static handle (code, data = {}) {
        Listeners.forEach(listener => process.nextTick(() => listener(code, data)));
    }

    static subscribe (callback) {
        Listeners.push(callback);
    }
};