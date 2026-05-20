const Header = {
    render: async () => {
        // Mocking user for now (Group 1 will handle this)
        const userId = 1;
        const res = await api.get(`/users/${userId}/tickets`);
        const tickets = res.success ? res.data.tickets : 0;

        return `
            <div class="container">
                <h1>Copa Bet 2026 - Grupo 2</h1>
                <p>Usuário: <strong>torcedor</strong> | Tickets: <span id="user-tickets">${tickets}</span></p>
            </div>
        `;
    },
    updateTickets: (count) => {
        const el = document.getElementById('user-tickets');
        if (el) el.innerText = count;
    }
};
