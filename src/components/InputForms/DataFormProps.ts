import type { RefObject } from 'react';

import type { FieldPath } from '../../interfaces/FieldPath';

export type Data<T> = T & { docId: string };

export interface InputFormProps<T> {
  formRef: RefObject<HTMLDialogElement>;
  heading: string;
  inputsGroups: InputsGroupsConfig<T>;
}

export type InputsGroupsConfig<T> = {
    disabled?: boolean;
    field: FieldPath<T>;
    label: string;
    optionDefault?: { label: string, value: boolean | number | string};
    options?: ({ 
      label: string;
      value: boolean | number | string;
    })[];
    type: 'number' | 'select' | 'text';
  }[][]; // Each inner array is separated by an <hr /> on the form

