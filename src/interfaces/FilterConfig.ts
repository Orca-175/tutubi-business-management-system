export interface FilterConfig {
  normal?: ({
    field: string;
    label: string;
    type: 'select' | 'text';
  })[];
  ranged?: ({
    field: string;
    label: string;
    type: 'date' | 'number';
  })[];
}

