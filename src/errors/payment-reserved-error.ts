import { ApplicationError } from '@/protocols';

export function PaymentRequiredError(): ApplicationError {
  return {
    name: 'PaymentRequired',
    message:"Payment of ticket is required" ,
  };
}
