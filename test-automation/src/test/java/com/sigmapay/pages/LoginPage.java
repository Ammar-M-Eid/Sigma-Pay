package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Login Page Object Model
 */
public class LoginPage extends BasePage {
    
    @FindBy(css = "input[type='email'], input[placeholder*='email']")
    private WebElement emailInput;
    
    @FindBy(css = "input[type='password'], input[placeholder*='password']")
    private WebElement passwordInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Sign In')]")
    private WebElement signInButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Create New Account')]")
    private WebElement createAccountButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageTitle;
    
    // Constructor
    public LoginPage() {
        super();
    }
    
    // Page Actions
    public LoginPage openLoginPage() {
        navigateTo(config.getAppUrl());
        waitForPageLoad();
        logger.info("Opened login page");
        return this;
    }
    
    public LoginPage enterEmail(String email) {
        sendKeys(emailInput, email);
        return this;
    }
    
    public LoginPage enterPassword(String password) {
        sendKeys(passwordInput, password);
        return this;
    }
    
    public DashboardPage clickSignIn() {
        click(signInButton);
        logger.info("Clicked Sign In button");
        return new DashboardPage();
    }
    
    public DashboardPage login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        return clickSignIn();
    }
    
    public RegisterPage clickCreateAccount() {
        click(createAccountButton);
        return new RegisterPage();
    }
    
    // Validation methods
    public boolean isLoginPageDisplayed() {
        return isElementDisplayed(emailInput) && 
               isElementDisplayed(passwordInput) && 
               isElementDisplayed(signInButton);
    }
    
    public String getPageTitle() {
        return getText(pageTitle);
    }
    
    public boolean isSignInButtonEnabled() {
        return isElementEnabled(signInButton);
    }
}
