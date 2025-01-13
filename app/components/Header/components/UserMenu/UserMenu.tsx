import React, { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { Button, Avatar } from "@shopify/polaris";

import Login from '../Login/Login';
import Logout from '../Logout/Logout';

const UserMenu = ({ user }: { user: { email: string, name: string } | null }) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
    : "U";

  return (
    <div>
      <Button variant={"plain"} onClick={openModal} fullWidth size={"large"}>
        {
          user
            ? <Avatar initials={initials} name={user.name || "User"} size={"xl"} />
            : <Avatar customer size={"xl"} />
        }
      </Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
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
        // overlayClassName={styles.ReactModal__Overlay}
      >
        {
          user
            ? <Logout closeModal={closeModal}/>
            : <Login closeModal={closeModal}/>
        }
      </Modal>
    </div>
  )
};

export default UserMenu;