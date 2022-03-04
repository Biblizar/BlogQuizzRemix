import { useLoaderData } from 'remix'
import Quizz from '~/components/Quizz'
import { db } from '~/utils/db.server'

export const loader = async ({request, params}) => {
  const postId = parseInt(params.postId)
  const data = {
    posts: await db.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true, createdAt: true, content: true, quizz: true },
    }),
  }
  return data
}
export default function PostRoute() {
  const { posts } = useLoaderData()
  const { id, title, createdAt, content, quizz } = posts
  return (
    <div>
      <h1>Here's your post: {title}</h1>
      <p>{content}</p>
      {quizz === {} ? <Quizz quizz={quizz} /> : null}
    </div>
  );
}