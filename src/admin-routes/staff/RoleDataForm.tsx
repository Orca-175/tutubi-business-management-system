import type { Page, PageData, Role, RoleData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { collection, getDocs, query } from 'firebase/firestore';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { collections } from 'shared/interfaces/firestore-collection-strings';

import type { FormMessage } from '../../interfaces/FormMessage';
import type { Pages, RoleInputFormProps } from './RoleInputFormProps';

import { getCollectionConverter } from '../../firebase/converters/collectionConverter';
import { db } from '../../firebase/firebase';
import adminModals from '../../styles/common-styles/AdminModals.module.scss';
import styles from './RoleDataForm.module.scss';

interface Props extends RoleInputFormProps {
  cleanupDataForDialogs?: () => void;
  formMessage: FormMessage;
  onSubmit: () => void;
  pages: Pages[];
  roleData: Role | RoleData;
  setPages: Dispatch<SetStateAction<Pages[]>>;
  setRoleData: Dispatch<SetStateAction<Role>>;
}

export function RoleDataForm({
  cleanupDataForDialogs,
  formMessage,
  formRef,
  heading,
  onSubmit,
  pages,
  roleData,
  setPages,
  setRoleData,
}: Props) {
  // NOTE:
  // pages is where the form inputs of this component store their values
  // pagesData is from the pages collection
  const [pagesData, setPagesData] = useState<PageData[]>([]);

  const handlePagesChange = <K extends keyof Pages>(index: number, field: K, value: Pages[K]) => {
    setPages(prevPages => {
      const pages = [...prevPages];
      pages[index][field] = value;

      return pages;
    });
  };

  useEffect(() => {
    async function getPagesData() {
      const docs = (await getDocs(query(
        collection(db, collections.pages).withConverter(getCollectionConverter<Page>()),
      ))).docs;
      const data = docs.map(doc => ({ ...doc.data(), docId: doc.id }));

      setPagesData(data);
    }

    getPagesData();
  }, []);

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        onSubmit();
      }}
    >
      <dialog
        className={adminModals.modal}
        onCancel={() => {
          if (cleanupDataForDialogs) {
            cleanupDataForDialogs();
          }
        }}
        ref={formRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            {heading}
          </div>

          <hr />

          <div className={styles.inputsSection}>
            <label className={adminModals.input}>
              Name
              <input
                onChange={(event) => setRoleData(prev => {
                  const newRole = structuredClone(prev);
                  newRole.name = event.target.value;

                  return newRole;
                })}
                type="text"
                value={roleData.name}
              />
            </label>

            <label className={adminModals.input}>
              Description
              <input
                onChange={(event) => setRoleData(prev => {
                  const newRole = structuredClone(prev);
                  newRole.description = event.target.value;

                  return newRole;
                })}
                type="text"
                value={roleData.description}
              />
            </label>
          </div>

          <hr />

          <div className={styles.pagesInputs}>
            {pages.map((page, index) => {
              return (
                <div
                  className={styles.pageInputs}
                  key={page.key}
                >
                  <label className={adminModals.input}>
                    Page name
                    <select
                      onChange={event => handlePagesChange(index, 'docId', event.target.value)}
                      value={page.docId}
                    >
                      <option disabled={true} value="">Select</option>
                      {pagesData && pagesData.map(pageData => {
                        return (
                          <option
                            disabled={pages.some(page => page.docId === pageData.docId)}
                            value={pageData.docId}
                          >
                            {pageData.name}
                          </option>
                        );
                      })}
                    </select>
                  </label>

                  <label className={adminModals.inputCheckbox}>
                    Read
                    <input
                      checked={page.read}
                      onChange={event => handlePagesChange(index, 'read', event.target.checked)}
                      type="checkbox"
                    />
                  </label>

                  <label className={adminModals.inputCheckbox}>
                    Write
                    <input
                      checked={page.write}
                      onChange={event => handlePagesChange(index, 'write', event.target.checked)}
                      type="checkbox"
                    />
                  </label>
                </div>
              );
            })}
          </div>

          <div className={styles.addPageSection}>
            <button
              className={styles.addPageButton}
              onClick={event => {
                event.preventDefault();

                const newPages = [
                  ...pages,
                  { docId: '', key: crypto.randomUUID(), read: false, write: false },
                ];
                setPages(newPages);
              }}
            >
              <BiPlus /> Add Page
            </button>
          </div>
        </div>

        {formMessage.message !== '' &&
          <div
            className={classNames(
              adminModals.formMessage,
              formMessage.type === 'error' ? (
                adminModals.formMessageError
              ) : formMessage.type === 'success' && (
                adminModals.formMessageSuccess
              ),
            )}
          >
            {formMessage.message}
          </div>
        }

        <div className={adminModals.buttons}>
          <button
            className={adminModals.closeButton}
            onClick={event => {
              event.preventDefault();

              formRef.current.close();
              cleanupDataForDialogs?.();
            }}
          >
            Close
          </button>

          <button
            className={adminModals.confirmButton}
            type="submit"
          >
            Submit
          </button>
        </div>
      </dialog>
    </form>
  );
}

