import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useBook, useUpdateBook } from '../api';

export function BookEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading, error } = useBook(id!);
  const updateBook = useUpdateBook();
  const [name, setName] = useState('');

  useEffect(() => {
    if (book) {
      setName(book.name);
    }
  }, [book]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-red-700">Book not found</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-500 text-sm mt-2 inline-block">
          Back to list
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBook.mutate(
      { id: id!, data: { name } },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Book</h1>

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
          />
        </div>

        {updateBook.isError && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">{updateBook.error.message}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={updateBook.isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {updateBook.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-500">
            Cancel
          </Link>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <dl className="text-sm text-gray-500 space-y-1">
          <div className="flex gap-2">
            <dt className="font-medium">Created:</dt>
            <dd>{new Date(book.created_at).toLocaleString()}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-medium">Updated:</dt>
            <dd>{new Date(book.updated_at).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
