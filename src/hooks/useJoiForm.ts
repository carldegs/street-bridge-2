import { useForm, UseFormReturn } from 'react-hook-form';

import { FormObject } from '../formHandlers/FormObject';

const useJoiForm = <T>(
  formObject: FormObject<T>,
  defaultValues?: Partial<T>
): UseFormReturn<T> => {
  return useForm<T>(formObject.getHookOptions(defaultValues));
};

export default useJoiForm;
