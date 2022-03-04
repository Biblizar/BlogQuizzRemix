export default function NewPostRoute() {
  return (
   <div className='auth-container'>
      <div className='page-header'>
        <h1>New Post</h1>
      </div>

      <div className='page-content'>
        <form method='POST'>
          <div className='form-control'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
            />
          </div>

          <div className='form-control'>
            <label htmlFor='content'>Content</label>
            <textarea
              name='content'
              id='content'
            />
          </div>

          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}