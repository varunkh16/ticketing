import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    return request(app)
        .post(`/api/tickets/${id}`)
        .set('Cookie', signup())
        .send({
            "title": 'abcdefg',
            "price": 10
        })
        .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    return request(app)
        .post(`/api/tickets/${id}`)
        .send({
            "title": 'abcdefg',
            "price": 10
        })
        .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', signup())
        .send({
            "title": 'abcdefg',
            "price": 10
        });
    
    await request(app)
        .post(`/api/tickets/${response.body.id}`)
        .set('Cookie', signup())
        .send({
            "title": 'abcdefg',
            "price": 1000
        })
        .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
    const cookie = signup();

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            "title": 'abcdefg',
            "price": 10
        });
    
    await request(app)
        .post(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            "title": '',
            "price": 1000
        })
        .expect(400);
    
    await request(app)
        .post(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            "title": 'abcdefg',
            "price": -1000
        })
        .expect(400);
});

it("updates the ticket provided the valid inputs", async () => {
    const cookie = signup();
    const newTitle = 'abcdefghijk';
    const newPrice = 1000;

    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            "title": 'abcdefg',
            "price": 10
        });
    
    await request(app)
        .post(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            "title": newTitle,
            "price": newPrice
        })
        .expect(200);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    
    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
});