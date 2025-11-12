export default function LoadingTailwind() {
  return (
    <>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
      <div className="text-center mt-2">Loading...</div>
    </>
  );
}
