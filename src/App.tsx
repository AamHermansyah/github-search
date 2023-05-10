import { useState, useRef } from 'react';
import CircleLoading from './CircleLoading';
import Card from './Card';
import { api } from './service';

export type User = {
  login: string,
  avatar_url: string
}

function App(): JSX.Element {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIdModal, setCurrentIdModal] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<number>(200);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    
    if (inputRef.current) {
      setLoading(true);
      setErrorStatus(200);
      api<{ items: User[]}>(`search/users?q=${inputRef.current.value}&per_page=5`)
        .then((response) => {
          if (response && response?.items) {
            setData(response.items);
          }
        })
        .catch((error) => {
          setData(null);
          setErrorStatus(error.status);
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 py-10 sm:px-10">
      <h2 className="text-2xl font-semibold tracking-wider text-gray-600">
        Github Search Users
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div>
          <input
            ref={inputRef}
            type="text"
            id="username"
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 mb-3"
            placeholder="Enter github username"
            required
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded text-sm px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {!loading && data && data?.length > 0 && (
        <div className="mt-4">
            <h4 className="text-gray-500 text-md">
              Showing users for "
              <span className="font-medium">
                {inputRef.current && inputRef.current.value}
              </span>
              "
            </h4>

            <div className="mt-2">
              {data.map((user: User) => (
                <Card
                  user={user}
                  key={user.login}
                  openModal={currentIdModal}
                  onClickIdCallback={(id: string) => {
                    if (id === currentIdModal) return setCurrentIdModal('');
                    setCurrentIdModal(id);
                  }}
                />
              ))}
            </div>
        </div>
      )}

      {!loading && data && data?.length === 0 && (
        <div className="mt-10">
          <h4 className="text-gray-500 text-md text-center">
            Users not found:(
          </h4>
        </div>
      )}

      {errorStatus !== 200 && !loading && (
        <div className="mt-10">
          <h4 className="text-gray-500 text-md text-center">
            Error with status code:
          </h4>
          <span className="block text-8xl text-center font-semibold mt-2 text-gray-600">
            {errorStatus}
          </span>
        </div>
      )}

      {loading && <CircleLoading className="mt-10 text-center" />}
    </div>
  )
}

export default App
