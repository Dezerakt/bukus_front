import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBook, useDeleteBook } from '../api';

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: book, isLoading, error } = useBook(id!);
  const deleteBook = useDeleteBook();

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this book?')) {
      deleteBook.mutate(id!, {
        onSuccess: () => navigate('/'),
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{book.name}</h1>
        <div className="flex gap-2">
          <Link
            to={`/books/${id}/edit`}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteBook.isPending}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      <dl className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 flex gap-4">
          <dt className="text-sm font-medium text-gray-500 w-24">ID</dt>
          <dd className="text-sm text-gray-900 font-mono">{book.id}</dd>
        </div>
        <div className="px-4 py-3 flex gap-4">
          <dt className="text-sm font-medium text-gray-500 w-24">Name</dt>
          <dd className="text-sm text-gray-900">{book.name}</dd>
        </div>
        <div className="px-4 py-3 bg-gray-50 flex gap-4">
          <dt className="text-sm font-medium text-gray-500 w-24">Created</dt>
          <dd className="text-sm text-gray-900">{new Date(book.created_at).toLocaleString()}</dd>
        </div>
        <div className="px-4 py-3 flex gap-4">
          <dt className="text-sm font-medium text-gray-500 w-24">Updated</dt>
          <dd className="text-sm text-gray-900">{new Date(book.updated_at).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-500">
          &larr; Back to list
        </Link>
      </div>
    </div>
  );
}
