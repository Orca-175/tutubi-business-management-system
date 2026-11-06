import { useRef, useState } from "react";

export function useTableCardButtons() {
  const addFormRef = useRef<HTMLDialogElement>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isMoreExpanded, setIsMoreExpanded] = useState(false);

  return {
    addFormRef: addFormRef,
    isDeleteMode: isDeleteMode,
    isMoreExpanded: isMoreExpanded,
    setIsDeleteMode: setIsDeleteMode,
    setIsMoreExpanded: setIsMoreExpanded,
  };
}
