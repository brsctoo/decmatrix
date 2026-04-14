export default class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) throw new Error('Stack underflow');
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) throw new Error('Stack is empty');
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }

    printStack() {
        return this.items.join(" ");
    }

}