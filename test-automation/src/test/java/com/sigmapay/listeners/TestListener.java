package com.sigmapay.listeners;

import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * TestNG Listener for logging test execution
 */
public class TestListener implements ITestListener {
    private static final Logger logger = LoggerFactory.getLogger(TestListener.class);
    
    @Override
    public void onStart(ITestContext context) {
        logger.info("========================================");
        logger.info("Starting Test Suite: {}", context.getName());
        logger.info("========================================");
    }
    
    @Override
    public void onFinish(ITestContext context) {
        logger.info("========================================");
        logger.info("Finished Test Suite: {}", context.getName());
        logger.info("Tests Passed: {}", context.getPassedTests().size());
        logger.info("Tests Failed: {}", context.getFailedTests().size());
        logger.info("Tests Skipped: {}", context.getSkippedTests().size());
        logger.info("========================================");
    }
    
    @Override
    public void onTestStart(ITestResult result) {
        logger.info("Starting Test: {}", result.getMethod().getMethodName());
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        logger.info("✓ Test PASSED: {}", result.getMethod().getMethodName());
    }
    
    @Override
    public void onTestFailure(ITestResult result) {
        logger.error("✗ Test FAILED: {}", result.getMethod().getMethodName());
        logger.error("Failure Reason: {}", result.getThrowable().getMessage());
    }
    
    @Override
    public void onTestSkipped(ITestResult result) {
        logger.warn("⊘ Test SKIPPED: {}", result.getMethod().getMethodName());
    }
}
