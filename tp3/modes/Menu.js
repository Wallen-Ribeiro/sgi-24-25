class Menu {
    constructor(app) {
        this.app = app;
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'menu';
        document.body.appendChild(this.menuElement);

        this.createMenuItems();
    }

    startGame() {
        console.log('Starting game...');
    }

    openSettings() {
        console.log('Opening settings...');
    }

    exitGame() {
        console.log('Exiting game...');
    }
}

export { Menu };