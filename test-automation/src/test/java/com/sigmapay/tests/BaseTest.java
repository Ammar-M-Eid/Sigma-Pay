package com.sigmapay.tests;

import com.sigmapay.config.DriverFactory;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Base Test class for all test classes
 */
public class BaseTest {
    protected Logger logger = LoggerFactory.getLogger(this.getClass());
    
    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        logger.info("=== Starting Test ===");
        DriverFactory.getDriver();
    }
    
    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        logger.info("=== Ending Test ===");
        DriverFactory.quitDriver();
    }
}
