const MatchCard = {
    render: (match) => {
        return `
            <div class="match-card">
                <span class="match-date">${formatters.date(match.match_date)}</span>
                <div class="match-teams">
                    <span>${match.team_a}</span>
                    <span>vs</span>
                    <span>${match.team_b}</span>
                </div>
                <button class="btn btn-primary" onclick="main.openBetModal(${match.id}, '${match.team_a}', '${match.team_b}')">Apostar</button>
            </div>
        `;
    }
};
