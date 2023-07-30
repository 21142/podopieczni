const Spinner: React.FC<{ small?: boolean }> = (small) => {
  return (
    <div className="mr-28 translate-x-1/2 translate-y-1/2 transform">
      {small ? (
        <div className="mb-3 h-4 w-4 animate-spinner rounded-full border-8 border-solid border-transparent" />
      ) : (
        <div className="h-32 w-32 animate-spinner rounded-full border-8 border-solid border-transparent" />
      )}
    </div>
  );
};

export default Spinner;
