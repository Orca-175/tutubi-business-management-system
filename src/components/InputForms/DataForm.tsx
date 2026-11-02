import classNames from 'classnames';
import { type Dispatch, Fragment, type SetStateAction } from 'react';

import type { FormMessage } from '../../interfaces/FormMessage';
import type { Data, InputFormProps } from './DataFormProps';

import adminModals from '../../styles/common-styles/AdminModals.module.scss';

interface Props<T> extends InputFormProps<T> {
  cleanupDataForDialogs?: () => void; // Clears the data used by the dialog forms of table
                           // components in tabled pages
  data: Data<T> | T;
  formMessage: FormMessage;
  onSubmit: () => void;
  setData: Dispatch<SetStateAction<Data<T> | T>>;
}

export function DataForm<T>({
  cleanupDataForDialogs,
  data,
  formMessage,
  formRef,
  heading,
  inputsGroups,
  onSubmit,
  setData,
}: Props<T>) {
  const getDeepestObject = (object: T, field: string) => {
    const splitPath = field.split('.').toSpliced(-1);

    return splitPath.reduce((accumulator, current) => (
      accumulator?.[current]
    ), object);
  };

  const handleChange = (field: string, value: boolean | number | string) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (field: string, value: boolean | number | string) => {
    const tempData = structuredClone(data);
    const deepestField = field.split('.').at(-1);

    const deepestObjectInTempData = getDeepestObject(tempData, field);
    deepestObjectInTempData[deepestField] = value;

    setData(tempData);
  };

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        onSubmit();
      }}
    >
      <dialog
        className={adminModals.modal}
        onCancel={() => cleanupDataForDialogs()}
        ref={formRef}
      >
        <div className={adminModals.content}>
          <div className={adminModals.heading}>
            {heading}
          </div>

          <hr />

          {inputsGroups.map((inputs, index) => {
            return (
              <Fragment
                key={inputs[0].field + inputs.at(-1).field}
              >
                <div
                  className={adminModals.inputsSection}
                >
                  {inputs.map(input => {
                    const splitField = input.field.split('.');
                    const isNestedField = splitField.length > 1;
                    const finalField = splitField.at(-1);

                    const handleChangeCatchall = (
                      value: boolean | number | string,
                      type: 'number' | 'select' | 'text',
                    ) => {
                      const finalValue = type === 'number' ? Number(value) : value;

                      if (isNestedField) {
                        handleNestedChange(input.field, finalValue);
                      } else {
                        handleChange(finalField, finalValue);
                      }
                    };

                    if (input.type === 'number' || input.type === 'text') {
                      return (
                        <label
                          className={adminModals.input}
                        >
                          {input.label}
                          <input
                            onChange={event => {
                              handleChangeCatchall(event.target.value, input.type);
                            }}
                            type={input.type}
                            value={getDeepestObject(data, input.field)[finalField]}
                          />
                        </label>
                      );
                    } else {
                      return (
                        <label
                          className={adminModals.input}
                        >
                          {input.label}
                          <select
                            onChange={event => {
                              handleChangeCatchall(event.target.value, input.type);
                            }}
                            value={getDeepestObject(data, input.field)[finalField]}
                          >
                            {input.options.map(option => {
                              return (
                                <option value={String(option)}>{option}</option>
                              );
                            })}
                          </select>
                        </label>
                      );
                    }
                  })}
                </div>

                {index !== inputsGroups.length - 1 &&
                  <hr />
                }
              </Fragment>
            );
          })}
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

