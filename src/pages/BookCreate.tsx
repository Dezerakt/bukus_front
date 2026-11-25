import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateBook } from '../api';

export function BookCreate() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const createBook = useCreateBook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBook.mutate(
      { name },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Book Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. Crime And Punishment"
          />
        </div>

        {createBook.isError && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">{createBook.error.message}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={createBook.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {createBook.isPending ? 'Creating...' : 'Create Book'}
          </button>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
