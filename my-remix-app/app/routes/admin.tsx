import { Outlet, LiveReload, Link, Links, Meta, useLoaderData } from 'remix'
import globalStylesUrl from '~/styles/global.css'
import { getUser } from '~/utils/session.server'


export const meta = () => {
  const description = 'A cool blog built with Remix'
  const keywords = 'remix, react, javascript'

  return {
    description,
    keywords,
  }
}

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user,
  }
  return data
}

export default function Admin() {
  const { user } = useLoaderData()
  return (
    <div className="admin">
<nav className='navbar'>
        <Link to='/admin' className='logo'>
          Admin Blog
        </Link>

        <ul className='nav'>
          <li>
            <Link to='/admin/posts'>Posts</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}