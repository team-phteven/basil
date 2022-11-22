// libraries
import { useState } from "react";
import styled from "styled-components";
// BS Components
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// Custom Components
import ConversationList from "./ConversationList";
import Settings from "../Settings/Settings";
import Contacts from "../Contacts/Contacts";
import UserMenu from "../UserMenu";

export const MobileConversationsColumn = () => {
    const [menu, setMenu] = useState("Conversations");

    return (
        <ConversationsColumn
            style={{
                boxSizing: "border-box",
                overflow: "hidden",
            }}
            className="conversationColumn"
        >
            <Conversations className="flex-grow-1 m-0 p-0">
                {menu === "Conversations" && <ConversationList />}
                {menu === "Settings" && <Settings />}
                {menu === "Contacts" && <Contacts />}
            </Conversations>
            <UserMenu setMenu={setMenu} menu={menu} />
        </ConversationsColumn>
    );
};

const ConversationsColumn = styled(Col)`
    background: var(--midgrey);
    box-sizing: border-box;
    overflow: hidden;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
`;
const Conversations = styled(Row)`
    overflow-y: auto;
    overflow-x: hidden;
`;
