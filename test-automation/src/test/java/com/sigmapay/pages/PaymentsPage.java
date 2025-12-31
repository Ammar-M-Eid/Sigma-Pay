package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Payments Page Object Model
 */
public class PaymentsPage extends BasePage {
    
    @FindBy(css = "input[name='methodId'], input[placeholder*='method']")
    private WebElement methodIdInput;
    
    @FindBy(css = "input[type='number'], input[placeholder*='amount']")
    private WebElement amountInput;
    
    @FindBy(css = "input[name='merchantId'], input[placeholder*='merchant']")
    private WebElement merchantIdInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Process Payment')]")
    private WebElement processPaymentButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public PaymentsPage() {
        super();
    }
    
    // Page Actions
    public PaymentsPage enterMethodId(String methodId) {
        sendKeys(methodIdInput, methodId);
        return this;
    }
    
    public PaymentsPage enterAmount(String amount) {
        sendKeys(amountInput, amount);
        return this;
    }
    
    public PaymentsPage enterMerchantId(String merchantId) {
        sendKeys(merchantIdInput, merchantId);
        return this;
    }
    
    public PaymentsPage clickProcessPayment() {
        click(processPaymentButton);
        return this;
    }
    
    public PaymentsPage processPayment(String methodId, String amount, String merchantId) {
        enterMethodId(methodId);
        enterAmount(amount);
        enterMerchantId(merchantId);
        clickProcessPayment();
        return this;
    }
    
    // Validation methods
    public boolean isPaymentsPageDisplayed() {
        return isElementDisplayed(amountInput) && 
               isElementDisplayed(processPaymentButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
}
