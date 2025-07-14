const socket = io();

let roomUniqueId = null;
let player1 = false;

function createGame() {
    player1 = true;
    socket.emit('createGame');
}

function joinGame() {
    roomUniqueId = document.getElementById('roomUniqueId').value;
    socket.emit('joinGame', { roomUniqueId: roomUniqueId });
}

function joinGameList(roomId) {
    roomUniqueId = roomId;
    socket.emit('joinGame', { roomUniqueId: roomUniqueId });
}

socket.on('newGame', (data) => {
    roomUniqueId = data.roomUniqueId;
    document.getElementById('initial').style.display = 'none';

    const copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.innerHTML = 'Sao chép';
    copyButton.className = 'btn btn-outline-secondary mt-2';

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqueId).then(
            () => console.log('Copied to clipboard'),
            (err) => console.error('Copy failed: ', err)
        );
    });

    const waitingArea = document.getElementById('waitingArea');
    waitingArea.innerHTML = `<p class="mb-2">Chờ thằng đối thủ, đưa có cái code <strong>${roomUniqueId}</strong> để nó vào</p>`;
    waitingArea.appendChild(copyButton);
    waitingArea.classList.add(...['bg-light', 'rounded'])
});

socket.on('playersConnected', () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').classList.remove('d-none');
});

function sendChoice(kbbChoice) {
    const choiceEvent = player1 ? 'p1Choice' : 'p2Choice';
    socket.emit(choiceEvent, {
        kbbChoice: kbbChoice,
        roomUniqueId: roomUniqueId
    });

    const playerChoiceButton = document.createElement('button');
    playerChoiceButton.style.display = 'block';
    playerChoiceButton.innerHTML = kbbChoice;
    playerChoiceButton.className = 'btn btn-secondary mt-2';

    const player1Choice = document.getElementById('player1Choice');
    player1Choice.innerHTML = '';
    player1Choice.appendChild(playerChoiceButton);
}

socket.on('p1Choice', (data) => {
    if (!player1) changeOpponentState();
});

socket.on('p2Choice', (data) => {
    if (player1) changeOpponentState();
});

function changeOpponentState() {
    document.getElementById('opponentState').innerHTML = 'Opponent make Choice';
}

socket.on('result', (data) => {
    document.getElementById('opponentState').innerHTML = '';
    const winnerArea = document.getElementById('winnerArea');

    if (data.winner === 'd') {
        winnerArea.innerHTML = '<h3 class="text-warning">Hòa nhau</h3>';
    } else if (data.winner === 'p1') {
        winnerArea.innerHTML = player1
            ? '<h3 class="text-success">You Win</h3>'
            : '<h3 class="text-danger">Opponent Win</h3>';
    } else {
        winnerArea.innerHTML = !player1
            ? '<h3 class="text-success">You Win</h3>'
            : '<h3 class="text-danger">Opponent Win</h3>';
    }

    const opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.style.display = 'block';
    opponentButton.innerHTML = player1 ? data.p2Choice : data.p1Choice;
    opponentButton.className = 'btn btn-outline-danger';

    document.getElementById('player2Choice').appendChild(opponentButton);
});

socket.on('roomList', (data) => {
    const ul = document.createElement('ul');
    ul.className = 'list-group';

    data.roomIds.forEach((roomId) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        const button = document.createElement('button');
        button.textContent = roomId;
        button.className = 'btn btn-sm btn-outline-primary';
        button.onclick = () => joinGameList(roomId);

        li.appendChild(button);
        ul.appendChild(li);
    });

    const listContainer = document.getElementById('room-list-container');
    listContainer.innerHTML = '';
    listContainer.appendChild(ul);
});
