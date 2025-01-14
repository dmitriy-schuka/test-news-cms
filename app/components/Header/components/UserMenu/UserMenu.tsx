import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { Button, Avatar } from "@shopify/polaris";

import Login from '../Login/Login';
import Logout from '../Logout/Logout';
import Signup from '../Signup/Signup';
import { getInitials } from "~/utils/common";

const UserMenu = ({ user }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    user
      ? setModalType("logout")
      : setModalType("login")
  }, [user, setModalType]);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const renderModal = useMemo(() => {
    switch (modalType) {
      case "signup":
        return <Signup closeModal={closeModal}/>
      case "logout":
        return <Logout closeModal={closeModal}/>
      case "login":
        return <Login closeModal={closeModal} setModalType={setModalType}/>
      default:
        return null;
    }
  }, [modalType, setModalType, closeModal]);

  // const initials = user?.name
  //   ? user.name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //   : "U";

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <div>
      <Button variant={"plain"} onClick={openModal} fullWidth size={"large"}>
        {
          user
            ? <Avatar initials={initials} name={user?.firstName || "User"} size={"xl"} />
            : <Avatar customer size={"xl"} />
        }
      </Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay:{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            border: "none",
            background: "none",
            width: "fit-content",
            height: "fit-content",
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
        closeTimeoutMS={300}
        onAfterClose={() => {
          user
            ? setModalType("logout")
            : setModalType("login")
        }}
        // overlayClassName={styles.ReactModal__Overlay}
      >
        {renderModal}
      </Modal>
    </div>
  )
};

export default UserMenu;
