import type { ActionFunction, LinksFunction, MetaFunction } from "remix";
import { useActionData, Form, Link, useSearchParams, json } from "remix";
import { login, createUserSession, register } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return {
    title: "Remix Jokes | Login",
    description: "Login to submit your own jokes to Remix Jokes!",
  };
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}
const validateConfirmPassword = (password:unknown, confirmPassword:unknown) => {
  if (!confirmPassword) {
    return "Confirm Password is required";
  } else if (password !== confirmPassword) {
    return "Password does not match";
  }

};

type ActionData = {
  formError?: string;
  fieldErrors?: { username: string | undefined; password: string | undefined; confirmPassword: string | undefined };
  fields?: { username: string; password: string; confirmPassword: string };
};

/**
 * This helper function gives us typechecking for our ActionData return
 * statements, while still returning the accurate HTTP status, 400 Bad Request,
 * to the client.
 */
const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  const confirmPassword = form.get("confirmPassword");
  const redirectTo = form.get("redirectTo") || "/jokes";
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({ formError: `Form not submitted correctly.` });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(confirmPassword,password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
      const userExists = await db.user.findFirst({ where: { username } });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`,
        });
      }
      return createUserSession(user.id, redirectTo);
};

export default function SignUp() {
  const actionData = useActionData<ActionData>();
  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>SignUp</h1>
      </div>
        <div className='page-content'>
          <Form method="post">
            <div className='form-control'>
              <label htmlFor="username-input">Username</label>
              <input
                type="text"
                id="username-input"
                name="username"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                aria-errormessage={
                  actionData?.fieldErrors?.username ? "username-error" : undefined
                }
                />
              {actionData?.fieldErrors?.username ? (
                <p
                className="form-validation-error"
                role="alert"
                id="username-error"
                >
                  {actionData.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div className='form-control'>
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                defaultValue={actionData?.fields?.password}
                type="password"
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-errormessage={
                  actionData?.fieldErrors?.password ? "password-error" : undefined
                }
                />
              {actionData?.fieldErrors?.password ? (
                <p
                className="form-validation-error"
                role="alert"
                id="password-error"
                >
                  {actionData.fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <div className='form-control'>
              <label htmlFor="password-input">Confirm Password</label>
              <input
                id="password-input"
                name="confirmPassword"
                defaultValue={actionData?.fields?.confirmPassword}
                type="password"
                aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                aria-errormessage={
                  actionData?.fieldErrors?.confirmPassword ? "password-error" : undefined
                }
                />
              {actionData?.fieldErrors?.confirmPassword ? (
                <p
                className="form-validation-error"
                role="alert"
                id="password-error"
                >
                  {actionData.fieldErrors.confirmPassword}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className='btn btn-block'>
              Submit
            </button>
          </Form>
          <Link to={"/login"}>Vous avez déjà un compte?</Link>
        </div>
      </div>
  );
}