import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import styled from "styled-components";
import axios from "axios";
import { io } from "socket.io-client";
import { useSocket } from "../../contexts/SocketProvider";
import { useConversations } from "../../contexts/ConversationsProvider";

const MessageInput = ({ selectedConversation, localUser }) => {
    const [focusedInput, setFocusedInput] = useState("false");
    const [inputMessage, setInputMessage] = useState("");
    const { setSelectedConversationMessages, selectedConversationMessages } =
        useConversations();

    const handleClick = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleChange = (e) => {
        setInputMessage(e.target.value);
    };

    const enterSend = (event) => {
        if (event.key === "Enter" && !event.shiftKey && focusedInput) {
            event.preventDefault();
            sendMessage();
        }
    };
    
    const socket = useSocket();

    const sendMessage = async () => {


        const newMessage = {
            content: inputMessage,
            conversationId: selectedConversation._id,
        };

        const config = {
            headers: {
                Authorization: `Bearer ${localUser.token}`,
            },
        };

        const { data } = await axios
            .post(
                `${process.env.REACT_APP_BASE_URL}/api/messages`,
                newMessage,
                config
            )
            .catch((error) => {
                const error_code = JSON.stringify(error.response.data.error);
                console.log(error_code);
                return;
            });
        if (socket) socket.emit("new message", data);
        setInputMessage("");
        setSelectedConversationMessages([
            data,
            ...selectedConversationMessages,
        ]);
    };

    return (
        <Form style={{ display: "relative" }} className="m-0 p-0">
            <Form.Group
                className="p-0 bg-black d-flex rounded"
                style={{ overflow: "auto" }}
            >
                <InputGroup>
                    {/* TO-DO - autoresize textarea with typing extra lines */}
                    <Form.Control
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                        placeholder={selectedConversation && selectedConversation._id}
                        as="textarea"
                        onKeyDown={enterSend}
                        value={inputMessage}
                        className="p-0"
                        onChange={handleChange}
                        style={{
                            background: "transparent",
                            color: "white",
                            border: "0",
                            resize: "none",
                        }}
                    />
                </InputGroup>
                <SendButton className="p-0" onClick={handleClick} type="submit">
                    Send
                </SendButton>
            </Form.Group>
        </Form>
    );
};

const SendButton = styled(Button)`
    height: 50px;
    margin: 0;
`;

export default MessageInput;
