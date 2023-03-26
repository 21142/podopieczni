type Props = {
  value?: string;
};

const SelectInput: React.FC<Props> = () => {
  return (
    <div className="col-span-6 sm:col-span-3">
      <label
        htmlFor="role"
        className="block text-sm font-medium text-gray-700"
      >
        Role
      </label>
      <select
        id="role"
        name="role"
        className="mt-1 block w-full rounded-md border border-neutral-50 bg-white py-2 px-3 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-primary-400 sm:text-sm"
      >
        <option>Please select</option>
        <option>Admin</option>
        <option>Shelter</option>
        <option>Adopter</option>
      </select>
    </div>
  );
};

export default SelectInput;
