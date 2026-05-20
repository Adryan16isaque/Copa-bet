const dom = {
    render: (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    },
    hide: (id) => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    },
    show: (id, display = 'block') => {
        const el = document.getElementById(id);
        if (el) el.style.display = display;
    }
};
