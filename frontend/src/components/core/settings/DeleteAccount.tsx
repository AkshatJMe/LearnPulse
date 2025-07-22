import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteProfile } from "../../../services/operations/settingsAPI";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DeleteAccountSection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [check, setCheck] = useState(false);
  // @ts-ignore
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="my-10 flex flex-row gap-x-5 rounded-md border border-pink-700 bg-pink-900 p-8 px-6 sm:px-12">
      <div className="flex flex-wrap gap-3">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Delete Account</h2>

          <div className="mt-1 flex flex-col gap-3 text-pink-50 sm:w-3/5">
            <p>Would you like to delete your account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all content associated with it.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 cursor-pointer rounded form-style text-indigo-600"
              checked={check}
              onChange={() => setCheck((prev) => !prev)}
            />

            <button
              type="button"
              className="w-fit italic text-pink-300"
              onClick={onOpen}
            >
              I want to delete my account.
            </button>
          </div>
        </div>
      </div>

      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-red-600">
                Are you absolutely sure?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm">
                  This action is irreversible. All your content and data will be
                  permanently deleted.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" radius="lg" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  radius="lg"
                  isDisabled={!check}
                  onPress={() => {
                    //@ts-ignore
                    dispatch(deleteProfile(token, navigate));
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
