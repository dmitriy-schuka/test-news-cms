import { redirect } from '@remix-run/node';

import { authenticator } from '~/services/auth.server';
import { sessionStorage } from '~/services/session.server';

export async function action({ request }: { request: Request }) {
    /** Authenticate the user via strategy */
    const user = await authenticator.authenticate('user-pass', request);

    const session = await sessionStorage.getSession(
        request.headers.get('cookie')
    );
    session.set('user', user);

    /** Save the session and redirect to the main page */
    throw redirect('/app/news/grid', {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
        },
    });
}
