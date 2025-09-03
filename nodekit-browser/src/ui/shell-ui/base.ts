type EventListenerReference = {
    type: string;
    handler: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
}

export abstract class UIElementBase {
    abstract root: HTMLElement;
    private _listenerRegistry: EventListenerReference[] = [];

    mount(parent: HTMLElement): void {
        parent.appendChild(this.root);
    }

    disable(appearance: 'invisible' | 'visible' | 'dimmed' = 'dimmed'): void {
        this.root.setAttribute('disabled', 'true');
        this.root.style.pointerEvents = 'none';
        this.root.style.userSelect = 'none';

        switch (appearance) {
            case 'invisible':
                this.root.style.opacity = '0';
                break;
            case 'dimmed':
                this.root.style.opacity = '0.3';
                break;
            case 'visible':
                this.root.style.opacity = '1';
                break;
        }

    }
    enable(): void {
        this.root.removeAttribute('disabled');
        this.root.style.pointerEvents = '';
        this.root.style.userSelect = '';
        this.root.style.opacity = '';
    }

    destroy(): void {
        // Call destruction of child elements
        for (const child of this._findChildrenComponents()) {
            child.destroy();
        }

        // Remove the root element from the DOM
        this.root.remove()

        // Remove all event listeners
        this.removeAllEventListeners();
    }

    protected _registerEventListener(
        target: HTMLElement, // Should almost always be this.root or its child
        type:string,
        handler: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void {
        target.addEventListener(type, handler, options);
        this._listenerRegistry.push({ type, handler, options });
    }

    protected _findChildrenComponents(): UIElementBase[] {
        const children: UIElementBase[] = [];

        for (const key of Object.keys(this)) {
            const val = (this as any)[key];
            if (val instanceof UIElementBase) {
                children.push(val);
            } else if (Array.isArray(val) && val.every(v => v instanceof UIElementBase)) {
                children.push(...val);
            }
        }

        return children;
    }

    public removeAllEventListeners(): void {
        for (const { type, handler, options } of this._listenerRegistry) {
            this.root.removeEventListener(type, handler, options);
        }
        this._listenerRegistry = [];

        // Recurse over any child UIComponentBase instances to remove their listeners as well
        for (const child of this._findChildrenComponents()) {
            child.removeAllEventListeners();
        }
    }
}
