import type { Supplier } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { addDoc, collection } from 'firebase/firestore';
import {  type RefObject, useState } from 'react';

import type { FormMessage } from '../../interfaces/FormMessage';

import {  suppliers } from '../../constants/firebaseCollectionStrings';
import { db } from '../../firebase/firebase';
import adminModals from '../../styles/common-styles/AdminModals.module.scss';

export function ModalSuppliersForm({ supplierFormRef }: { supplierFormRef: RefObject<HTMLDialogElement>}) {
  const [supplier, setSupplier] = useState<Supplier>({
    address: {
      barangay: '',
      city: '',
      houseNumber: '',
      region: '',
      street: '',
    },
    businessName: '',
    createdAt: '',
    email: '',
    ownerName: '',
    phone: '',
  });

  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const handleChange = <K extends keyof Supplier>(field: K, value: Supplier[K]) => {
    setSupplier(prev => ({
      ...prev,
      [field]: value,
    }));
  };
 
  const handleChangeAddress = <K extends keyof Supplier['address']>(field: K, value: Supplier['address'][K]) => {
    setSupplier(prev => ({
      ...prev,
      address: {
        ...prev.address,
      [field]: value,
      },
    }));
  };

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          const invalidProduct = Object.entries(supplier).some(([key, value]) => {
            if (key === 'createdAt') {
              return false;
            } else if (value === '' || value === 0) {
              return true;
            }
          });

          if (invalidProduct) {
            throw new Error('Please fill out all fields.');
          }

          await addDoc(collection(db, suppliers), {
            ...supplier,
            createdAt: new Date().toISOString(),
          });

          setFormMessage({ message: 'Supplier added successfully!', type: 'success' });
        } catch (error) {
          setFormMessage({ message: error.message, type: 'error' });
        }
 
      }}
    >
      <dialog
        className={adminModals.modal}
        ref={supplierFormRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            Add supplier
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Business Name
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChange('businessName', value);
                }}
                type="text"
                value={supplier.businessName}
              />
            </label>

            <label className={adminModals.input}>
              Owner Name
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChange('ownerName', value);
                }}
                type="text"
                value={supplier.ownerName}
              />
            </label>
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              House No.
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChangeAddress('houseNumber', value);
                }}
                type="text"
                value={supplier.address.houseNumber}
              />
            </label>
            
            <label className={adminModals.input}>
              Street
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChangeAddress('street', value);
                }}
                type="text"
                value={supplier.address.street}
              />
            </label>

            <label className={adminModals.input}>
              Barangay
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChangeAddress('barangay', value);
                }}
                type="text"
                value={supplier.address.barangay}
              />
            </label>

            <label className={adminModals.input}>
              City
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChangeAddress('city', value);
                }}
                type="text"
                value={supplier.address.city}
              />
            </label>

            <label className={adminModals.input}>
              Region
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChangeAddress('region', value);
                }}
                type="text"
                value={supplier.address.region}
              />
            </label>
          </div>

          <hr />

          <div className={adminModals.inputsSection}>
            <label className={adminModals.input}>
              Email
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChange('email', value);
                }}
                type="text"
                value={supplier.email}
              />
            </label>

            <label className={adminModals.input}>
              Phone
              <input
                onChange={(event) => {
                  const value = event.target.value;
                  handleChange('phone', value);
                }}
                type="text"
                value={supplier.phone}
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

              supplierFormRef.current.close();
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
