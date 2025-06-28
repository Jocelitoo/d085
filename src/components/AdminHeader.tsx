interface AdminHeaderProps {
  name: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ name }) => {
  return (
    <header className="bg-green-400">
      <p>Bem-vindo {name}</p>
      <p>Admin Header</p>
    </header>
  );
};
