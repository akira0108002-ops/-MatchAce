// MatchAce AI MatchMaking v1

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

    return array;

}

function average(pair){

    return (pair[0].rate+pair[1].rate)/2;

}

function evaluateMatch(court){

    const a=average([court.a1,court.a2]);

    const b=average([court.b1,court.b2]);

    return Math.abs(a-b);

}

function createMatches(players,courtCount){

    let active=players.filter(p=>p.present);

    shuffle(active);

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

        wait

    };

}