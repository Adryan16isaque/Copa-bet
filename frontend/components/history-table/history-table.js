const HistoryTable = {
    render: (bets) => {
        if (!bets || bets.length === 0) {
            return `<p style="text-align: center; margin-top: 20px;">Você ainda não realizou nenhuma aposta.</p>`;
        }

        const rows = bets.map(bet => {
            let pointsClass = 'points-pending';
            let pointsText = 'Pendente';
            
            if (bet.points !== null) {
                pointsText = `${bet.points} pts`;
                if (bet.points === 10) pointsClass = 'points-success';
                else if (bet.points === 7) pointsClass = 'points-partial';
                else pointsClass = 'points-error';
            }

            return `
                <tr>
                    <td>${formatters.date(bet.match_date)}</td>
                    <td>${bet.team_a} vs ${bet.team_b}</td>
                    <td><strong>${bet.goals_team_a} x ${bet.goals_team_b}</strong></td>
                    <td><span class="points-badge ${pointsClass}">${pointsText}</span></td>
                </tr>
            `;
        }).join('');

        return `
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Data Partida</th>
                        <th>Jogo</th>
                        <th>Seu Palpite</th>
                        <th>Pontos</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }
};
