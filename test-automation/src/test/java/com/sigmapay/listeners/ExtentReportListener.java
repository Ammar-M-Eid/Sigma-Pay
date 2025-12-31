package com.sigmapay.listeners;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import com.sigmapay.config.ConfigManager;
import com.sigmapay.utils.ScreenshotUtil;
import org.testng.*;

import java.io.IOException;

/**
 * ExtentReports Listener for test reporting
 */
public class ExtentReportListener implements ITestListener, ISuiteListener {
    private static ExtentReports extentReports;
    private static ThreadLocal<ExtentTest> extentTest = new ThreadLocal<>();
    
    @Override
    public void onStart(ISuite suite) {
        ConfigManager config = ConfigManager.getInstance();
        String reportPath = config.getReportsDirectory() + "/" + config.getExtentReportName();
        
        ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportPath);
        sparkReporter.config().setDocumentTitle("SigmaPay Test Report");
        sparkReporter.config().setReportName("Automation Test Results");
        sparkReporter.config().setTheme(Theme.STANDARD);
        
        extentReports = new ExtentReports();
        extentReports.attachReporter(sparkReporter);
        extentReports.setSystemInfo("Application", "SigmaPay");
        extentReports.setSystemInfo("Environment", "Test");
        extentReports.setSystemInfo("Browser", config.getBrowser());
    }
    
    @Override
    public void onFinish(ISuite suite) {
        if (extentReports != null) {
            extentReports.flush();
        }
    }
    
    @Override
    public void onTestStart(ITestResult result) {
        ExtentTest test = extentReports.createTest(result.getMethod().getMethodName());
        extentTest.set(test);
    }
    
    @Override
    public void onTestSuccess(ITestResult result) {
        extentTest.get().log(Status.PASS, "Test Passed");
    }
    
    @Override
    public void onTestFailure(ITestResult result) {
        extentTest.get().log(Status.FAIL, "Test Failed");
        extentTest.get().log(Status.FAIL, result.getThrowable());
        
        // Capture screenshot on failure
        try {
            String screenshotPath = ScreenshotUtil.captureScreenshot(result.getMethod().getMethodName());
            extentTest.get().addScreenCaptureFromPath(screenshotPath);
        } catch (IOException e) {
            extentTest.get().log(Status.WARNING, "Failed to capture screenshot: " + e.getMessage());
        }
    }
    
    @Override
    public void onTestSkipped(ITestResult result) {
        extentTest.get().log(Status.SKIP, "Test Skipped");
    }
}
