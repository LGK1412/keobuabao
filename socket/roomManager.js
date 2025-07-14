const rooms = {};

function createRoom(roomId) {
    rooms[roomId] = { masterInRoom: null };
}

function deleteRoom(roomId) {
    delete rooms[roomId];
}

function getRoom(roomId) {
    return rooms[roomId];
}

function getAllRooms() {
    return Object.keys(rooms);
}

module.exports = { createRoom, deleteRoom, getRoom, getAllRooms, rooms };
