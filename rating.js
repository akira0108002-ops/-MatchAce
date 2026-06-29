// MatchAce Rating System

const Rating = {

    K: 32,

    expected(ratingA, ratingB) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    },

    update(teamA, teamB, scoreA, scoreB) {

        const rateA = (teamA[0].rate + teamA[1].rate) / 2;
        const rateB = (teamB[0].rate + teamB[1].rate) / 2;

        const expectedA = this.expected(rateA, rateB);
        const expectedB = this.expected(rateB, rateA);

        const actualA = scoreA > scoreB ? 1 : 0;
        const actualB = 1 - actualA;

        const changeA = Math.round(this.K * (actualA - expectedA));
        const changeB = Math.round(this.K * (actualB - expectedB));

        teamA.forEach(player => {
            player.rate += changeA;
            player.played++;
            if (actualA) {
                player.win++;
            } else {
                player.lose++;
            }
        });

        teamB.forEach(player => {
            player.rate += changeB;
            player.played++;
            if (actualB) {
                player.win++;
            } else {
                player.lose++;
            }
        });

        savePlayers();
    }

};