const STORAGE_KEY = "matchace_players";

let players = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function savePlayers(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

const screen = document.getElementById("screen");

function renderHome(){

screen.innerHTML=`

<div class="card glass fade">

<h2>👥 プレイヤー登録</h2>

<input id="name" placeholder="名前">

<select id="exp">

<option value="1500">🏸経験者</option>

<option value="1000">🔰初心者</option>

</select>

<button onclick="addPlayer()">

追加

</button>

</div>

<div class="card glass fade">

<h2>📋 本日の参加者</h2>

<div id="playerList"></div>

</div>

<div class="card glass fade">

<h2>🏸 コート数</h2>

<input id="courtCount" type="number" value="1" min="1" max="10">

<button onclick="goMatch()">

マッチメイク開始

</button>

</div>

`;

drawPlayers();

}

function addPlayer(){

const name=document.getElementById("name").value.trim();

const rate=parseInt(document.getElementById("exp").value);

if(name===""){

alert("名前を入力してください");

return;

}

players.push({

id:Date.now(),

name,

rate,

present:true,

played:0,

win:0,

lose:0,

rest:0

});

savePlayers();

renderHome();

}

function drawPlayers(){

const list=document.getElementById("playerList");

list.innerHTML="";

players.forEach((p,index)=>{

list.innerHTML+=`

<div class="player-card">

<div>

<b>${p.name}</b><br>

⭐ ${Math.round(p.rate)}

</div>

<div>

<label>

<input

type="checkbox"

${p.present?"checked":""}

onchange="togglePresent(${index})"

>

参加

</label>

</div>

</div>

`;

});

}

function togglePresent(i){

players[i].present=!players[i].present;

savePlayers();

}

function goMatch(){

    const courtCount = parseInt(
        document.getElementById("courtCount").value
    );

    const result = createMatches(players, courtCount);

    currentCourts = result.courts;

    renderMatchScreen(currentCourts);

}

renderHome();
function renderCourts(result){

let html="";

result.courts.forEach((court,index)=>{

html+=`

<div class="card">

<h2>🏸 コート ${String.fromCharCode(65+index)}</h2>

<div style="text-align:center;font-size:22px;font-weight:bold;margin:15px 0;">

${court.a1.name}<br>

${court.a2.name}

</div>

<div style="text-align:center;font-size:28px;color:#0A84FF;">

VS

</div>

<div style="text-align:center;font-size:22px;font-weight:bold;margin:15px 0;">

${court.b1.name}<br>

${court.b2.name}

</div>

</div>

`;

});

if(result.wait.length){

html+=`

<div class="card">

<h2>🪑 待機</h2>

${result.wait.map(p=>p.name).join("<br>")}

</div>

`;

}

html+=`

<button onclick="renderHome()">

ホームへ戻る

</button>

`;

screen.innerHTML=html;

}
function renderMatchScreen(courts){

    let html = "<h2>🏸 試合中</h2>";

    courts.forEach((court,index)=>{

        html += `
        <div class="card">

            <h3>コート ${String.fromCharCode(65+index)}</h3>

            <div class="team">
                ${court.a1.name}<br>
                ${court.a2.name}
            </div>

            <div class="score-row">

                <button onclick="changeScore(${index},1,-1)">－</button>

                <span id="scoreA${index}">0</span>

                <button onclick="changeScore(${index},1,1)">＋</button>

            </div>

            <hr>

            <div class="team">
                ${court.b1.name}<br>
                ${court.b2.name}
            </div>

            <div class="score-row">

                <button onclick="changeScore(${index},2,-1)">－</button>

                <span id="scoreB${index}">0</span>

                <button onclick="changeScore(${index},2,1)">＋</button>

            </div>

        </div>
        `;

    });

    html += `
    <button onclick="finishMatches()">
        試合終了
    </button>
    `;

    screen.innerHTML = html;

}
let currentCourts = [];

function changeScore(courtIndex, team, delta){

    const court = currentCourts[courtIndex];

    if(team === 1){
        court.scoreA = Math.max(0, (court.scoreA || 0) + delta);
        document.getElementById("scoreA"+courtIndex).innerText = court.scoreA;
    }else{
        court.scoreB = Math.max(0, (court.scoreB || 0) + delta);
        document.getElementById("scoreB"+courtIndex).innerText = court.scoreB;
    }

}

function finishMatches(){

    alert("次回、レート計算と履歴保存を実装します。");

}