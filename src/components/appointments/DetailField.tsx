
interface DetailFieldProps {
  label: string;
  value: string;
}

const DetailField = ({ label, value }: DetailFieldProps) => {
  return (
    <div>
      <h3 className="font-medium text-gray-500">{label}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DetailField;
