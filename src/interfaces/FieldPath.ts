export type FieldPath<T> = T extends object ? ({
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

