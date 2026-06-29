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

const courtCount=parseInt(document.getElementById("courtCount").value);

const result=createMatches(players,courtCount);

console.log(result);

alert(

result.courts.length+

"コート作成\n待機 "

+

result.wait.length+

"人"

);

}

renderHome();