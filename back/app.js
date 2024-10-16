require('dotenv').config()
const express = require('express');
const api = express();
const server = require('http').Server(api)
require('dotenv').config();

/*
 SETUP
*/
const NUMBER_ADDRESS_API = '192.168.0.12'
server.listen(3001, NUMBER_ADDRESS_API,  () => {
	console.info(`Server start on port ${process.env.PORT}`);
});

/*
 SOCKET
*/
const io = require("socket.io")(server, {
	cors: {
		origin: process.env.FRONT_ENDPOINT,
		methods: ["GET", "POST"],
	},
});

const Data = []


io.on('connection', (socket) => {
	io.emit('dataResponse', Data)
	socket.room = socket.handshake.auth.room
	socket.name = socket.handshake.auth.name

	socket.on('createRoom', (socketData) => {
		Data.push({
			idRoom: socketData.idRoom,
			gameId: null,
			player1: {
				id: socketData.player1.id,
				position: {
					x: socketData.player1.position.x,
					z: socketData.player1.position.z
				},
				rotation: socketData.player1.rotation,
				life: socketData.player1.life,
			},
			player2: {
				id: null,
				position: {
					x: null,
					z: null,
				},
				rotation: null,
				life: null,
			}
		})
		io.emit('dataResponse', Data)
	})

	socket.on('joinRoom', (socketData) => {
		const result = Data.filter((room) => room.idRoom === socketData.idRoom)
		const index = Data.indexOf(result[0])
		if (result.length > 0) {
			Data[index].player1.id = socketData.player1.id
			Data[index].player1.position.x = socketData.player1.position.x
			Data[index].player1.position.z = socketData.player1.position.z
			Data[index].player1.rotation = socketData.player1.rotation
			Data[index].player1.life = socketData.player1.life
			Data[index].player2.id = socketData.player2.id
			Data[index].player2.position.x = socketData.player2.position.x
			Data[index].player2.position.z = socketData.player2.position.z
			Data[index].player2.rotation = socketData.player2.rotation
			Data[index].player2.life = socketData.player2.life
			io.emit('dataResponse', Data)
		}

	})

	socket.on("roomReady", async (socketData) => {
		const rooms = Data.filter((room) => room.idRoom === socketData)
		if (rooms.length > 0) {
			io.emit('roomReady', rooms[0])
			const player1 = rooms[0].player1.id
			const player2 = rooms[0].player2.id
			const userIds = [player1, player2];
			const gameName = "wizard_dual";
			const gameType = "1v1"
		}
	})

	socket.on("ennemyLoseHp", async (socketData) => {
		console.log(Data)

		const room = Data.filter((room) => parseInt(room.idRoom)  === parseInt(socketData.idRoom) )
		if (room.length > 0) {
			if (socketData.id === room[0].player1.id) {
				room[0].player2.life = room[0].player2.life - 10
				if (room[0].player2.life === 0) {
					io.emit("finish", {id:room[0].idRoom, winner: room[0].player1.id})
				} else {
					io.emit('ennemyLoseHpSocket', room[0].player2)
				}


			} else {
				room[0].player1.life = room[0].player1.life - 10

				if( room[0].player1.life === 0 ) {
					io.emit("finish", {id:room[0].idRoom, winner: room[0].player2.id})
				} else {
					io.emit('ennemyLoseHpSocket', room[0].player1)
				}
			}
		}
	})

	socket.on("userMove", (socketData) => {
		console.log(Data)
		const room = Data.filter((room) => parseInt(room.idRoom)  === parseInt(socketData.idRoom))

		if (room.length > 0) {

			if (socketData.userId === room[0].player1.id) {
				room[0].player1.position.x = socketData.position.x
				room[0].player1.position.z = socketData.position.z
				room[0].player1.rotation = socketData.rotation
				socket.emit('userMoveSocket', room[0].player2)
			} else {
				room[0].player2.position.x = socketData.position.x
				room[0].player2.position.z = socketData.position.z
				room[0].player2.rotation = socketData.rotation
				socket.emit('userMoveSocket', room[0].player1)
			}

		}
	})

      socket.on('getInformationAboutRoom', (data) => {
          const room = Data.filter((room) => parseInt(room.idRoom)  === parseInt(data.idRoom))
          if (room.length > 0) {
              socket.emit('getInformationAboutRoomSocket', room[0])
          }
      })

	socket.on("enemyShoot", (data) => {
		socket.emit("enemyShootSocket", data)
	})
})