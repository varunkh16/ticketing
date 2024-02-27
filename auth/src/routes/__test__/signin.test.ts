import request from "supertest";
import { app } from "../../app";

it("fails when email does not exist is supplied to signin", async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            'email': 'test@test.com',
            'password': 'password'
        })
        .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            'email': 'test@test.com',
            'password': 'password'
        });

    await request(app)
        .post('/api/users/signin')
        .send({
            'email': 'test@test.com',
            'password': 'pass'
        })
        .expect(400);
});

it("success when correct credentials are supplied and cookie is set", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            'email': 'test@test.com',
            'password': 'password'
        });

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            'email': 'test@test.com',
            'password': 'password'
        });

    expect(response.get("Set-Cookie")).toBeDefined();
});