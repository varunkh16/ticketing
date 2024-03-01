import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError, NotAuthorizedError } from '@vkhtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets/:id',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage("Title is required!"),
        body('price').isFloat({ gt: 0}).withMessage("Title is required!")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = await Ticket.findById(req.params.id);

        if(!ticket) {
            throw new NotFoundError();
        }

        if(ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        ticket.set({
            title,
            price
        });
        await ticket.save();

        res.send(ticket);
    });

export { router as updateTicketRouter };