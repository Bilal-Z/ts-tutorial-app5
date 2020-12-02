import { Router, Request, Response, NextFunction } from 'express';

interface RequestWithBody extends Request {
	body: { [Key: string]: string | undefined };
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
	if (req.session && req.session.loggedIn) {
		return next();
	}

	res.status(403);
	res.send('Not Permitted');
}

const router = Router();

// Parameters declaration with names starting with _ are exempt from the unused parameter checking. used with req
// so, req => _req
router.get('/login', (_req: Request, res: Response) => {
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
});

router.post('/login', (req: RequestWithBody, res: Response) => {
	const { email, password } = req.body;
	if (email && password && email === 'test@test.com' && password === '123456') {
		req.session = { loggedIn: true };
		res.redirect('/');
	} else {
		res.send('email or password invalid');
	}
});

router.get('/', (req: Request, res: Response) => {
	if (req.session && req.session.loggedIn) {
		res.send(`<div>
			<div>You are logged in</div>
			<a href="/logout">Logout</a>
		</div>`);
	} else {
		res.send(`<div>
			<div>You are not logged in</div>
			<a href="/login">Login</a>
		</div>`);
	}
});

router.get('/logout', (req: Request, res: Response) => {
	req.session = null;
	res.redirect('/');
});

router.get('/protected', requireAuth, (_req: Request, res: Response) => {
	res.send('welcome to protected route');
});

export { router };
