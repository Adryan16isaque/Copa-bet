const BetForm = {
    render: (matchId, teamA, teamB) => {
        return `
            <h2>Palpite: ${teamA} vs ${teamB}</h2>
            <form id="bet-form">
                <input type="hidden" name="matchId" value="${matchId}">
                <div class="bet-inputs">
                    <div class="form-group">
                        <label>${teamA}</label>
                        <input type="number" name="goalsTeamA" min="0" value="0" required>
                    </div>
                    <span>X</span>
                    <div class="form-group">
                        <label>${teamB}</label>
                        <input type="number" name="goalsTeamB" min="0" value="0" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%">Confirmar Aposta</button>
            </form>
            <p id="bet-message" style="margin-top: 15px; text-align: center;"></p>
        `;
    }
};
