'use strict';
var io  = require("socket.io-client");
var uuid = require('uuid-random');
var config = require('./../../config/environment')
const axios = require('axios');

const URL = process.env.URL || "http://35.246.13.233";
const MAX_CLIENTS = 1;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 30;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;
var continueCheck = true;
var majorStatistics = [];


exports.start = function (req, res) {
    
    console.log('start controller in this ip =' + config.ip + ', port =' + config.port);
    console.log('data.body iplist = ' + req.body.iplist);

    var _res = res;
    let ipList = JSON.parse(req.body.iplist);

    for(var i=0; i<ipList.length; i++) {
        majorStatistics.push({status:false, ip:ipList[i].ip, port:ipList[i].port, data:"", controlGuid: uuid() });
    }

    for(var i=0; i<majorStatistics.length; i++) {
        
        console.log("majorStatistics ====> " + majorStatistics[i].ip + ":" + majorStatistics[i].port + "/api/v1/veganzone-test/run");
        
        axios.post(majorStatistics[i].ip + ":" + majorStatistics[i].port + "/api/v1/veganzone-test/run", {
            controlGuid: majorStatistics[i].controlGuid
        })
        .then(function (response) {

            for(var j = 0; j < majorStatistics.length; j++) {
                console.log("majorStatistics[j].controlGuid ==>" + majorStatistics[j].controlGuid + ", from response => " + response.data.controlGuid);
                if(majorStatistics[j].controlGuid==response.data.controlGuid) {
                    majorStatistics[j].status = true;
                    majorStatistics[j].data = response.data;
                }
            }

            continueCheck = true; 
            
            checkAsyncCalls();
            
            console.log("continueCheck | " + continueCheck);
            if(continueCheck===false) {
                console.log('response öncesi =====>>');
                _res.status(200).send({ 'result': true, "majorStatistics": majorStatistics});
            }

        })
        .catch(function (error) {
            console.log("inrequest error => " + error);
        });
    }
};

function checkAsyncCalls(){
    
    let innerControl = true;

    for(var i = 0; i < majorStatistics.length; i++) {
        console.log("majorStatistics[i].status => " + majorStatistics[i].status);
        if(majorStatistics[i].status===false) {
            innerControl = false;
        }
    }

    if(innerControl===true) {
        continueCheck = false;
    }

}

exports.run = function (req, res) {

    console.log('inside of run controller = ' + config.ip + ', port =' + config.port);
    console.log('req.body.controlGuid = ' + req.body.controlGuid);

    try {
        
        console.log('inside of try');

        /*res.send({
            avgTime: 500,
            ip: config.ip, 
            port: config.port,
            controlGuid: req.body.controlGuid
        }); */

        var createClient = () => {
            console.log('inside create client');
            // for demonstration purposes, some clients stay stuck in HTTP long-polling
            var transports = ["websocket"];
                //Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];
            
            var socket = io(URL, {
                transports,
            });
            
            var randomName = `client_${uuid()}`;
            
            socket.on("disconnect", (reason) => {
                console.log(`disconnect due to ${reason}`);
            });
            
            var messageClientDate = new Date().getTime();

            //MAIN
            socket.on("connect", () => {
                console.log('connected to main.');
                socket.emit("message_sent", { userName: randomName, message: "Hello!", clientTime: messageClientDate });
            });
            
            socket.on("server_identification", (serverName) => {
                console.log(`main socket, connected to server: ${serverName}`);
            });
            
            socket.on("message_received", (data) => {
                packetsSinceLastReport++;
                console.log(`${data.userName} says ${data.message}, client time = ${data.clientTime}, server time = ${data.serverTime}`);
            });
            
            socket.on("user_disconnected", (data) => {
                console.log(`${data} disconnected from main.`);
            });
            
            socket.on("connect_error", (err) => {
                console.log(err.message);
            });
            
            setInterval(() => {
                socket.connect();
            }, EMIT_INTERVAL_IN_MS);
            
            if (++clientCount < MAX_CLIENTS) {
                setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
            }
        };
        
        createClient();
        
        var printReport = () => {

            console.log('inside report');

            var now = new Date().getTime();
            var durationSinceLastReport = (now - lastReport) / 1000;

            var packetsPerSeconds = (
                packetsSinceLastReport / durationSinceLastReport
            ).toFixed(2);
            
            console.log(
                `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
            );
            
            packetsSinceLastReport = 0;
            lastReport = now;

            res.status(200).send({        
                ip: config.ip, 
                port: config.port,
                controlGuid: req.body.controlGuid,
                clientCount: clientCount,
                packetsPerSeconds: packetsPerSeconds
            });

            throw Error ('it has to be stopped');
        };
        
        console.log('before interval');

        setInterval(printReport, 10000);
        
    } catch (err) {
        console.log("what the hell | " + config.ip + ":" + config.port );
        console.log("error | " + err);
        res.send({ 'result': false, 'error': err });
    }
    
}

exports.stopReq = function (req, res) {
    continueCheck = false;
    res.send({ 'result': true });
}


exports.stop = function (req, res) {
    console.log('stop controller');
    try {

        /*const createClient = () => {
        // for demonstration purposes, some clients stay stuck in HTTP long-polling
        const transports = ["websocket"];
            //Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];
        
        const socket = io(URL, {
            transports,
        });
        
        const randomName = `client_${v4()}`;
        
        socket.on("disconnect", (reason) => {
            console.log(`disconnect due to ${reason}`);
        });
        
        //MAIN
        socket.on("connect", () => {
            console.log('connected to main.');
        
            socket.emit("message_sent", { userName: randomName, message: "Hello!" });
        });
        
        socket.on("server_identification", (serverName) => {
            console.log(`main socket, connected to server: ${serverName}`);
        });
        
        socket.on("message_received", (data) => {
                packetsSinceLastReport++;
            console.log(`${data.userName} says ${data.message}`);
        });
        
        socket.on("user_disconnected", (data) => {
            console.log(`${data} disconnected from main.`);
        });
        
        socket.on("connect_error", (err) => {
            console.log(err.message);
        });
        
        setInterval(() => {
            socket.connect();
        }, EMIT_INTERVAL_IN_MS);
        
        if (++clientCount < MAX_CLIENTS) {
            setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
        }
        };
        
        createClient();
        
        const printReport = () => {
        const now = new Date().getTime();
        const durationSinceLastReport = (now - lastReport) / 1000;
        const packetsPerSeconds = (
            packetsSinceLastReport / durationSinceLastReport
        ).toFixed(2);
        
        console.log(
            `client count: ${clientCount} ; average packets received per second: ${packetsPerSeconds}`
        );
        
        packetsSinceLastReport = 0;
        lastReport = now;
        throw Error ('it has to be stopped');
        };
        
        setInterval(printReport, 10000);*/

        res.status(200).send(response);
    } catch (err) {
        res.send({ 'result': false, 'error': err });
    }
};
