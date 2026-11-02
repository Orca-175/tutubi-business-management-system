import type { Dispatch, RefObject, SetStateAction } from 'react';

import classNames from 'classnames';
import { BiChevronLeft, BiChevronRight, BiMinus, BiPlus } from 'react-icons/bi';

import common from '../styles/common-styles/AdminCommon.module.scss';

interface Props {
  addFormRef: RefObject<HTMLDialogElement>;
  isDeleteMode: boolean;
  isMoreExpanded: boolean;
  setIsDeleteMode: Dispatch<SetStateAction<boolean>>;
  setIsMoreExpanded: Dispatch<SetStateAction<boolean>>;
}

export function TableCardButtons({
  addFormRef,
  isDeleteMode,
  isMoreExpanded,
  setIsDeleteMode,
  setIsMoreExpanded,
}: Props) {
  return (
    <div className={common.tableCardButtons}>
      <div className={common.moreContainer}>
        <button
          className={common.moreButton}
          onClick={event => {
            event.preventDefault();

              setIsMoreExpanded(!isMoreExpanded);
          }}
        >
          {!isMoreExpanded ? (
            <>
              <BiChevronRight />
            </>
          ) : (
            <>
              <BiChevronLeft />
            </>
          )}
        </button>

        {isMoreExpanded &&
          <button
            className={classNames(
              common.deleteButton,
              isDeleteMode && common.deleteButtonActive,
            )}
            onClick={event => {
              event.preventDefault();

              setIsDeleteMode(!isDeleteMode);
            }}
          >
            <BiMinus /> Delete
          </button>
        }
      </div>

      <button
        className={common.newButton}
        onClick={() => addFormRef.current.showModal()}
      >
        <BiPlus /> New
      </button>
    </div>
  );
}

