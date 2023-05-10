import { useState } from 'react';
import CircleLoading from './CircleLoading';
import { api } from './service';
import type { User } from './App';
import { getFullDate } from './utils';

type Repository = {
  id: number,
  stargazers_count: number,
  html_url: string,
  full_name: string,
  description: string,
  created_at: string,
}

function Card(
  { user, openModal, onClickIdCallback } :
  { user: User, openModal: string, onClickIdCallback: (id: string) => void }
) 
{
  const [repositories, setRepositories] = useState<Repository[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorStatus, setErrorStatus] = useState<number>(200);

  const fetchRepositories = () => {
    if (loading) return;
    setLoading(true);
    setErrorStatus(200);
    api<Repository[]>(`users/${user.login}/repos`)
      .then((response) => {
        setRepositories(response);
      })
      .catch((error) => {
        setRepositories(null);
        setErrorStatus(error.status);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="mb-4">
      <div
        onClick={() => {
          onClickIdCallback(user.login);
          if (repositories === null) fetchRepositories();
        }}
        className="flex justify-between items-center gap-4 rounded bg-gray-100 hover:bg-gray-200 p-4 mb-2 cursor-pointer"
      >
        <div className="w-[40px] aspect-square bg-gray-100 border border-gray-900 rounded-full overflow-hidden">
          <img src={user.avatar_url} alt={user.login} className="w-full h-full aspect-square" />
        </div>
        <div className="flex-auto flex justify-between items-center">
          <h6 className="text-md text-gray-800">
            {user.login}
          </h6>
          <div className={openModal ? 'rotate-180' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </div>
      </div>

      { openModal === user.login && (
        <div className="pl-4">
          {!loading &&
            repositories &&
            repositories?.length > 0 &&
            repositories
              .map((repo: Repository) => 
          (
            <div key={repo.id} className="relative rounded bg-gray-200 hover:bg-gray-300 p-4 mb-2">
              <div className="absolute top-3 right-3 flex items-center gap-1 text-gray-600">
                <span className="leading-none font-bold mt-1">
                  {repo.stargazers_count}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </div>
              <a href={repo.html_url} className="text-base block pr-10 leading-tight hover:underline truncate">
                {repo.full_name}
              </a>
              {repo?.description && (
                <p className="text-sm mt-1 text-gray-600">
                  {repo.description}
                </p>
              )}
              <span className="block text-xs mt-2 text-gray-600 text-right">
                {getFullDate(new Date(repo.created_at))}
              </span>
            </div>
          ))}

          { loading && (
            <div className="relative rounded bg-gray-200 p-4">
              <CircleLoading className="my-2 text-center" />
            </div>
          )}

          { !loading &&
            repositories &&
            repositories?.length === 0 &&
          (
            <div className="relative rounded bg-gray-200 hover:bg-gray-300 p-4 mb-2">
              <span className="block text-center">
                Repository is empty:(
              </span>
            </div>
          )}

          { !loading && errorStatus !== 200 && (
            <div className="relative rounded bg-gray-200 hover:bg-gray-300 p-4 mb-2">
              <span className="block text-center">
                Error with status code {errorStatus}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Card