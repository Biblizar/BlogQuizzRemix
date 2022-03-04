import { useActionData, json, Link } from 'remix'
import { createUserSession, login } from '~/utils/session.server'

function validateUsername(username) {
  if (typeof username !== 'string' || username.length < 3) {
    return 'Username must be at least 3 characters'
  }
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters'
  }
}

function badRequest(data) {
  return json(data, { status: 400 })
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  const fields = { username, password }

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields })
  }
      // Find user
      const user = await login({ username, password })

      // Check user
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: 'Invalid credentials' },
        })
      }
      // Create Session
      return createUserSession(user.id, '/posts')
    
  }


function Login() {
  const actionData = useActionData()
  return (
    <div className='auth-container'>
      <div className='page-header'>
        <h1>Login</h1>
      </div>

      <div className='page-content'>
        <form method='POST'>
          <div className='form-control'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              name='username'
              id='username'
              defaultValue={actionData?.fields?.username}
            />
            <div className='error'>
              {actionData?.fieldErrors?.username ? (
                <p
                  className='form-validation-error'
                  role='alert'
                  id='username-error'
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null}
            </div>
          </div>

          <div className='form-control'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              defaultValue={actionData?.fields?.password}
            />
            <div className='error'>
              {actionData?.fieldErrors?.password ? (
                <p
                  className='form-validation-error'
                  role='alert'
                  id='password-error'
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
          </div>

          <button className='btn btn-block' type='submit'>
            Submit
          </button>
        </form>
        <Link to={"/signup"}>Pas encore inscrit?</Link>
      </div>
    </div>
  )
}

export default Login