import { deleteDoc, doc } from 'firebase/firestore';
import { type RefObject, useEffect, useState } from 'react';

import type { FormMessage } from '../../interfaces/FormMessage';

import { db } from '../../firebase/firebase';
import adminModals from '../../styles/common-styles/AdminModals.module.scss';

interface Props {
  cleanupDataForDialogs: () => void;
  collectionString: string;
  docId: string;
  formRef: RefObject<HTMLDialogElement>;
  identifier: string; // Field to display in confirmation dialog
}

// Dialog for deleting a row in the table of a tabled page
export function DeleteDataDialog({
  cleanupDataForDialogs,
  collectionString,
  docId,
  formRef,
  identifier,
}: Props) {
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: ''});

  useEffect(() => {
    formRef.current.showModal();
  }, [formRef]);

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        try {
          await deleteDoc(doc(db, collectionString, docId));
          setFormMessage({ message: `"${identifier}" has been deleted!`, type: 'success'});
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
    >
      <dialog
        className={adminModals.modal}
        onCancel={() => cleanupDataForDialogs()}
        ref={formRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            Confirm delete
          </div>

          {formMessage.type === 'success' || formMessage.type === 'error' ? (
            <div>{formMessage.message}</div>
          ) : (
            <div>
              Are you sure you want to delete "{identifier}"?
            </div>
          )}
        </div>

        <div className={adminModals.buttons}>
          <button
            className={adminModals.closeButton}
            onClick={event => {
              event.preventDefault();

              cleanupDataForDialogs();
            }}
          >
            {formMessage.type !== '' ? <>Close</> : <>Cancel</>}
          </button>

          {formMessage.type === '' &&
            <button
              className={adminModals.deleteButton}
              type="submit"
            >
              Delete
            </button>
          }
        </div>
      </dialog>
    </form>
  );
}

