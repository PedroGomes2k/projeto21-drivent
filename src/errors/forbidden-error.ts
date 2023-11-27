import { ApplicationError } from '@/protocols';

export function forbiddenError(): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: 'Is not more vacancy for this room',
  };
}
