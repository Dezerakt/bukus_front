import { Link } from 'react-router-dom';
import { useBooks, useDeleteBook } from '../api';

export function BookList() {
  const { data: books, isLoading, error } = useBooks();
  const deleteBook = useDeleteBook();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-500">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-red-700">Failed to load books: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <Link
          to="/books/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Add Book
        </Link>
      </div>

      {!books || books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No books yet.</p>
          <Link
            to="/books/new"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Create your first book
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/books/${book.id}`}
                      className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                      {book.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(book.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      to={`/books/${book.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-500 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this book?')) {
                          deleteBook.mutate(book.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-500"
                      disabled={deleteBook.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
