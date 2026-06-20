import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MutationFeedbackOptions<TData, TError, TVariables, TContext> {
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
}

export function useMutationWithFeedback<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> &
    MutationFeedbackOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { successMessage, errorMessage, onSuccess, onError, ...mutationOptions } = options;

  return useMutation<TData, TError, TVariables, TContext>({
    ...mutationOptions,
    onSuccess: async (data, variables, context) => {
      if (successMessage) {
        const msg = typeof successMessage === 'function' ? successMessage(data) : successMessage;
        toast.success(msg);
      }
      if (onSuccess) {
        await (onSuccess as any)(data, variables, context);
      }
    },
    onError: async (error, variables, context) => {
      if (errorMessage) {
        const msg = typeof errorMessage === 'function' ? errorMessage(error) : errorMessage;
        toast.error(msg);
      } else {
        const defaultMsg = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        toast.error(defaultMsg);
      }
      if (onError) {
        await (onError as any)(error, variables, context);
      }
    },
  });
}
