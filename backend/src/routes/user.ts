import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@abhijeetp/common-app";

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userID: string,
        prisma: PrismaClient
    }
}>();

userRouter.use("*", async (c, next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    c.set("prisma", prisma as unknown as PrismaClient);
    await next();
})

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

userRouter.post('/signup', async (c) => {
    try {
        const prisma = c.get('prisma');

        const body = await c.req.json();

        if (!signupInput.safeParse(body).success) {
            c.status(400);
            return c.json({ message: 'Invalid input' });
        }

        const hashedPassword = await hashPassword(body.password);

        const user = await prisma.user.create({
            data: {
                email: body.email,
                name: body.name,
                password: hashedPassword
            }
        });

        console.log(hashedPassword);

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({ token });
    } catch (error) {
        c.status(403);
        return c.json({ message: 'Error creating user' });
    }
});

userRouter.post('/signin', async (c) => {
    try {
        const prisma = c.get('prisma');

        const body = await c.req.json();

        if (!signinInput.safeParse(body).success) {
            c.status(400);
            return c.json({ message: 'Invalid input' });
        }

        const hashedPassword = await hashPassword(body.password);

        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: hashedPassword
            }
        })

        if (user == null) {
            throw new Error("User not found");
        }

        const token = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ token });
    } catch (error) {
        c.status(403);
        return c.json({ error });
    }
});

export default userRouter;