import { Outlet, Link } from "remix";

export default function AdminPostsRoute() {
  return (
    <div>
      <Link to='/admin/posts/new' className={'btn btn-focus'}>New</Link>
      <main>
        <Outlet />
      </main>
    </div>
  );
}