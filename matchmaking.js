// =====================================
// MatchAce AI MatchMaking v2
// =====================================

function shuffle(array){

    const copy=[...array];

    for(let i=copy.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

　　　　　[copy[i],copy[j]] = [copy[j], copy[i]];

    }

    return copy;

}

function average(team){

    return (team[0].rate+team[1].rate)/2;

}

function scoreCourt(court){

    const teamA=[court.a1,court.a2];
    const teamB=[court.b1,court.b2];

    const rateDiff=Math.abs(
        average(teamA)-average(teamB)
    );

    let score=rateDiff;

    score+=pairPenalty(court.a1,court.a2);
    score+=pairPenalty(court.b1,court.b2);

    score+=enemyPenalty(teamA,teamB);

    score+=restPenalty(court.a1);
    score+=restPenalty(court.a2);
    score+=restPenalty(court.b1);
    score+=restPenalty(court.b2);

    return score;

}

function scorePattern(courts){

    let total=0;

    courts.forEach(c=>{

        total+=scoreCourt(c);

    });

    return total;

}

function createPattern(players,courtCount){

    let active=shuffle(players.filter(p=>p.present));

    active.sort((a,b)=>b.rate-a.rate);

    const selected=active.slice(0,courtCount*4);

    const wait=active.slice(courtCount*4);

    let courts=[];

    while(selected.length){

        courts.push({

            a1:selected.shift(),

            a2:selected.pop(),

            b1:selected.shift(),

            b2:selected.pop(),

            scoreA:0,

            scoreB:0

        });

    }

    return{

        courts,

        wait,

        score:scorePattern(courts)

    };

}

function createMatches(players,courtCount){

    let best=null;

    for(let i=0;i<1000;i++){

        const pattern=createPattern(players,courtCount);

        if(best===null || pattern.score<best.score){

            best=pattern;

        }

    }

    return best;

}

// =====================================
// AI Penalty System
// =====================================

function pairPenalty(p1,p2){

    if(!p1.pairHistory) p1.pairHistory={};
    if(!p2.pairHistory) p2.pairHistory={};

    let penalty=0;

    penalty += (p1.pairHistory[p2.id]||0)*120;
    penalty += (p2.pairHistory[p1.id]||0)*120;

    return penalty;

}

function enemyPenalty(teamA,teamB){

    let penalty=0;

    teamA.forEach(a=>{

        if(!a.enemyHistory) a.enemyHistory={};

        teamB.forEach(b=>{

            penalty += (a.enemyHistory[b.id]||0)*60;

        });

    });

    return penalty;

}

function restPenalty(player){

    return -(player.rest||0)*80;

}

