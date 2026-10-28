import type { Product } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { addDoc, collection } from 'firebase/firestore';
import { type RefObject, useState } from 'react';

import type { FormMessage } from '../../interfaces/FormMessage';

import { products } from '../../constants/firebaseCollectionStrings';
import { db } from '../../firebase/firebase';
import adminModals from '../../styles/common-styles/AdminModals.module.scss';

export function ModalProductsForm({ productFormRef }: { productFormRef: RefObject<HTMLDialogElement> }) {
  const [product, setProduct] = useState<Product>();

  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const handleChange = <K extends keyof Product>(field: K, value: Product[K]) => {
    setProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        try {
          const invalidProduct = Object.entries(product).some(([key, value]) => {
            if (key === 'createdAt') {
              return false;
            } else if (value === '' || value === 0) {
              return true;
            }
          });

          if (invalidProduct) {
            throw new Error('Please fill out all fields.');
          }

          await addDoc(collection(db, products), {
            ...product,
            createdAt: new Date().toISOString(),
          });

          setFormMessage({ message: 'Product added successfully!', type: 'success' });
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
      }}
    >
      <dialog
        className={adminModals.modal}
        ref={productFormRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            Add product
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Product name
              <input
                onChange={(event) => {
                  handleChange('name', event.target.value);
                }}
                type="text"
              />
            </label>
            <label className={adminModals.input}>
              Price
              <input
                onChange={(event) => {
                  handleChange('price', Number(event.target.value));
                }}
                placeholder="Per kg"
                type="text"
              />
            </label>
            <label className={adminModals.input}>
              Shelf life
              <input
                onChange={(event) => {
                  handleChange('shelfLife', Number(event.target.value));
                }}
                placeholder="Days before exp."
                type="text"
              />
            </label>
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

              productFormRef.current.close();
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

