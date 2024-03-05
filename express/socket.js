// socket.js
const socketIO = require('socket.io');

const axios = require( 'axios' );
const Room = require('./room');
module.exports = function(server) {
    const io = socketIO(server,{
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      });
 
    
    let players = [];
    let sockets = [];
    let Rooms = [];
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('playerAdd',async (id) => {
            sockets.push(socket);
            players.push(id);
            
            if(players.length >= 2){
                const datas = await getData();
                var player1 = players.shift();
                var player2 = players.shift();
                var socket1 = sockets.shift();
                
                var socket2 = sockets.shift();
               
                var room = new Room(player1,player2,300,socket1,socket2);
                socket1.emit('Matched',datas);
                socket2.emit('Matched',datas);
                Rooms.push(room);
            }
            else{
                socket.emit("waiting",players);
            }
        })
        
        socket.on('RemovePlayer', (id) => {
            const index = players.indexOf(id);
                if (index > -1) { // only splice array when item is found
                        players.splice(index, 1);
                        sockets.splice(index,1) ;// 2nd parameter means remove one item only
            }
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        // Handle other Socket.IO events here
    });
};


async function getData(){
    try {
  
        var datas = [];
        var num = Math.floor(Math.random()*50);
          console.log(num);
          const name = await axios.get(`http://localhost:8000/check/${num}`);
          problemName = name.data.titleSlug;
          problemId = name.data.frontendQuestionId;
          datas.push(num);
          datas.push(problemName);
          datas.push(problemId);
          
          const responseSnipp = await axios.post(`http://localhost:8000/questionSnippets/${problemName}`);
          
          datas.push(responseSnipp.data[6].code);
          datas.push(responseSnipp.data[2].code);
          const response = await axios.get(`http://localhost:8000/questionData/${name.data.titleSlug}/${name.data.frontendQuestionId}`);
    
          datas.push(response.data);
          return datas;
      } catch (error) {
          console.error('Error fetching data:', error);
      }
}