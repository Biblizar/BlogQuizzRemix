import { Link, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'

export const loader = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    }),
  }

  return data
}

function PostItems() {
  const { posts } = useLoaderData()

  return (
    <>
      <div className='page-header'>
        <h1>Liste des publications</h1>
      </div>
      <ul className='posts-list'>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`${post.id}`}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default PostItems