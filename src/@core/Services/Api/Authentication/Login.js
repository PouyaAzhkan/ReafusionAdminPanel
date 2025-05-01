import { useMutation } from "@tanstack/react-query";
import Api from '../../interceptor'
export const PanelLogin = () => {
  return useMutation({
      mutationKey: ['EmailAndPassword'],
      mutationFn: async ({ phoneOrGmail, password, rememberMe }) => {
            const response = await Api.post(`/Sign/Login`, { phoneOrGmail, password, rememberMe });
            
            return response;
      },
      onSuccess: (data) => {
        console.log('you are successfully Log in:', data);
      },
      onError: (error) => {
        console.error('Failed to send email and password:', error);
      },
  });
}