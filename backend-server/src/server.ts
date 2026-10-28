import express, { Application } from 'express';
import cors from 'cors';
import { getSupabase, hasSupabaseConfig } from './config/supabase';
import { Controller, createApiRouter } from './api/controller';
import {
  AccountService,
  BudgetService,
  GoalService,
  GroupSavingsService,
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
  DatabaseConnectionPool,
} from './data/repositories';

const PORT = Number(process.env.PORT ?? 3001);

// Initialize the application following the layered architecture
function initializeApp(): Application {
  const app = express();

  // Middleware
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // PATTERN: Singleton - Initialize DatabaseConnectionPool
  const dbPool = DatabaseConnectionPool.getInstance();
  console.log(`Database connection pool initialized (${hasSupabaseConfig() ? 'Supabase' : 'memory fallback'})`);

  // DATA LAYER - Initialize Repositories (in-memory mock)
  const accountsRepository = new AccountsRepositoryImpl();
  const userRepository = new UserRepositoryImpl();
  const transactionRepository = new TransactionRepositoryImpl();
  const budgetRepository = new BudgetRepositoryImpl();
  const goalRepository = new GoalRepositoryImpl();
  const paymentRepository = new PaymentRepositoryImpl();
  const groupSavingsRepository = new GroupSavingsRepositoryImpl();
  const notificationRepository = new NotificationRepositoryImpl();

  console.log('Repositories initialized with in-memory storage');

  // SERVICE LAYER - Initialize Services with Dependency Injection
  const accountService = new AccountService(accountsRepository, userRepository);
  const budgetService = new BudgetService(budgetRepository, transactionRepository);
  const goalService = new GoalService(goalRepository);
  const groupSavingsService = new GroupSavingsService(groupSavingsRepository);
  const paymentsService = new PaymentsServiceBL(paymentRepository);
  const reportingService = new ReportingService(transactionRepository);
  const notificationService = new NotificationServiceBL(notificationRepository);

  console.log('Services initialized with repository dependencies');

  // CONTROLLER LAYER - Initialize Controller with Service dependencies
  const controller = new Controller(
    accountService,
    budgetService,
    goalService,
    groupSavingsService,
    paymentsService,
    reportingService,
    notificationService
  );

  console.log('Controller initialized with service dependencies');

  // API ROUTES - Register Express routes
  const apiRouter = createApiRouter(controller);
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', async (req, res) => {
    if (!hasSupabaseConfig()) {
      res.json({ status: 'ok', database: 'not configured', message: 'SigmaPay backend is running' });
      return;
    }

    const { error } = await getSupabase().from('User').select('id').limit(1);
    if (error) {
      res.status(503).json({ status: 'degraded', database: 'unavailable', message: error.message });
      return;
    }
    res.json({ status: 'ok', database: 'supabase', message: 'SigmaPay backend is running' });
  });

  console.log('API routes registered');

  return app;
}

// Start the server
const app = initializeApp();

app.listen(PORT, () => {
  console.log(`\n🚀 SigmaPay Backend Server started successfully!`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API Base: http://localhost:${PORT}/api`);
  console.log(`\n✅ Architecture layers initialized:`);
  console.log(`   - Data Layer: In-memory repositories`);
  console.log(`   - Service Layer: Business logic services`);
  console.log(`   - Controller Layer: REST API endpoints\n`);
});

export default app;
