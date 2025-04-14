
import { useAuthState } from "./useAuthState";
import { useUserLogin } from "./useUserLogin";
import { useUserRegistration } from "./useUserRegistration";

export type { AuthFormData } from "@/types/auth";

export const useAuth = () => {
  const {
    isLogin,
    isLoading,
    setIsLoading,
    registrationComplete,
    setRegistrationComplete,
    formData,
    resetForm,
    handleFieldChange,
    toggleAuthMode,
    handleBackToLogin,
  } = useAuthState();
  
  const { loginUser } = useUserLogin();
  const { registerUser } = useUserRegistration();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await loginUser(formData);
      } else {
        const result = await registerUser(formData);
        if (result.success) {
          setRegistrationComplete(true);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLogin,
    isLoading,
    registrationComplete,
    formData,
    handleSubmit,
    handleFieldChange,
    toggleAuthMode,
    handleBackToLogin,
  };
};
