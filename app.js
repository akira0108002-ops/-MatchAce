// =======================================
// MatchAce v2.0
// app.js Part1
// =======================================

const STORAGE_KEY = "matchace_players_v2";

let players = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentMatches = [];
let lockedPairs = [];
let currentScreen = "home";

function savePlayers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

function $(id) {
    return document.getElementById(id);
}

function uid() {
    return Date.now().toString() + Math.random().toString(36).substring(2,8);
}

const screen = document.getElementById("screen");

window.onload = () => {
    renderHome();
};

function renderHome() {

    currentScreen = "home";

    screen.innerHTML = `

<div class="card">

<h2>👥 プレイヤー登録</h2>

<input
id="playerName"
placeholder="名前">

<select id="playerRate">

<option value="1500">🏸経験者</option>

<option value="1000">🔰初心者</option>

</select>

<button
class="primary"
onclick="addPlayer()">

プレイヤー追加

</button>

</div>

<div class="card">

<h2>

参加メンバー

(${players.filter(p=>p.present).length})

</h2>

<div id="playerList">

</div>

</div>

<div class="card">

<h2>

コート数

</h2>

<input
type="number"
id="courtCount"
min="1"
max="8"
value="1">

<button
class="primary"
onclick="startMatchMaking()">

AIマッチメイク

</button>

<button

class="primary"

onclick="lockPair()">

🔒 ペア固定

</button>
</div>

`;

    renderPlayerList();

}

function renderPlayerList(){

    const list = $("playerList");

    list.innerHTML = "";

    players.forEach((player,index)=>{

        list.innerHTML += `

<div class="player">

<div>

<div class="player-name">

${player.present ? "🟢":"⚪️"}

${player.name}

</div>

<div class="player-rate">

🏸 ${player.played}試合<br>

🏆 ${player.win}勝　❌ ${player.lose}敗<br>

📊 勝率 ${
    player.played
        ? Math.round((player.win / player.played) * 100)
        : 0
}%

</div>

</div>

<div>

<input
type="checkbox"

${player.present?"checked":""}

onchange="togglePresent(${index})">

</div>

</div>

`;

    });

}

function addPlayer(){

    const name = $("playerName").value.trim();

    if(name===""){

        alert("名前を入力してください");

        return;

    }

    players.push({

        id:uid(),

        name:name,

        rate:Number($("playerRate").value),

        present:true,

        played:0,

        win:0,

        lose:0,

        rest:0,

        pairHistory:{},

        enemyHistory:{}

    });

    savePlayers();

    renderHome();

}

function togglePresent(index){

    players[index].present=!players[index].present;

    savePlayers();

}
// =======================================
// MatchAce v2.0
// app.js Part2
// =======================================

function editPlayer(index){

    const newName = prompt(
        "プレイヤー名を変更",
        players[index].name
    );

    if(newName===null) return;

    if(newName.trim()==="") return;

    players[index].name=newName.trim();

    savePlayers();

    renderHome();

}

function deletePlayer(index){

    if(!confirm(players[index].name+" を削除しますか？")) return;

    players.splice(index,1);

    savePlayers();

    renderHome();

}

function startMatchMaking(){

    const active=players.filter(p=>p.present);

    const courtCount=parseInt($("courtCount").value);

    if(active.length<courtCount*4){

        alert(
            `${courtCount}面には${courtCount*4}人必要です`
        );

        return;

    }

    const result=createMatches(players,courtCount);

    currentMatches=result.courts;

    renderMatchScreen();

}

function renderMatchScreen(){

    currentScreen="match";

    let html="";
const waitingPlayers = players.filter(player => {

    return player.present && !currentMatches.some(court =>

        court.a1.id===player.id ||
        court.a2.id===player.id ||
        court.b1.id===player.id ||
        court.b2.id===player.id

    );

});
    currentMatches.forEach((court,index)=>{

        html+=`

<div class="card">

<h2>

🏸 コート ${String.fromCharCode(65+index)}

</h2>

<div class="player-name">

${court.a1.name}

<br>

${court.a2.name}

</div>

<div style="text-align:center;
font-size:26px;
margin:15px 0;
font-weight:bold;">

VS

</div>

<div class="player-name">

${court.b1.name}

<br>

${court.b2.name}

</div>

<br>

<div style="display:flex;
justify-content:space-around;
align-items:center;">

<button
onclick="changeScore(${index},1,-1)">

−

</button>

<div
id="scoreA${index}"
style="font-size:28px;">

0

</div>

<button
onclick="changeScore(${index},1,1)">

＋

</button>

</div>

<br>

<div style="display:flex;
justify-content:space-around;
align-items:center;">

<button
onclick="changeScore(${index},2,-1)">

−

</button>

<div
id="scoreB${index}"
style="font-size:28px;">

0

</div>

<button
onclick="changeScore(${index},2,1)">

＋

</button>

</div>

</div>

`;

    });
if(waitingPlayers.length){

    html += `

<div class="card">

<h2>🪑 待機メンバー</h2>

${waitingPlayers.map(p=>`
<div class="player">
    <div class="player-name">${p.name}</div>
</div>
`).join("")}

</div>

`;

}
    html+=`

<button
class="primary"
onclick="finishMatches()">

試合終了

</button>

<button
class="primary"
onclick="renderHome()">

ホームへ戻る

</button>

`;

    screen.innerHTML=html;

}

function changeScore(court,team,diff){

    if(team===1){

        currentMatches[court].scoreA=Math.max(
            0,
            (currentMatches[court].scoreA||0)+diff
        );

        $("scoreA"+court).innerText=
        currentMatches[court].scoreA;

    }else{

        currentMatches[court].scoreB=Math.max(
            0,
            (currentMatches[court].scoreB||0)+diff
        );

        $("scoreB"+court).innerText=
        currentMatches[court].scoreB;

    }

}
// =======================================
// MatchAce v2.0
// app.js Part3
// =======================================

function finishMatches(){

    currentMatches.forEach(court=>{

        const scoreA = court.scoreA || 0;
        const scoreB = court.scoreB || 0;

        if(scoreA===scoreB) return;

        const teamA=[court.a1,court.a2];
        const teamB=[court.b1,court.b2];

        const avgA=(teamA[0].rate+teamA[1].rate)/2;
        const avgB=(teamB[0].rate+teamB[1].rate)/2;

        const expectedA=1/(1+Math.pow(10,(avgB-avgA)/400));
        const expectedB=1-expectedA;

        const actualA=scoreA>scoreB?1:0;
        const actualB=1-actualA;

        const K=32;

        const diffA=Math.round(K*(actualA-expectedA));
        const diffB=Math.round(K*(actualB-expectedB));

        teamA.forEach(player=>{

            player.rate+=diffA;
            player.played++;

            if(actualA){
                player.win++;
            }else{
                player.lose++;
            }

            player.rest=0;

        });

        teamB.forEach(player=>{

            player.rate+=diffB;
            player.played++;

            if(actualB){
                player.win++;
            }else{
                player.lose++;
            }

            player.rest=0;

        });

        updateHistory(teamA,teamB);

    });

    players.forEach(player=>{

        const played=currentMatches.some(c=>
            c.a1.id===player.id||
            c.a2.id===player.id||
            c.b1.id===player.id||
            c.b2.id===player.id
        );

        if(!played){

            player.rest=(player.rest||0)+1;

        }

    });

    savePlayers();

    alert("試合結果を保存しました");

    renderHome();

}

function getRanking(){

    return [...players].sort((a,b)=>b.rate-a.rate);

}

function renderRanking(){

    currentScreen="ranking";

    const ranking=[...players].sort((a,b)=>b.rate-a.rate);

    let html=`

<div class="card">

<h2>🏆 ランキング</h2>

`;

    ranking.forEach((player,index)=>{

        const winRate = player.played
            ? Math.round(player.win/player.played*100)
            : 0;

        html += `

<div class="player">

<div>

<div class="player-name">

${index+1}位　${player.name}

</div>

<div class="player-rate">

🏸 ${player.played}試合<br>

🏆 ${player.win}勝 ${player.lose}敗<br>

📊 勝率 ${winRate}%

</div>

</div>

</div>

`;

    });

    html += `

</div>

<button
class="primary"
onclick="renderHome()">

ホームへ戻る

</button>

`;

    screen.innerHTML = html;

}

document
.getElementById("tabHome")
.onclick=renderHome;

document
.getElementById("tabRank")
.onclick=renderRanking;

function updateHistory(teamA,teamB){

    teamA.forEach(a=>{

        if(!a.pairHistory) a.pairHistory={};
        if(!a.enemyHistory) a.enemyHistory={};

        teamA.forEach(b=>{

            if(a.id!==b.id){

                a.pairHistory[b.id]=(a.pairHistory[b.id]||0)+1;

            }

        });

        teamB.forEach(e=>{

            a.enemyHistory[e.id]=(a.enemyHistory[e.id]||0)+1;

        });

    });

    teamB.forEach(a=>{

        if(!a.pairHistory) a.pairHistory={};
        if(!a.enemyHistory) a.enemyHistory={};

        teamB.forEach(b=>{

            if(a.id!==b.id){

                a.pairHistory[b.id]=(a.pairHistory[b.id]||0)+1;

            }

        });

        teamA.forEach(e=>{

            a.enemyHistory[e.id]=(a.enemyHistory[e.id]||0)+1;

        });

    });

}


function lockPair(){

    const name1 = prompt("1人目の名前");

    if(name1===null) return;

    const name2 = prompt("2人目の名前");

    if(name2===null) return;

    const p1 = players.find(p=>p.name===name1);

    const p2 = players.find(p=>p.name===name2);

    if(!p1 || !p2){

        alert("名前が見つかりません");

        return;

    }

    lockedPairs.push([p1.id,p2.id]);

    alert("固定ペアを登録しました");

}