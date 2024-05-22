import { App } from "vue";
import Button from './button';

// List of components to register globally
const components = [
    Button
];

// Install function to be used with app.use()
const install = (app: App): void => {
    components.forEach(component => {
        app.component(component.name, component);
    });
};

export default {
    install,
};

export * from './button';