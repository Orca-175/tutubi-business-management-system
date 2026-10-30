import type { Dispatch, RefObject, SetStateAction } from 'react';

interface Props<T> {
  data: (T & { docId: string })[],
  formRef: RefObject<HTMLDialogElement>;
  setData: Dispatch<SetStateAction<(T & { docId: string })>>;
}

export function AddDataForm<T>({
  formRef,
}: Props<T>) {

}

