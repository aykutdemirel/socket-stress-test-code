import { io } from "socket.io-client"
import { v4 } from "uuid";

const randomName = `client_${v4()}`;
const baseUrl = "ws://35.214.59.213:3000";
const socketOptions = {
    forceNew: false, //use same websocket connection
    auth: {
        token: "1v2e3g4a5n6z7o8n9e"
    },
    transports: ["websocket"]
};

const socket = io(baseUrl, socketOptions);
const feedSocket = io(`${baseUrl}/feed`, socketOptions);
const profileSocket = io(`${baseUrl}/profile`, socketOptions);

//MAIN
socket.on("connect", () => {
    console.log('connected to main.');

    socket.emit("message_sent", { userName: randomName, message: "Hello!" });
});

socket.on("server_identification", (serverName) => {
    console.log(`main socket, connected to server: ${serverName}`);
});

socket.on("message_received", (data) => {
    console.log(`${data.userName} says ${data.message}`);
});

socket.on("user_disconnected", (data) => {
    console.log(`${data} disconnected from main.`);
});

socket.on("connect_error", (err: Error) => {
    console.log(err.message);
});

socket.connect();

//PROFILE
profileSocket.on("connect", () => {
    console.log('connected to profile.');
});

feedSocket.on("server_identification", (serverName) => {
    console.log(`profile socket, connected to server: ${serverName}`);
});

profileSocket.on("profile_follow", (data) => {
    console.log(`${data.userId} followed ${data.followedUserId}.`);
});

profileSocket.on("user_disconnected", (data) => {
    console.log(`${data} disconnected from profile.`);
});

profileSocket.on("connect_error", (err: Error) => {
    console.log(err.message);
});

profileSocket.connect();

//FEED
feedSocket.on("connect", () => {
    console.log('connected to feed.');
});

feedSocket.on("server_identification", (serverName) => {
    console.log(`feed socket, connected to server: ${serverName}`);
});

feedSocket.on("post_create", (data) => {
    console.log(`${data.userId} created ${data.postId}.`);
});

feedSocket.on("post_like", (data) => {
    console.log(`${data.userId} liked ${data.postId}.`);
});

feedSocket.on("user_disconnected", (data) => {
    console.log(`${data} disconnected from feed.`);
});

feedSocket.on("connect_error", (err: Error) => {
    console.log(err.message);
});

feedSocket.connect();

setTimeout(() => {
    profileSocket.emit("profile_page_enter", "profile1");
    //entered feeds page, sees post 1
    feedSocket.emit("feeds_page_enter", ["post1"]);
}, 2000);

setTimeout(() => {
    //scrolled down, sees post2
    feedSocket.emit("post_view", ["post2"]);
    //creates post
    feedSocket.emit("post_create", { userId: randomName, postId: "new post" });
}, 4000);

setTimeout(() => {
    //likes posts
    feedSocket.emit("post_like", { userId: randomName, postId: "post1" });
    feedSocket.emit("post_like", { userId: randomName, postId: "post2" });
    //won't work, did not join that post's room
    feedSocket.emit("post_like", { userId: randomName, postId: "new_post" });
}, 6000);

setTimeout(() => {
    //follows profiles
    profileSocket.emit("profile_follow", { userId: randomName, followedUserId: "profile1" });
    //won't work did not join that profile's room
    profileSocket.emit("profile_follow", { userId: randomName, followedUserId: "profile2" });
}, 8000);

setTimeout(() => {
    //will keep underlying websocket connection open, configured server-side
    profileSocket.emit("user_disconnected", randomName);
}, 12000);

setTimeout(() => {
    //will keep underlying websocket connection open, configured server-side
    feedSocket.emit("user_disconnected", randomName);
}, 14000);

setTimeout(() => {
    //only main socket will close underlying websocket connection, configured server-side
    socket.emit("user_disconnected", randomName);
}, 16000);