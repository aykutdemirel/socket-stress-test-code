'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3008;

var connPerSec = 0;
var msgPerSec = 0;
var totalconnPerSec = 0;
var totalmsgPerSec = 0;

io.on('connect', socket => {
    totalconnPerSec++;
    connPerSec++;
    socket.on('usermessage', msg => {
        io.sockets.in('user').emit('usermessage', msg);
    });

    socket.on('userjoin', msg => {
        socket.join('user');
    });

    socket.on('join', msg => {
        socket.join(msg.roomId);
    });

    socket.on('game', msg => {
        msgPerSec++;
        totalmsgPerSec++;
        io.in(msg.roomId).emit('game', {
            roomId: msg.roomId,
            x: 'TESING WHILE THAT MUCH DATA IS FLOATING',
            y: 'TESING WHILE THAT MUCH DATA IS FLOATING',
            z: 'TESING WHILE THAT MUCH DATA IS FLOATING',
            t: 'TESING WHILE THAT MUCH DATA IS FLOATING'
        });
    });
});

var printCurrentCounts = function() {
    console.log(
        'Cons:' +
        totalconnPerSec +
        'Msgs: ' +
        totalmsgPerSec +
        ' Con per 2sec:' +
        connPerSec +
        'Msg per 2 sec:' +
        msgPerSec
    );
    msgPerSec = 0;
    connPerSec = 0;
    setTimeout(() => printCurrentCounts(), 2000);
};

setTimeout(() => printCurrentCounts(), 2000);
server.listen(port, () => console.log('running on ' + port));