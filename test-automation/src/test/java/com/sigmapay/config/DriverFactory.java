package com.sigmapay.config;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 * WebDriver Factory for creating and configuring WebDriver instances
 */
public class DriverFactory {
    private static final Logger logger = LoggerFactory.getLogger(DriverFactory.class);
    private static final ThreadLocal<WebDriver> driver = new ThreadLocal<>();
    
    public static WebDriver getDriver() {
        if (driver.get() == null) {
            driver.set(createDriver());
        }
        return driver.get();
    }
    
    private static WebDriver createDriver() {
        ConfigManager config = ConfigManager.getInstance();
        String browser = config.getBrowser().toLowerCase();
        boolean headless = config.isHeadless();
        
        WebDriver webDriver;
        
        switch (browser) {
            case "chrome":
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                if (headless) {
                    chromeOptions.addArguments("--headless=new");
                }
                chromeOptions.addArguments("--no-sandbox");
                chromeOptions.addArguments("--disable-dev-shm-usage");
                chromeOptions.addArguments("--disable-gpu");
                chromeOptions.addArguments("--window-size=1920,1080");
                webDriver = new ChromeDriver(chromeOptions);
                logger.info("Chrome driver initialized");
                break;
                
            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                if (headless) {
                    firefoxOptions.addArguments("--headless");
                }
                webDriver = new FirefoxDriver(firefoxOptions);
                logger.info("Firefox driver initialized");
                break;
                
            case "edge":
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                if (headless) {
                    edgeOptions.addArguments("--headless");
                }
                webDriver = new EdgeDriver(edgeOptions);
                logger.info("Edge driver initialized");
                break;
                
            default:
                throw new IllegalArgumentException("Unsupported browser: " + browser);
        }
        
        // Configure timeouts
        webDriver.manage().timeouts()
                .implicitlyWait(Duration.ofSeconds(config.getImplicitWait()));
        webDriver.manage().timeouts()
                .pageLoadTimeout(Duration.ofSeconds(config.getPageLoadTimeout()));
        
        // Maximize window
        webDriver.manage().window().maximize();
        
        return webDriver;
    }
    
    public static void quitDriver() {
        if (driver.get() != null) {
            driver.get().quit();
            driver.remove();
            logger.info("Driver quit successfully");
        }
    }
}
