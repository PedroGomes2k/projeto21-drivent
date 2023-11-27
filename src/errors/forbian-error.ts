import { ApplicationError } from '@/protocols';

export function forbianError(): ApplicationError {
  return {
    name: 'ForbianError',
    message: 'Is not more vacancy for this room',
  };
}
