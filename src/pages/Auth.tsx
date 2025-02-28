
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import RegistrationComplete from "@/components/auth/RegistrationComplete";
import { useAuth } from "@/hooks/useAuth";

const Auth = () => {
  const {
    isLogin,
    isLoading,
    registrationComplete,
    formData,
    handleSubmit,
    handleFieldChange,
    toggleAuthMode,
    handleBackToLogin,
  } = useAuth();

  if (registrationComplete) {
    return <RegistrationComplete onBackToLogin={handleBackToLogin} />;
  }

  return (
    <AuthLayout
      title={isLogin ? "Bem-vindo de Volta" : "Criar Conta"}
      subtitle={isLogin ? "Entre na sua conta" : "Registre-se como médico"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {isLogin ? (
          <LoginForm
            email={formData.email}
            password={formData.password}
            isLoading={isLoading}
            onEmailChange={(value) => handleFieldChange("email", value)}
            onPasswordChange={(value) => handleFieldChange("password", value)}
            onSwitchToRegister={toggleAuthMode}
          />
        ) : (
          <RegisterForm
            formData={formData}
            isLoading={isLoading}
            onFieldChange={handleFieldChange}
            onSwitchToLogin={toggleAuthMode}
          />
        )}
      </form>
    </AuthLayout>
  );
};

export default Auth;
