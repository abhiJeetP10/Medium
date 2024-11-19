import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userID: string,
        prisma: PrismaClient
    }
}>();

blogRouter.use("*", async (c, next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    c.set("prisma", prisma as unknown as PrismaClient);
    await next();
})

blogRouter.use('*', async (c, next) => {
    if (c.req.method === 'GET')
        await next();

    const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ message: 'Unauthorized' });
    }

    const token = jwt.split(' ')[1];

    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
        c.status(401);
        return c.json({ message: 'Unauthorized' });
    }

    c.set('userID', (payload as { id: string }).id);
    await next();
});

blogRouter.post('/', async (c) => {
    try {
        const prisma = c.get('prisma');
        const body = await c.req.json();
        const authorID = c.get('userID');

        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorID: authorID
            }
        });

        return c.json({
            id: blog.id
        });
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Error creating blog' });
    }
});

blogRouter.put('/', async (c) => {
    try {
        const prisma = c.get('prisma');
        const body = await c.req.json();
        const authorID = c.get('userID');

        const blog = prisma.blog.update({
            where: {
                id: body.id,
                authorID: authorID
            },
            data: {
                title: body.title,
                content: body.content,
                published: body.published,
            }
        });

        c.text('Blog updated');
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Error updating blog' });
    }
});

blogRouter.get('/:id', (c) => {
    try {
        const id = c.req.param('id');
        const prisma = c.get('prisma');

        const blog = prisma.blog.findUnique({
            where: {
                id: id
            }
        });

        return c.json(blog);
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Error fetching blog' });
    }
});

blogRouter.get('/bulk', (c) => {
    try {
        const prisma = c.get('prisma');

        const blogs = prisma.blog.findMany();

        return c.json(blogs);
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Error fetching blogs' });
    }
});

export default blogRouter;