
import { useState } from "react";
import { AuthFormData } from "@/types/auth";

export const useAuthState = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    specialty: "",
  });

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      specialty: "",
    });
  };

  const handleFieldChange = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleBackToLogin = () => {
    setRegistrationComplete(false);
    setIsLogin(true);
  };

  return {
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
  };
};
