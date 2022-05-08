import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { boardState } from "../store/board";

import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from "@atlaskit/modal-dialog";
import { api } from "../appwrite";

import styles from "./AddColumnModal.module.css";

export default function DeleteColumnModal({
  deleteBoardModalVisible,
  activeBoard,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const router = useRouter();
  const { handleSubmit } = useForm();

  useEffect(() => {
    return () => {
      setIsOpen(!isOpen);
    };
  }, [deleteBoardModalVisible]);

  const onSubmit = async (id) => {
    try {
      const board = await api.getBoard(id);
      await api.createActivity(
        JSON.stringify({
          title: board.title,
          type: 1,
          action: 4,
          timestamp: Date(),
        })
      );
      await api.deleteBoard(id);
      closeModal();
      router.reload(window.location.pathname);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <ModalTransition>
        {isOpen && (
          <Modal onClose={closeModal} className={styles.wrapper}>
            <ModalHeader>
              <ModalTitle>Do you want to delete the board?</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit(activeBoard));
                }}
                className={styles.form}
              >
                <p className={styles.title}>
                  The board will be permanently deleted!
                </p>
                <p className={styles.title} d>
                  Proceed?
                </p>

                <ModalFooter>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      closeModal();
                    }}
                    className={styles.cancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.add}>
                    Accept
                  </button>
                </ModalFooter>
              </form>
            </ModalBody>
          </Modal>
        )}
      </ModalTransition>
    </div>
  );
}