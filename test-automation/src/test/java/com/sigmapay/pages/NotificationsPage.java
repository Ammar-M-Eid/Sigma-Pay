package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Notifications Page Object Model
 */
public class NotificationsPage extends BasePage {
    
    @FindBy(css = "input[type='checkbox']:first-of-type")
    private WebElement emailNotificationsCheckbox;
    
    @FindBy(css = "input[type='checkbox']:nth-of-type(2)")
    private WebElement smsNotificationsCheckbox;
    
    @FindBy(xpath = "//button[contains(text(), 'Save') or contains(text(), 'Update')]")
    private WebElement saveButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public NotificationsPage() {
        super();
    }
    
    // Page Actions
    public NotificationsPage toggleEmailNotifications() {
        click(emailNotificationsCheckbox);
        return this;
    }
    
    public NotificationsPage toggleSmsNotifications() {
        click(smsNotificationsCheckbox);
        return this;
    }
    
    public NotificationsPage clickSave() {
        click(saveButton);
        return this;
    }
    
    // Validation methods
    public boolean isNotificationsPageDisplayed() {
        return isElementDisplayed(emailNotificationsCheckbox) && 
               isElementDisplayed(saveButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
}
