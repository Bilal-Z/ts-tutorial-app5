import { Request, Response } from 'express';
import { get, controller, post, bodyValidator } from './decorators';

@controller('/auth')
// @ts-ignore
class LoginController {
	// Parameters declaration with names starting with _ are exempt from the unused parameter checking. used with req
	// so, req => _req
	@get('/login')
	getLogin(_req: Request, res: Response): void {
		res.send(`
		<form method="POST">
			<div>
				<label>Email</label>
				<input name="email"/>
			</div>
			<div>
				<label>Password</label>
				<input name="password" type="password"/>
			</div>
			<button>Submit</button>
		</form>
	`);
	}

	@post('/login')
	@bodyValidator('email', 'password')
	postLogin(req: Request, res: Response) {
		const { email, password } = req.body;
		if (
			email &&
			password &&
			email === 'test@test.com' &&
			password === '123456'
		) {
			req.session = { loggedIn: true };
			res.redirect('/');
		} else {
			res.send('email or password invalid');
		}
	}

	@get('/logout')
	getLogout(req: Request, res: Response) {
		req.session = null;
		res.redirect('/');
	}
}
