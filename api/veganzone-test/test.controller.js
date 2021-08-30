'use strict';
var io  = require("socket.io-client");
var v4  = require("uuid");
var config = require('./../../config/environment')

const URL = process.env.URL || "http://34.89.90.167";
const MAX_CLIENTS = 1000;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 30;
const EMIT_INTERVAL_IN_MS = 1000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

exports.start = function (req, res) {
    console.log('start controller in this ip =' + config.ip + ', port =' + config.port);
    var veganzoneAdresses = JSON.parse(req.body);

};

exports.run = function (req, res) {

    try {

        console.log('run controller');

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
            res.status(200).send(response);
            throw Error ('it has to be stopped');
        };
        
        setInterval(printReport, 10000);

        */
        
    } catch (err) {
        res.send({ 'result': false, 'error': err });
    }

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
