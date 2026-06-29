// MatchAce v1.0

const screen = document.getElementById("screen");

let players = JSON.parse(localStorage.getItem("matchace_players")) || [];

function savePlayers(){
    localStorage.setItem("matchace_players", JSON.stringify(players));
}

function renderHome(){

    screen.innerHTML = `
        <div class="card">

            <h2>プレイヤー管理</h2>

            <input id="playerName" placeholder="プレイヤー名">

            <select id="playerExp">
                <option value="1500">経験者（1500）</option>
                <option value="1000">初心者（1000）</option>
            </select>

            <button onclick="addPlayer()">
                プレイヤー追加
            </button>

        </div>

        <div class="card">

            <h2>登録メンバー</h2>

            <div id="playerList"></div>

        </div>
    `;

    drawPlayers();

}

function addPlayer(){

    const name=document.getElementById("playerName").value.trim();

    const rate=parseInt(document.getElementById("playerExp").value);

    if(name===""){
        alert("名前を入力してください");
        return;
    }

    players.push({

        id:Date.now(),

        name,

        rate,

        played:0,

        win:0,

        lose:0

    });

    savePlayers();

    renderHome();

}

function drawPlayers(){

    const list=document.getElementById("playerList");

    if(players.length===0){

        list.innerHTML="<p>まだ登録されていません</p>";

        return;

    }

    list.innerHTML="";

    players.forEach(p=>{

        list.innerHTML+=`

        <div style="
        display:flex;
        justify-content:space-between;
        padding:12px;
        border-bottom:1px solid #eee;
        ">

            <div>

                <strong>${p.name}</strong><br>

                ⭐ ${p.rate}

            </div>

            <button
            style="
            width:80px;
            "
            onclick="deletePlayer(${p.id})">

            削除

            </button>

        </div>

        `;

    });

}

function deletePlayer(id){

    if(!confirm("削除しますか？")) return;

    players=players.filter(p=>p.id!==id);

    savePlayers();

    renderHome();

}

renderHome();