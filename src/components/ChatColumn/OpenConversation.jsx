import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import MessageInput from "./MessageInput";
import { useConversations } from "../../contexts/ConversationsProvider";
import { useUser } from "../../contexts/UserProvider";
import MessageList from "./MessageList";
import { io } from "socket.io-client";
import { useSocket } from "../../contexts/SocketProvider";

const OpenConversation = () => {
    const { localUser } = useUser();
    const {
        selectedConversationMessages,
        selectedConversation,
        setSelectedConversationMessages,
    } = useConversations();

    const [socketConnected, setSocketConnected] = useState(false);

    let selectedConversationComparison;
    var tempMessages = selectedConversationMessages;
    const socket = useSocket();

    useEffect(() => {
        console.log("NEW USE EFFECT HERE");
        console.log("selectedConversation" + selectedConversation);
        console.log(
            "selectedConversationMessages" + selectedConversationMessages
        );

        tempMessages = selectedConversationMessages;
    });

    useEffect(() => {
        socket.emit("setup", localUser.email);

        socket.on("connected", () => {
            setSocketConnected(true);
            console.log("connected");
        });

        socket.on("message received", (newMessageReceived) => {
            console.log("<------message received in frontend!--->");
            if (
                !selectedConversationComparison ||
                selectedConversationComparison._id !==
                    newMessageReceived.conversation._id
            ) {
                // give notif
            } else {
                console.log("else message received hit!!");
                console.log(
                    "current messages in state: " + selectedConversationMessages
                );
                setSelectedConversationMessages([
                    ...tempMessages,
                    newMessageReceived,
                ]);
            }
        });

        return () => {
            socket.off("connected");
        };
    });

    useEffect(() => {
        if (selectedConversation) {
            socket.emit("join conversation", selectedConversation._id);
            selectedConversationComparison = selectedConversation;
        }
        selectedConversationComparison = selectedConversation;
    }, [selectedConversation]);

    // useEffect(() => {
    //     socket.on("message received", (newMessageReceived) => {
    //         console.log("<------message received in frontend!--->");
    //         console.log(newMessageReceived);
    //         if (
    //             !selectedConversationComparison ||
    //             selectedConversationComparison._id !==
    //                 newMessageReceived.conversation._id
    //         ) {
    //             // give notif
    //         } else {
    //             console.log("else message received hit!!");
    //             setSelectedConversationMessages([
    //                 ...selectedConversationMessages,
    //                 newMessageReceived,
    //             ]);
    //         }
    //     });
    // });

    return (
        <>
            <Row className="mb-4 mx-2 flex-grow-1">
                <MessageList messages={selectedConversationMessages} />
            </Row>
            <Row>
                <MessageInput
                    selectedConversation={selectedConversation}
                    localUser={localUser}
                />
            </Row>
        </>
    );
};

export default OpenConversation;
