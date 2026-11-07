import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Controller, createApiRouter } from './api/controller';
import { IUserAccount } from './domain/entities';
import {
  AccountService,
  BudgetService,
  GoalService,
  GroupSavingsService,
  BillService,
  LoginActivityService,
  PaymentsServiceBL,
  ReportingService,
  NotificationServiceBL,
} from './services/services';
import {
  AccountsRepositoryImpl,
  UserRepositoryImpl,
  TransactionRepositoryImpl,
  BudgetRepositoryImpl,
  GoalRepositoryImpl,
  PaymentRepositoryImpl,
  GroupSavingsRepositoryImpl,
  NotificationRepositoryImpl,
  BillRepositoryImpl,
  LoginActivityRepositoryImpl,
} from './data/repositories';

const PORT = Number(process.env.PORT ?? 3001);
const SERVICE_DOMAIN = process.env.SERVICE_DOMAIN ?? 'all';
const DOMAIN_PREFIXES: Record<string, string[]> = {
  identity: ['/accounts'],
  finance: ['/budgets', '/goals', '/reports'],
  savings: ['/groups'],
  payments: ['/payments', '/bills'],
  notifications: ['/notifications'],
};

// Initialize the application following the layered architecture
function initializeApp(): Application {
  const app = express();
  if (SERVICE_DOMAIN !== 'all' && !DOMAIN_PREFIXES[SERVICE_DOMAIN]) {
    throw new Error(`Unknown SERVICE_DOMAIN: ${SERVICE_DOMAIN}`);
  }

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (allowedOrigins.includes('*')) {
    throw new Error('CORS_ORIGIN cannot use a wildcard while credentialed requests are enabled');
  }
  app.disable('x-powered-by');
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // DATA LAYER - Initialize Repositories (in-memory mock)
  const accountsRepository = new AccountsRepositoryImpl();
  const userRepository = new UserRepositoryImpl();
  const transactionRepository = new TransactionRepositoryImpl();
  const budgetRepository = new BudgetRepositoryImpl();
  const goalRepository = new GoalRepositoryImpl();
  const paymentRepository = new PaymentRepositoryImpl();
  const groupSavingsRepository = new GroupSavingsRepositoryImpl();
  const notificationRepository = new NotificationRepositoryImpl();
  const billRepository = new BillRepositoryImpl();
  const loginActivityRepository = new LoginActivityRepositoryImpl();

  if (SERVICE_DOMAIN === 'identity' || SERVICE_DOMAIN === 'all') {
    const demoUser: IUserAccount = {
      userId: 'demo-user',
      credentials: { username: 'demo', passwordHash: 'demo-login-only' },
      profile: { email: 'demo@example.invalid', phone: '201000000000', address: 'Local demo profile' },
      securitySettings: { twoFactorEnabled: false, accountStatus: 'Active' },
    };
    userRepository.save(demoUser);
    accountsRepository.save({
      accountId: 'demo-account',
      userId: 'demo-user',
      balance: { amount: 0, currency: { code: 'USD', symbol: '$', exchangeRate: 1 } },
    });
  }

  console.log('Repositories initialized with in-memory storage');

  // SERVICE LAYER - Initialize Services with Dependency Injection
  const accountService = new AccountService(accountsRepository, userRepository);
  const budgetService = new BudgetService(budgetRepository, transactionRepository);
  const goalService = new GoalService(goalRepository);
  const groupSavingsService = new GroupSavingsService(groupSavingsRepository);
  const paymentsService = new PaymentsServiceBL(paymentRepository);
  const reportingService = new ReportingService(transactionRepository);
  const notificationService = new NotificationServiceBL(notificationRepository);
  const billService = new BillService(billRepository);
  const loginActivityService = new LoginActivityService(loginActivityRepository);

  console.log('Services initialized with repository dependencies');

  // CONTROLLER LAYER - Initialize Controller with Service dependencies
  const controller = new Controller(
    accountService,
    budgetService,
    goalService,
    groupSavingsService,
    paymentsService,
    reportingService,
    notificationService,
    loginActivityService,
    billService
  );

  console.log('Controller initialized with service dependencies');

  // API ROUTES - Register Express routes
  const apiRouter = createApiRouter(controller);
  if (SERVICE_DOMAIN !== 'all') {
    const allowedPrefixes = DOMAIN_PREFIXES[SERVICE_DOMAIN];
    app.use('/api', (req, res, next) => {
      // Express may expose the pre-mount or router-relative pathname depending on
      // the middleware stack; normalize both forms before applying the domain guard.
      const requestPath = req.path.replace(/^\/api(?=\/)/, '');
      const ownsRoute = allowedPrefixes.some(
        (prefix) => requestPath === prefix || requestPath.startsWith(`${prefix}/`)
      );
      if (!ownsRoute) {
        res.status(404).json({ success: false, message: 'Route is not owned by this service' });
        return;
      }
      next();
    });
  }
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      database: 'memory',
      mode: 'demo',
      service: SERVICE_DOMAIN,
      message: 'SigmaPay service is running in demo mode; data is process-local and not persisted to Supabase',
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status = typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.too.large'
      ? 413
      : typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.parse.failed'
        ? 400
        : 500;
    res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : status === 413 ? 'Request body is too large' : 'Invalid JSON request body' });
  });

  console.log('API routes registered');

  return app;
}

// Start the server
const app = initializeApp();

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`SigmaPay ${SERVICE_DOMAIN} service listening on port ${PORT} (local demo mode)`);
  });
  const shutdown = () => server.close(() => process.exit(0));
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

export default app;
