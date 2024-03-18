const axios = require( 'axios' );

class Room {
    constructor(player1, player2, durationInSeconds,socket1,socket2,roomid) {
        this.player1 = player1;
        this.player2 = player2;
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.roomid = roomid;
        this.durationInSeconds = durationInSeconds;
        this.timer = null;
        this.isGameStarted = false;
        this.socket1.on('CheckSol', (datas) => {this.checksol(this.socket1,datas)});
        this.socket2.on('CheckSol', (datas) => {this.checksol(this.socket2,datas)});
        this.startGame();
        
    }

    async checksol(socket,data){
        await fetch('http://localhost:8000/solution/checkSol', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response =>response.json()).then( 
          results => {
            console.log(results);
            if(results == 'e'){
                socket.emit('Results', 'Too many attempts please wait a few seconds ');
            }
            else if(results.status_msg === 'Runtime Error' ){
              socket.emit('Results',results.runtime_error);
            }
            else if(results.status_msg === 'Wrong Answer'){
              socket.emit("Results",`Wrong Answer. ${results.total_correct}/${results.total_testcases} testcases passed.     
              Last testcase: ${results.last_testcase}      
              expected output:${results.expected_output}      
              Code output: ${results.code_output} `)    
            }
            else if(results.status_msg === 'Accepted'){
                this.endGame(socket);
                socket.emit('Results',`Correct solution`);
              }
            else{
              socket.emit('Results',`Results :${results} `);
            }
          }
        ).catch(error => socket.emit('Results', 'Too many attempts please wait a few seconds '));
    }

    startGame() {
        if (!this.isGameStarted) {
            this.isGameStarted = true;
            console.log("Game started!");
            this.timer = setTimeout(() => {
                this.endGame(null);
            }, this.durationInSeconds * 1000);
        } else {
            console.log("Game is already started.");
        }
    }
    getSocket(player){
        if(player == this.player1){
            return this.socket1;
        }else if(player == this.player2){
            return this.socket2;
    }
    }

    getid(){
        return this.roomid;
    }
    endGame(socket) {
       if(socket == this.socket1){
        this.socket1.emit('end',this.player1);
        this.socket2.emit('end',this.player1);
       }
       else if (socket == this.socket2){
        this.socket1.emit('end',this.player2);
        this.socket2.emit('end',this.player2);
       }
       else{
        this.socket1.emit('end','timer');
        this.socket2.emit('end','timer');
       }
        console.log("Game ended!");
        this.isGameStarted = false;
        // Check task completion and determine winner
        // For simplicity, let's assume player1 always wins
        console.log(`${this.player1} wins!`);
        clearTimeout(this.timer);
    }
}

// Example usage:
module.exports = Room;