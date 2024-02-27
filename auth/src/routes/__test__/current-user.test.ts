import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            'email': 'test@test.com',
            'password': 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            'email': 'test@test.com',
            'password': 'password'
        })
        .expect(201);
});