export default function Header({ darkMode, setDarkMode }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">🚀 SmartDB Pro</h1>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 bg-blue-500 dark:bg-red-500 text-white rounded"
      >
        Toggle Mode
      </button>
    </div>
  );
}