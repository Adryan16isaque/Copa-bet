const main = {
    currentTab: 'home',
    userId: 1, // Mocked user

    init: async () => {
        await main.loadHeader();
        await main.loadContent();
        main.setupEventListeners();
    },

    loadHeader: async () => {
        const headerHtml = await Header.render();
        dom.render('header-container', headerHtml);
    },

    loadContent: async () => {
        if (main.currentTab === 'home') {
            await main.loadHome();
        } else {
            await main.loadHistory();
        }
    },

    loadHome: async () => {
        dom.render('content', '<p style="text-align: center;">Carregando partidas...</p>');
        const res = await api.get('/matches');
        if (res.success) {
            const cards = res.data.map(match => MatchCard.render(match)).join('');
            dom.render('content', `<div class="match-list">${cards}</div>`);
        } else {
            dom.render('content', `<p style="color: red; text-align: center;">${res.message}</p>`);
        }
    },

    loadHistory: async () => {
        dom.render('content', '<p style="text-align: center;">Carregando histórico...</p>');
        const res = await api.get(`/bets/history?userId=${main.userId}`);
        if (res.success) {
            const table = HistoryTable.render(res.data);
            dom.render('content', table);
        } else {
            dom.render('content', `<p style="color: red; text-align: center;">${res.message}</p>`);
        }
    },

    setupEventListeners: () => {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                main.currentTab = btn.getAttribute('data-tab');
                main.loadContent();
            });
        });

        // Close modal
        document.querySelector('.close').onclick = () => dom.hide('bet-modal');
        window.onclick = (event) => {
            if (event.target == document.getElementById('bet-modal')) {
                dom.hide('bet-modal');
            }
        };
    },

    openBetModal: (matchId, teamA, teamB) => {
        const formHtml = BetForm.render(matchId, teamA, teamB);
        dom.render('bet-form-container', formHtml);
        dom.show('bet-modal', 'block');

        document.getElementById('bet-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                userId: main.userId,
                matchId: parseInt(formData.get('matchId')),
                goalsTeamA: parseInt(formData.get('goalsTeamA')),
                goalsTeamB: parseInt(formData.get('goalsTeamB'))
            };

            const btn = e.target.querySelector('button');
            btn.disabled = true;
            btn.innerText = 'Processando...';

            const res = await api.post('/bets', data);
            const msgEl = document.getElementById('bet-message');
            
            if (res.success) {
                msgEl.style.color = 'var(--success)';
                msgEl.innerText = res.message;
                Header.updateTickets(res.data.ticketsRemaining);
                setTimeout(() => {
                    dom.hide('bet-modal');
                    if (main.currentTab === 'history') main.loadHistory();
                }, 2000);
            } else {
                msgEl.style.color = 'var(--danger)';
                msgEl.innerText = res.message;
                btn.disabled = false;
                btn.innerText = 'Confirmar Aposta';
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', main.init);
