package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Profile Page Object Model
 */
public class ProfilePage extends BasePage {
    
    @FindBy(css = "input[type='email'], input[name='email']")
    private WebElement emailInput;
    
    @FindBy(css = "input[name='phoneNumber'], input[placeholder*='phone']")
    private WebElement phoneInput;
    
    @FindBy(css = "input[name='address'], input[placeholder*='address']")
    private WebElement addressInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Update') or contains(text(), 'Save')]")
    private WebElement updateButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public ProfilePage() {
        super();
    }
    
    // Page Actions
    public ProfilePage enterEmail(String email) {
        sendKeys(emailInput, email);
        return this;
    }
    
    public ProfilePage enterPhone(String phone) {
        sendKeys(phoneInput, phone);
        return this;
    }
    
    public ProfilePage enterAddress(String address) {
        sendKeys(addressInput, address);
        return this;
    }
    
    public ProfilePage clickUpdate() {
        click(updateButton);
        return this;
    }
    
    public ProfilePage updateProfile(String email, String phone, String address) {
        enterEmail(email);
        enterPhone(phone);
        enterAddress(address);
        clickUpdate();
        return this;
    }
    
    // Validation methods
    public boolean isProfilePageDisplayed() {
        return isElementDisplayed(emailInput) && 
               isElementDisplayed(updateButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
}
