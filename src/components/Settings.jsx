// packages
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { MdDelete } from "react-icons/md";
// custom components
import PasswordFloatingLabelToggle from "./Auth/PasswordFloatingLabelToggle";
import { useUser } from "../contexts/UserProvider";
import Avatar from "../components/Avatar";
// BS components
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

function Settings() {
    const { localUser, setLocalUser } = useUser();

    // form fields state
    const [personalFields, setPersonalFields] = useState({
        firstName: localUser.name.split(" ")[0],
        lastName: localUser.name.split(" ")[1],
        email: localUser.email,
    });

    const [validity, setValidity] = useState({
        details: "none",
        password: "none",
        file: "none",
        avatar: "none",
    });

    const [passwordFields, setPasswordFields] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [avatar, setAvatar] = useState();

    const [personalLoading, setPersonalLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const handleFile = (file) => {
        setAvatarLoading(true);
        if (file === undefined) {
            console.log("file upload failed");
            setAvatarLoading(false);
            setValidity({
                ...validity,
                file: "invalid",
            });
        }
        if (["image/jpeg", "image/png", "image/jpeg"].includes(file.type)) {
            const data = new FormData();
            data.append("file", file);
            data.append(
                "upload_preset",
                process.env.REACT_APP_CLOUDINARY_PRESET
            );
            data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_NAME);
            fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
                {
                    method: "post",
                    body: data,
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    setAvatar(data.url.toString());
                    setAvatarLoading(false);
                    setValidity({
                        ...validity,
                        file: "valid",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    setAvatarLoading(false);
                                setValidity({
                                    ...validity,
                                    file: "invalid",
                                });
                });
        } else {
            console.log("Wrong file format");
            setAvatarLoading(false);
            setValidity({
                ...validity,
                file: "invalid",
            });
        }
    };

    const handlePersonalInput = (e) => {
        const keyString = e.target.id;
        // remove the 'up' and 'in' prefix from email and password id's
        const key = keyString.substring(keyString.indexOf("-") + 1);
        const value = e.target.value;
        setPersonalFields({ ...personalFields, [key]: value });
    };

    const handlePasswordInput = (e) => {
        const keyString = e.target.id;
        // remove the 'up' and 'in' prefix from email and password id's
        const key = keyString.substring(keyString.indexOf("-") + 1);
        const value = e.target.value;
        setPasswordFields({ ...passwordFields, [key]: value });
    };

    const updateDetails = async (e) => {
        // prevent page refresh
        e.preventDefault();
        setPersonalLoading(true);
        // check for empty fields
        if (
            !personalFields.firstName ||
            !personalFields.lastName ||
            !personalFields.email
        ) {
            console.log("missing field!");
            setPersonalLoading(false);
            return;
        }
        try {
            const details = {
                firstName: personalFields.firstName,
                lastName: personalFields.lastName,
                email: personalFields.email,
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${localUser.token}`,
                },
            };

            // update user
            const { data } = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/users/update-details`,
                details,
                config
            );

            localStorage.setItem("storedUser", JSON.stringify(data));
            localStorage.setItem(
                "welcomeBack",
                JSON.stringify({ email: data.email, name: data.name })
            );
            setPersonalLoading(false);
            const userData = JSON.parse(localStorage.getItem("storedUser"));
            setLocalUser(userData);
        } catch (error) {
            console.log("error: " + error.message);
            setPersonalLoading(false);
        }
    };

    const updatePassword = async (e) => {
        // prevent page refresh
        e.preventDefault();
        setPasswordLoading(true);
        // check for empty fields
        if (
            !passwordFields.oldPassword ||
            !passwordFields.newPassword ||
            !passwordFields.confirmPassword
        ) {
            console.log("missing field!");
            setPasswordLoading(false);
            return;
        }

        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
            console.log("Confirmation password must match new password");
            setPasswordLoading(false);
            return;
        }

        try {
            const details = {
                oldPassword: passwordFields.oldPassword,
                newPassword: passwordFields.newPassword,
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${localUser.token}`,
                },
            };

            // update user
            const { data } = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/users/update-password`,
                details,
                config
            );

            setPasswordFields({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setPasswordLoading(false);
        } catch (error) {
            console.log("error: " + error.message);
            setPasswordLoading(false);
            return;
        }
    };

    const updateAvatar = async (e) => {
        // prevent page refresh
        e.preventDefault();
        setAvatarLoading(true);
        // check for empty fields
        if (!avatar) {
            console.log("Missing Avatar");
            setAvatarLoading(false);
            return;
        }
        try {
            const details = {
                avatar: avatar,
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${localUser.token}`,
                },
            };

            // update user
            const { data } = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/users/update-avatar`,
                details,
                config
            );

            localStorage.setItem("storedUser", JSON.stringify(data));
            localStorage.setItem(
                "welcomeBack",
                JSON.stringify({ email: data.email, name: data.name })
            );
            setAvatarLoading(false);
            const userData = JSON.parse(localStorage.getItem("storedUser"));
            setLocalUser(userData);
        } catch (error) {
            console.log("error: " + error.message);
            setAvatarLoading(false);
        }
    };

    const deleteAvatar = async () => {
        setAvatarLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localUser.token}`,
                },
            };

            // update user
            const { data } = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/users/delete-avatar`,
                {},
                config
            );

            localStorage.setItem("storedUser", JSON.stringify(data));
            localStorage.setItem(
                "welcomeBack",
                JSON.stringify({ email: data.email, name: data.name })
            );

            setAvatarLoading(false);

            const userData = JSON.parse(localStorage.getItem("storedUser"));
            setLocalUser(userData);
        } catch (error) {
            console.log("error: " + error.message);
            setAvatarLoading(false);
            return;
        }
    };

    return (
        <Menu className="p-2 m-0">
            <h2 className="text-white mb-4">Profile Settings</h2>

            {/* UPDATE DETAILS */}
            <Row
                as={Form}
                onClick={updateDetails}
                className="mb-5"
                onSubmit={updateDetails}
            >
                <h3 className="text-white">Personal Details</h3>
                <Col>
                    <Form.Group as={Row} className="p-0 mb-4">
                        <Col>
                            <Form.FloatingLabel
                                as={Row}
                                className="m-0"
                                label="First Name"
                            >
                                <Form.Control
                                    id="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    onChange={handlePersonalInput}
                                    value={personalFields.firstName}
                                />
                            </Form.FloatingLabel>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="p-0 mb-4">
                        <Col>
                            <Form.FloatingLabel
                                as={Row}
                                className="m-0"
                                label="Last Name"
                            >
                                <Form.Control
                                    id="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    onChange={handlePersonalInput}
                                    value={personalFields.lastName}
                                />
                            </Form.FloatingLabel>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="p-0 mb-4">
                        <Col>
                            <Form.FloatingLabel
                                label="Email"
                                as={Row}
                                className="m-0"
                            >
                                <Form.Control
                                    id="up-email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={handlePersonalInput}
                                    value={personalFields.email}
                                />
                            </Form.FloatingLabel>
                        </Col>
                    </Form.Group>
                    <Row className="m-0 p-0">
                        <Col
                            as={Button}
                            xs="auto"
                            variant="primary"
                            type="submit"
                            className="text-white"
                            disabled={personalLoading}
                        >
                            Update Details
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* CHANGE PASSWORD */}
            <Row as={Form} className="p-0 mb-5" onSubmit={updatePassword}>
                <h3 className="text-white">Change Password</h3>
                <Col>
                    <Form.Group as={Row} className="p-0 mb-4">
                        <PasswordFloatingLabelToggle
                            label="Current Password"
                            uniqueId="oldPassword"
                            handleChange={handlePasswordInput}
                            value={passwordFields.oldPassword}
                        />
                    </Form.Group>
                    <Form.Group as={Row} className="p-0 mb-4">
                        <PasswordFloatingLabelToggle
                            label="New Password"
                            uniqueId="newPassword"
                            handleChange={handlePasswordInput}
                            value={passwordFields.newPassword}
                        />
                    </Form.Group>
                    <Form.Group as={Row} className="p-0 mb-4">
                        <PasswordFloatingLabelToggle
                            label="Confirm New Password"
                            uniqueId="confirmPassword"
                            handleChange={handlePasswordInput}
                            value={passwordFields.confirmPassword}
                        />
                    </Form.Group>
                    <Row className="p-0 m-0">
                        <Col
                            as={Button}
                            xs="auto"
                            variant="primary"
                            type="submit"
                            className="text-white"
                            disabled={passwordLoading}
                        >
                            Update Password
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Change Avatar */}
            <h3 className="text-white">Change Avatar</h3>
            <Row className="d-flex flex-row justify-content-center p-4">
                <Col className="p-0 m-0 d-flex flex-column justify-content-end align-items-end">
                    <Avatar
                        url={localUser.avatar}
                        bgc={"black"}
                        size="100px"
                        hideStatus
                    />
                </Col>
                <Col className="p-0 m-0 d-flex flex-column justify-content-end">
                    <StyledIcon
                        className="p-0"
                        size="30px"
                        color="white"
                        onClick={deleteAvatar}
                    />
                </Col>
            </Row>
            <Row
                as={Form}
                onSubmit={updateAvatar}
                name="avatarForm"
                className="p-0 mb-5"
            >
                <Col>
                    <Form.Group
                        as={Col}
                        className="p-0 mb-4"
                        onChange={(e) => handleFile(e.target.files[0])}
                    >
                        <Form.Control
                            id="password"
                            type="file"
                            accept="image/*"
                            isValid={validity.file === "valid" ? true : null}
                            isInvalid={
                                validity.file === "invalid" ? true : null
                            }
                        />
                        <span className="m-0 p-0 text-white">
                            .jpg .jpeg .png - 10mb max
                        </span>
                    </Form.Group>
                    <Row className="p-0 m-0 align-items-center">
                        <Col
                            as={Button}
                            xs="auto"
                            variant={"primary"}
                            type="submit"
                            className="text-white"
                            disabled={avatarLoading}
                        >
                            {avatarLoading && (
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            )}
                            <span className="ms-2">Update Avatar</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Menu>
    );
}

const Menu = styled(Col)`
    background: var(--darkgrey);
`;

const StyledIcon = styled(MdDelete)`
    &:hover {
        cursor: pointer;
    }
`;

export default Settings;
