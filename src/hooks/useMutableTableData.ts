import { useEffect, useRef, useState } from 'react';

export function useMutableTableData<T>() {
  const [originalData, setOriginalData] = useState<T>();
  const [dataToDelete, setDataToDelete] = useState<T>();

  const editDataFormRef = useRef<HTMLDialogElement>(null);
  const deleteDataFormRef = useRef<HTMLDialogElement>(null);

  const cleanupDataForDialogs = () => {
    setOriginalData(null);
    setDataToDelete(null);
  };

  // Show modal edit form when originalData changes after being set when the
  // user clicks the edit button of a product
  useEffect(() => {
    if (originalData) {
      editDataFormRef.current.showModal();
    }
  }, [originalData]);

  return {
    cleanupDataForDialogs: cleanupDataForDialogs,
    dataToDelete: dataToDelete,
    deleteDataFormRef: deleteDataFormRef,
    editDataFormRef: editDataFormRef,
    originalData: originalData,
    setDataToDelete: setDataToDelete,
    setOriginalData: setOriginalData,
  };
}
