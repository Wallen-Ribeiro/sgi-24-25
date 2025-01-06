class Mode {
    constructor(contents) {
        this.contents = contents;
    }

    init() {
        throw new Error("init() must be implemented by the mode subclass.");
    }

    update() {
        throw new Error("update() must be implemented by the mode subclass.");
    }

    cleanup() {
        throw new Error("cleanup() must be implemented by the mode subclass.");
    }
}

export { Mode };
