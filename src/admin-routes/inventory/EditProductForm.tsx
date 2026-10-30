import type { ProductData } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { doc, setDoc } from 'firebase/firestore';
import { type RefObject, useState } from 'react';

import type { FormMessage } from '../../interfaces/FormMessage';

import { db } from '../../firebase/firebase';
import adminModals from '../../styles/common-styles/AdminModals.module.scss';

export function EditProductForm({
  editProductFormRef,
  originalProduct,
}: {
  editProductFormRef: RefObject<HTMLDialogElement>;
  originalProduct: ProductData,
}) {
  const [product, setProduct] = useState<ProductData>(originalProduct);
  const [formMessage, setFormMessage] = useState<FormMessage>({
    message: '',
    type: '',
  });

  const isMissingFields = Object.values(product).some(value => (
    value === '' || value === 0 && true
  ));

  const handleChange = <K extends keyof ProductData>(
    field: K,
    value: ProductData[K],
  ) => {
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
          if (isMissingFields) {
            throw new Error('Please fill out all fields');
          }

          await setDoc(doc(db, 'products', product.docId), product);
          setFormMessage({message: 'Updated successfully!', type: 'success'});
        } catch (error) {
          setFormMessage({message: error.message, type: 'error'});
        }
      }}
    >
      <dialog
        className={adminModals.modal}
        ref={editProductFormRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            Edit product
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Name
              <input
                onChange={event => {
                  const value = event.target.value;

                  handleChange('name', value);
                }}
                type="text"
                value={product.name}
              />
            </label>

            <label className={adminModals.input}>
              Price 
              <input
                onChange={event => {
                  const value = event.target.value;

                  handleChange('price', Number(value));
                }}
                type="text"
                value={product.price}
              />
            </label>

            <label className={adminModals.input}>
              Shelf life 
              <input
                onChange={event => {
                  const value = event.target.value;

                  handleChange('shelfLife', Number(value));
                }}
                type="text"
                value={product.shelfLife}
              />
            </label>
          </div>
        </div>

        {formMessage.message !== '' &&
          <div className={classNames(
            adminModals.formMessage,
            formMessage.type === 'error' ? (
              adminModals.formMessageError
            ) : formMessage.type === 'success' && (
              adminModals.formMessageSuccess
            ),
          )}>
            {formMessage.message}
          </div>
        }

        <div className={adminModals.buttons}>
          <button
            className={adminModals.closeButton}
            onClick={event => {
              event.preventDefault();

              editProductFormRef.current.close();
            }}
          >
            Close
          </button>

          <button
            className={
              classNames(
                isMissingFields ? adminModals.disabledButton : adminModals.confirmButton,
              )
            }
            type="submit"
          >
            Edit
          </button>
        </div>
      </dialog>
    </form>
  );
}

