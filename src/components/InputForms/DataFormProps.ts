import type { RefObject } from 'react';

export type Data<T> = T & { docId: string };

export interface InputFormProps<T> {
  formRef: RefObject<HTMLDialogElement>;
  heading: string;
  inputsGroups: InputsGroupsConfig<T>;
}

export type InputsGroupsConfig<T> = {
    field: FieldPath<T>;
    label: string;
    options?: ({ 
      label: string;
      value: boolean | number | string;
    })[];
    type: 'number' | 'select' | 'text';
  }[][]; // Each inner array is separated by an <hr /> on the form

type FieldPath<T> = T extends object ? ({
  [K in keyof T]-?: K extends number | string ? (
    `${K}` | (FieldPath<T[K]> extends infer R ? (
      R extends string ? `${K}.${R}` : never
    ) : (
      never
    ))
  ) : (
    never
  )
}[keyof T]) : (
  never
);

