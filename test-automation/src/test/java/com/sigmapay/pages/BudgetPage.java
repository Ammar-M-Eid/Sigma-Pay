package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Budget Page Object Model
 */
public class BudgetPage extends BasePage {
    
    @FindBy(css = "input[type='number'], input[placeholder*='Amount']")
    private WebElement totalAmountInput;
    
    @FindBy(css = "input[type='date']:first-of-type, input[placeholder*='Start']")
    private WebElement startDateInput;
    
    @FindBy(css = "input[type='date']:last-of-type, input[placeholder*='End']")
    private WebElement endDateInput;
    
    @FindBy(css = "input[placeholder*='Categories'], textarea[placeholder*='Categories']")
    private WebElement categoriesInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Create Budget')]")
    private WebElement createBudgetButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Record Expense')]")
    private WebElement recordExpenseButton;
    
    @FindBy(css = "select[name='category'], select")
    private WebElement categoryDropdown;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public BudgetPage() {
        super();
    }
    
    // Create Budget Actions
    public BudgetPage enterTotalAmount(String amount) {
        sendKeys(totalAmountInput, amount);
        return this;
    }
    
    public BudgetPage enterStartDate(String date) {
        sendKeys(startDateInput, date);
        return this;
    }
    
    public BudgetPage enterEndDate(String date) {
        sendKeys(endDateInput, date);
        return this;
    }
    
    public BudgetPage enterCategories(String categories) {
        sendKeys(categoriesInput, categories);
        return this;
    }
    
    public BudgetPage clickCreateBudget() {
        click(createBudgetButton);
        return this;
    }
    
    public BudgetPage createBudget(String amount, String startDate, String endDate, String categories) {
        enterTotalAmount(amount);
        enterStartDate(startDate);
        enterEndDate(endDate);
        enterCategories(categories);
        clickCreateBudget();
        return this;
    }
    
    // Record Expense Actions
    public BudgetPage clickRecordExpense() {
        scrollToElement(recordExpenseButton);
        click(recordExpenseButton);
        return this;
    }
    
    // Validation methods
    public boolean isBudgetPageDisplayed() {
        return isElementDisplayed(totalAmountInput) && 
               isElementDisplayed(createBudgetButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
    
    public boolean isCreateBudgetFormDisplayed() {
        return isElementDisplayed(totalAmountInput) &&
               isElementDisplayed(startDateInput) &&
               isElementDisplayed(endDateInput) &&
               isElementDisplayed(categoriesInput);
    }
}
