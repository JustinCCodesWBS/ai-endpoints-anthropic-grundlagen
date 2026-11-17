import express, { Router } from 'express';
import { compatibleTriage, triage } from '../controllers/supportController.ts';

export const aiRoutes = Router();

aiRoutes.use(express.json({ limit: '16kb' }));
aiRoutes.post('/triage', triage);
aiRoutes.post('/triage-compatible', compatibleTriage);
