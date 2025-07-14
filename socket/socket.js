const { makeid } = require('./utils');
const { getWinner } = require('./gameLogic');
const {
  createRoom,
  deleteRoom,
  getRoom,
  getAllRooms,
  rooms
} = require('./roomManager');

function updateRoomList(io) {
  io.emit('roomList', { roomIds: getAllRooms() });
}

function declareWinner(roomId, io) {
  const room = getRoom(roomId);
  if (!room || !room.p1Choice || !room.p2Choice) return;

  const winner = getWinner(room.p1Choice, room.p2Choice);

  io.to(roomId).emit('result', {
    winner,
    p1Choice: room.p1Choice,
    p2Choice: room.p2Choice
  });

  // Hoặc nếu muốn xoá phòng sau 1 trận:
  deleteRoom(roomId);
  updateRoomList(io);
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected');
    updateRoomList(io);

    // Khi client tạo game mới
    socket.on('createGame', () => {
      const roomId = makeid(6);
      createRoom(roomId);
      socket.join(roomId);
      updateRoomList(io);
      socket.emit('newGame', { roomUniqueId: roomId });
    });

    // Khi client join phòng
    socket.on('joinGame', ({ roomUniqueId }) => {
      const room = getRoom(roomUniqueId);
      if (room) {
        socket.join(roomUniqueId);
        socket.to(roomUniqueId).emit('playersConnected');
        socket.emit('playersConnected');
      }
    });

    // Player 1 chọn
    socket.on('p1Choice', ({ roomUniqueId, kbbChoice }) => {
      const room = getRoom(roomUniqueId);
      if (!room) return;
      room.p1Choice = kbbChoice;
      socket.to(roomUniqueId).emit('p1Choice');

      if (room.p2Choice != null) {
        declareWinner(roomUniqueId, io);
      }
    });

    // Player 2 chọn
    socket.on('p2Choice', ({ roomUniqueId, kbbChoice }) => {
      const room = getRoom(roomUniqueId);
      if (!room) return;
      room.p2Choice = kbbChoice;
      socket.to(roomUniqueId).emit('p2Choice');

      if (room.p1Choice != null) {
        declareWinner(roomUniqueId, io);
      }
    });

    // Ngắt kết nối
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
      for (const roomId in rooms) {
        if (rooms[roomId].masterInRoom === socket.userName) {
          deleteRoom(roomId);
          updateRoomList(io);
          break;
        }
      }
    });

  });
};
