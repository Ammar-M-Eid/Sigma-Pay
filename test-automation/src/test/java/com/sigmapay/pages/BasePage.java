package com.sigmapay.pages;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.config.DriverFactory;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 * Base Page class with common methods for all page objects
 */
public abstract class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected Logger logger = LoggerFactory.getLogger(this.getClass());
    protected ConfigManager config;
    
    public BasePage() {
        this.driver = DriverFactory.getDriver();
        this.config = ConfigManager.getInstance();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(config.getExplicitWait()));
        PageFactory.initElements(driver, this);
    }
    
    // Wait methods
    protected WebElement waitForElementVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }
    
    protected WebElement waitForElementClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }
    
    protected void waitForElementInvisible(By locator) {
        wait.until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }
    
    // Click methods
    protected void click(WebElement element) {
        waitForElementClickable(element);
        element.click();
        logger.info("Clicked on element: " + element);
    }
    
    protected void clickWithJS(WebElement element) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].click();", element);
        logger.info("Clicked element with JavaScript: " + element);
    }
    
    // Input methods
    protected void sendKeys(WebElement element, String text) {
        waitForElementVisible(element);
        element.clear();
        element.sendKeys(text);
        logger.info("Entered text '" + text + "' into element: " + element);
    }
    
    // Get text methods
    protected String getText(WebElement element) {
        waitForElementVisible(element);
        return element.getText();
    }
    
    // Validation methods
    protected boolean isElementDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    protected boolean isElementEnabled(WebElement element) {
        try {
            return element.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }
    
    // Navigation methods
    protected void navigateTo(String url) {
        driver.get(url);
        logger.info("Navigated to: " + url);
    }
    
    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
    
    protected String getPageTitle() {
        return driver.getTitle();
    }
    
    // Scroll methods
    protected void scrollToElement(WebElement element) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("arguments[0].scrollIntoView(true);", element);
    }
    
    // Wait for page load
    protected void waitForPageLoad() {
        wait.until(webDriver -> ((JavascriptExecutor) webDriver)
                .executeScript("return document.readyState").equals("complete"));
    }
    
    // Helper for WebElement from By
    private void waitForElementVisible(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
    }
    
    private void waitForElementClickable(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
    }
    
    // Public getter for driver (needed for advanced test operations)
    public WebDriver getDriver() {
        return driver;
    }
}
