import React, {useEffect, useState, useCallback, useRef} from "react";
import styled from "styled-components";
// 소켓 통신
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {getUserId} from "../shared/Cookie";
import {getCookie} from "../shared/Cookie";
import axios from "axios";
import SelectInput from "@mui/material/Select/SelectInput";

//현재 백엔드분들이 만드신 서버내의 roomId 주소
let stompClient;

const ChatingPage = (props) => {
    const userId = getUserId();

    // 소켓 연결에 필요한 변수
    // console.log(userId); const devTarget = "http://localhost:8080/ws-stomp";
    const devTarget = "http://3.39.0.208:8080/ws-stomp";
    const sock = new SockJS(devTarget);
    const ws = Stomp.over(sock);

    let reconnect = 0;

    const [chatMessage, setChatMessage] = useState("");
    const [list, setList] = useState([]);
    const [test, setTest] = useState('');
    const [roomId, setRoomId] = useState('faaa902e-f2d4-4221-a0ca-e413025f8834');
    const myToken = getCookie("Authorization")

    useEffect(() => {
        connect(roomId);
        return() => {};
    }, []);
    
    // 소켓 연결
    const connect = (roomId) => {
        console.log("connent function")
        ws.connect({}, function (frame) {
            console.log("ws.connect")
            ws.subscribe("/sub/chat/room/" + roomId, (message) => {
                var recv = JSON.parse(message.body);
                //채팅 내역 불러오기
                getMessageList();
                //소켓 연결 후 받은 채팅 출력
                recvMessage(recv);
            });
            ws.send(
                "/pub/chat/message",
                {},
                JSON.stringify({type: 'ENTER', roomId: roomId, sender: userId, message: "구독!", createdAt: ''})
            )
        }, function (error) {
            if (reconnect++ < 5) {
                setTimeout(function () {
                    console.log("connection reconnect");
                    sock = new SockJS(devTarget);
                    ws = Stomp.over(sock);
                    connect();
                }, 10 * 1000);
            }
        })
    };
    // 채팅방 입장시 사용하는 코드들

    const ExitChat = () => {
        console.log(111);
    };

    // 메세지 보내기
    const sendMessage = (test) => {
        ws.send(
            "/pub/chat/message",
            {},
            JSON.stringify({type: 'TALK', roomId: roomId, sender: userId, message: test, createdAt: ''})
        );
        setTest("");
    };

    // 메세지 받기
    const recvMessage = (message) => {
        console.log("recvMessage", message);
        console.log(message.message);
        setList((list) => [
            ...list, {
                nick: message.sender,
                text: message.message
            }
        ]);
    }

    // 저장된 메시지 출력
    const getMessageList = () => {
        axios
            .get(`http://3.39.0.208:8080/chat/message/${roomId}`, {
                headers: {
                    "Authorization": `Bearer ${myToken}`
                }
            })
            .then((res) => {
                let mappedArrayObj = res
                    .data
                    .map(obj => {
                        let newObj = {};
                        newObj['nick'] = obj.sender;
                        newObj['text'] = obj.message;
                        return newObj;
                    });
                setList((list) => mappedArrayObj);
                // dispatch(__loadTeamList(res.data));
            })
            .catch((err) => {
                console.log(err);
            })
        }

    const onChange = (e) => {
        setTest(e.target.value);
    }

    return (
        <React.Fragment>
            <ChatDisplay>
                <ChatRoom>
                    <ChatRoomId>1</ChatRoomId>
                    <ChatRoomBtn onClick={ExitChat}>X</ChatRoomBtn>
                </ChatRoom>
                <ChatContents>
                    {
                        list.map((item, index) => {
                            return (
                                <ChatOnce key={index}>
                                    <ChatUser>
                                        <b
                                            style={{
                                                float: "left",
                                                color: "#000000"
                                            }}>{item.nick}</b>
                                        {/* <span style={{ color: "#fff" }}>시간</span> */}
                                    </ChatUser>
                                    <ChatCon>{item.text}</ChatCon>
                                </ChatOnce>
                            );
                        })
                    }
                </ChatContents>
                <ChatInputMenu>
                    <ChatInput
                        type="text"
                        placeholder="채팅을 입력해주세요"
                        value={test}
                        onChange={onChange}/>
                    <ChatBtn
                        onClick={() => {
                            sendMessage(test);
                        }}/>
                </ChatInputMenu>
            </ChatDisplay>
        </React.Fragment>
    );
}

const ChatDisplay = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  height: 100vh;
  background-color: gray;
  position: fixed;
  left: 0px;
`;
const ChatRoom = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10vh;
`;

const ChatRoomId = styled.div `
  margin-left: 10px;
  font-size: 25px;
  font-weight: bold;
`;
const ChatRoomBtn = styled.button `
  width: 5vh;
  height: 5vh;
  background-color: gray;
  border: 2px solid black;
  border-radius: 25px;
`;
const ChatContents = styled.div `
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 95%;
  height: 85vh;
  font-size: 15px;
  overflow: auto;
`;
const ChatOnce = styled.div `
  &:hover {
    background: #313438;
  }
  float: left;
`;

const ChatUser = styled.div `
  margin-left: 10px;
`;
const ChatCon = styled.div `
  color: black;
  margin-left: 10px;
`;

const ChatInputMenu = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5vh;
  background-color: #ebe6e6;
`;
const ChatInput = styled.input `
  width: 95%;
  font-size:20px;
  margin: 10px 10px;
`;
const ChatBtn = styled.button `
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin-right: 5px;
`;

export default ChatingPage;