import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'

export const loader = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 5,
      select: { id: true, title: true, createdAt: true, content: true },
      orderBy: { createdAt: 'desc' },
    }),
  }

  return data
}

function IndexRoute() {
  const { posts } = useLoaderData()

  return (
    <>
      <div className='page-header'>
        <h1>Bienvenue sur BloggiQuizz</h1>
      </div>
      <ul className='posts-list'>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default IndexRoute