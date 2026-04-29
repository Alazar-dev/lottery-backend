import crypto from 'crypto';
import {ITicket} from "../models/Ticket";

export const generateTicketNumber = (): string => {
    return crypto.randomBytes(4).toString('hex');
}