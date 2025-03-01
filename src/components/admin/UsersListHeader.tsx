
import React from "react";

const UsersListHeader = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 font-medium text-sm text-gray-500 pb-2 border-b">
      <div className="lg:col-span-2">Nome</div>
      <div>Email</div>
      <div>Especialidade</div>
      <div>Tipo</div>
      <div>Cadastro</div>
      <div className="text-right">Status</div>
    </div>
  );
};

export default UsersListHeader;
