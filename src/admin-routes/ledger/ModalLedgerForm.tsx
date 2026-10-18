import type { Purchase, Sale } from 'shared/interfaces/firestore-collections';

import classNames from 'classnames';
import { httpsCallable } from 'firebase/functions';
import { type Dispatch, type RefObject, type SetStateAction, useRef, useState } from 'react';

import { functions } from '../../firebase/firebase';
import adminModals from '../../styles/common-styles/AdminModals.module.scss';

interface FormMessage {
  message: string; 
  type: '' | 'error' | 'success';
}

export function ModalLedgerForm({ledgerFormRef}: { ledgerFormRef: RefObject<HTMLDialogElement>}) {
  const [transactionType, setTransactionType] = useState('');

  const [creditAccount, setCreditAccount] = useState('');
  const [debitAccount, setDebitAccount] = useState('');

  const [purchase, setPurchase] = useState<Purchase>({
    createdAt: '',
    price: 0,
    product: '',
    productId: '',
    quantity: 0,
    source: '',
    supplierId: '',
    total: 0,
    transactionId: 0,
  });
  const [sale, setSale] = useState<Sale>({
    createdAt: '',
    customer: 'Walk-in',
    price: 0,
    product: '',
    productId: '',
    quantity: 0,
    total: 0,
    transactionId: 0,
  });

  // Should be 'success', 'error', or ''
  const [formMessage, setFormMessage] = useState<FormMessage>({ message: '', type: '' });

  const addSaleDialogRef = useRef(null);
  const addPurchaseDialogRef = useRef(null);

  const disableNextButton = debitAccount === '' || creditAccount === '' || transactionType === '';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        // TODO: Check for any missing fields

        const recordTransactionToLedger = httpsCallable(functions, 'recordTransactionToLedger');

        try {
          if (transactionType === 'Purchase') {
            const invalidPurchase = Object.entries(purchase).some(([key, value]) => {
              if (key === 'createdAt' || key === 'transactionId') {
                return false;
              }

              if (typeof value === 'string' && value === '') {
                return true;
              } else if (typeof value === 'number' && value === 0) {
                return true;
              }
            });

            if (invalidPurchase) {
              throw new Error('Please fill out all purchase fields.');
            }

            const total = purchase.price * purchase.quantity;

            recordTransactionToLedger({
              credit: {
                account: creditAccount,
                value: total,
              },
              debit: {
                account: debitAccount,
                value: total,
              },
              purchase: purchase,
            });

            setFormMessage({message: 'Purchase successfully added!', type: 'success'});
          } else if (transactionType === 'Sale') {
            const invalidSale = Object.entries(sale).some(([key, value]) => {
              if (key === 'createdAt' || key === 'transactionId') {
                return false;
              }

              if (typeof value === 'string' && value === '') {
                return true;
              } else if (typeof value === 'number' && value === 0) {
                return true;
              }
            });

            if (invalidSale) {
              throw new Error('Please fill out all sale fields.');
            }

            const total = sale.price * sale.quantity;

            recordTransactionToLedger({
              credit: {
                account: creditAccount,
                value: total,
              },
              debit: {
                account: debitAccount,
                value: total,
              },
              sale: sale,
            });
          }

          setFormMessage({message: 'Sale successfully added!', type: 'success'});
        } catch (error) {
          setFormMessage({message: error.message, type: 'error'});
        }
      }}
    >
      {/* Ledger form */}
      <dialog
        className={adminModals.modal}
        ref={ledgerFormRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            Add ledger entry
          </div>

          <hr />

          <div className={adminModals.sectionRow}>
            <div>
              <div className={adminModals.subHeading}>
                Debit
              </div>

              <div className={adminModals.inputsLedgerEntry}>
                <div className={adminModals.input}>
                  <label htmlFor="enterDebitAccount">Account</label>
                  <input
                    onChange={(event) => setDebitAccount(event.target.value)}
                    type="text"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className={adminModals.subHeading}>
                Credit
              </div>

              <div className={adminModals.inputsLedgerEntry}>
                <div className={adminModals.input}>
                  <label htmlFor="enterCreditAccount">Account</label>
                  <input
                    onChange={(event) => setCreditAccount(event.target.value)}
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className={adminModals.input}>
            <label htmlFor="enterType">Transaction type</label>
            <select
              onChange={(event) => {
                const value = event.target.value;

                setTransactionType(value);
              }}
              value={transactionType}
            >
              <option disabled value="">Select</option>
              <option value="Purchase">Purchase</option>
              <option value="Sale">Sale</option>
            </select>
          </div>
        </div>

        {/* Ledger form buttons */}
        <div className={adminModals.buttons}>
          <button
            className={adminModals.closeButton}
            onClick={event => {
              event.preventDefault();

              ledgerFormRef.current.close();
            }}
          >
            Close
          </button>

          <button
            className={
              classNames(
                disableNextButton ? adminModals.disabledButton : adminModals.confirmButton,
              )
            }
            disabled={disableNextButton}
            onClick={event => {
              event.preventDefault();

              ledgerFormRef.current.close();

              if (transactionType === 'Purchase') {
                addPurchaseDialogRef.current.showModal();
              } else if (transactionType === 'Sale') {
                addSaleDialogRef.current.showModal();
              }
            }}
          >
            Next
          </button>
        </div>
      </dialog>

      <ModalPurchaseForm
        addPurchaseDialogRef={addPurchaseDialogRef}
        ledgerFormRef={ledgerFormRef}
        purchase={purchase}
        setPurchase={setPurchase}
      />

      <ModalSaleForm
        addSaleDialogRef={addSaleDialogRef}
        formMessage={formMessage}
        ledgerFormRef={ledgerFormRef}
        sale={sale}
        setSale={setSale}
      />

    </form>
  );
}

function ModalPurchaseForm({
  addPurchaseDialogRef,
  ledgerFormRef,
  purchase,
  setPurchase,
}: {
  addPurchaseDialogRef: RefObject<HTMLDialogElement>;
  ledgerFormRef: RefObject<HTMLDialogElement>;
  purchase: Purchase,
  setPurchase: Dispatch<SetStateAction<Purchase>>;
  }) {
  const handleChange = <K extends keyof Purchase>(field: K, value: Purchase[K]) => {
    setPurchase(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <dialog
      className={adminModals.modal}
      ref={addPurchaseDialogRef}
    >
      <div className={adminModals.content}>
        <div className={adminModals.heading}>
          Add Purchase
        </div>

        <hr />

        {/* Check if source is from an internal supplier */}
        {/* <div className={adminModals.inputsStretched}> */}
        {/*   <label className={adminModals.inputCheckbox}> */}
        {/*     From supplier */}
        {/*     <input type="checkbox" /> */}
        {/*   </label> */}
        {/* </div> */}

        <div className={adminModals.inputsSection}>
          <label className={adminModals.input}>
            Source
            <input
              onChange={(event) => {
                handleChange('source', event.target.value);
              }}
              type="text"
              value={purchase.source}
            />
          </label>
        </div>

        <hr />

        <div className={adminModals.inputsSection}>
          <label className={adminModals.input}>
            Product
            <input
              onChange={(event) => {
                handleChange('product', event.target.value);
              }}
              type="text"
              value={purchase.product}
            />
          </label>
          <label className={adminModals.input}>
            Price
            <input
              onChange={(event) => {
                handleChange('price', Number(event.target.value));
              }}
              placeholder="PHP"
              type="number"
              value={purchase.price ===  0 ? '' : purchase.price}
            />
          </label>
          <label className={adminModals.input}>
            Quantity
            <input
              onChange={(event) => {
                handleChange('quantity', Number(event.target.value));
              }}
              placeholder="kg"
              type="number"
              value={purchase.quantity ===  0 ? '' : purchase.quantity}
            />
          </label>
        </div>

        <hr />

        <div className={adminModals.formSummary}>
          <div>Total:</div>
          <div>PHP {purchase.price * purchase.quantity}</div> 
        </div>
      </div>

      {/* Purchase form buttons */}
      <div className={adminModals.buttons}>
        <button
          className={adminModals.closeButton}
          onClick={event => {
            event.preventDefault();

            addPurchaseDialogRef.current.close();
            ledgerFormRef.current.showModal();
          }}
        >
          Back
        </button>

        <button
          className={adminModals.confirmButton}
          type="submit"
        >
          Submit
        </button>
      </div>
    </dialog>
  );
}

function ModalSaleForm({
  addSaleDialogRef,
  formMessage,
  ledgerFormRef,
  sale,
  setSale,
}: {
  addSaleDialogRef: RefObject<HTMLDialogElement>;
  formMessage: FormMessage;
  ledgerFormRef: RefObject<HTMLDialogElement>;
  sale: Sale,
  setSale: Dispatch<SetStateAction<Sale>>;
}) {
  const handleChange = <K extends keyof Sale>(field: K, value: Sale[K]) => {
    setSale(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <dialog
      className={adminModals.modal}
      ref={addSaleDialogRef}
    >
      <div className={adminModals.content}>
        <div className={adminModals.heading}>
          Add Sale
        </div>

        <hr />

        {/* Sale inputs */}
        <div className={adminModals.inputsSection}>
          <div className={adminModals.input}>
            <label htmlFor="enterCustomer">
              Customer
            </label>
            <input
              id="enterCustomer"
              onChange={(event) => {
                handleChange('customer', event.target.value);
              }}
              type="text"
              value={sale.customer}
            />
          </div>
          <div className={adminModals.input}>
            <label htmlFor="enterProduct">
              Product
            </label>
            <input
              id="enterProduct"
              onChange={(event) => {
                handleChange('product', event.target.value);
              }}
              type="text"
              value={sale.product}
            />
          </div>
          <div className={adminModals.input}>
            <label htmlFor="enterPrice">
              Price
            </label>
            <input
              id="enterPrice"
              onChange={(event) => {
                const value = Number(event.target.value);
                handleChange('price', value);

                handleChange('total', value * sale.quantity);
              }}
              placeholder="PHP"
              type="number"
              value={sale.price === 0 ? '' : sale.price}
            />
          </div>
          <div className={adminModals.input}>
            <label htmlFor="enterQuantity">
              Quantity
            </label>
            <input
              id="enterQuantity"
              onChange={(event) => {
                const value = Number(event.target.value);
                handleChange('quantity', value);

                handleChange('total', value * sale.price);
              }}
              placeholder="kg"
              type="number"
              value={sale.quantity === 0 ? '' : sale.quantity}
            />
          </div>
        </div>

        <hr />

        <div className={adminModals.formSummary}>
          <div>Total:</div>
          <div>PHP {sale.price * sale.quantity}</div> 
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

      {/* Sale form buttons */}
      <div className={adminModals.buttons}>
        <button
          className={adminModals.closeButton}
          onClick={event => {
            event.preventDefault();

            addSaleDialogRef.current.close();
            ledgerFormRef.current.showModal();
          }}
        >
          Back
        </button>

        <button
          className={adminModals.confirmButton}
          type="submit"
        >
          Submit
        </button>
      </div>
    </dialog>
  );
}

