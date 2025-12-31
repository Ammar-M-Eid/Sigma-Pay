package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Register Page Object Model
 */
public class RegisterPage extends BasePage {
    
    @FindBy(css = "input[name='username'], input[placeholder*='username']")
    private WebElement usernameInput;
    
    @FindBy(css = "input[type='email'], input[placeholder*='email']")
    private WebElement emailInput;
    
    @FindBy(css = "input[type='password'], input[placeholder*='password']")
    private WebElement passwordInput;
    
    @FindBy(css = "input[name='phoneNumber'], input[placeholder*='phone']")
    private WebElement phoneInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Register') or contains(text(), 'Create Account')]")
    private WebElement registerButton;
    
    // Constructor
    public RegisterPage() {
        super();
    }
    
    // Page Actions
    public RegisterPage enterUsername(String username) {
        sendKeys(usernameInput, username);
        return this;
    }
    
    public RegisterPage enterEmail(String email) {
        sendKeys(emailInput, email);
        return this;
    }
    
    public RegisterPage enterPassword(String password) {
        sendKeys(passwordInput, password);
        return this;
    }
    
    public RegisterPage enterPhone(String phone) {
        sendKeys(phoneInput, phone);
        return this;
    }
    
    public DashboardPage clickRegister() {
        click(registerButton);
        return new DashboardPage();
    }
    
    public RegisterPage register(String username, String email, String password, String phone) {
        enterUsername(username);
        enterEmail(email);
        enterPassword(password);
        enterPhone(phone);
        clickRegister();
        return this;
    }
    
    // Validation methods
    public boolean isRegisterPageDisplayed() {
        return isElementDisplayed(usernameInput) && 
               isElementDisplayed(emailInput) && 
               isElementDisplayed(registerButton);
    }
}
