package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.Select;

/**
 * Goals Page Object Model
 */
public class GoalsPage extends BasePage {
    
    @FindBy(css = "select[name='goalType'], select:first-of-type")
    private WebElement goalTypeDropdown;
    
    @FindBy(css = "input[type='number'], input[placeholder*='Amount']")
    private WebElement targetAmountInput;
    
    @FindBy(css = "input[type='date'], input[placeholder*='Deadline']")
    private WebElement deadlineInput;
    
    @FindBy(css = "select[name='priorityLevel'], select:last-of-type")
    private WebElement priorityLevelDropdown;
    
    @FindBy(xpath = "//button[contains(text(), 'Set Goal')]")
    private WebElement setGoalButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Track Progress')]")
    private WebElement trackProgressButton;
    
    @FindBy(css = "input[placeholder*='goal ID'], input[name='goalId']")
    private WebElement goalIdInput;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public GoalsPage() {
        super();
    }
    
    // Page Actions
    public GoalsPage selectGoalType(String goalType) {
        Select select = new Select(goalTypeDropdown);
        select.selectByVisibleText(goalType);
        return this;
    }
    
    public GoalsPage enterTargetAmount(String amount) {
        sendKeys(targetAmountInput, amount);
        return this;
    }
    
    public GoalsPage enterDeadline(String date) {
        sendKeys(deadlineInput, date);
        return this;
    }
    
    public GoalsPage selectPriorityLevel(String priority) {
        Select select = new Select(priorityLevelDropdown);
        select.selectByVisibleText(priority);
        return this;
    }
    
    public GoalsPage clickSetGoal() {
        click(setGoalButton);
        return this;
    }
    
    public GoalsPage createGoal(String goalType, String amount, String deadline, String priority) {
        selectGoalType(goalType);
        enterTargetAmount(amount);
        enterDeadline(deadline);
        selectPriorityLevel(priority);
        clickSetGoal();
        return this;
    }
    
    public GoalsPage enterGoalId(String goalId) {
        scrollToElement(goalIdInput);
        sendKeys(goalIdInput, goalId);
        return this;
    }
    
    public GoalsPage clickTrackProgress() {
        click(trackProgressButton);
        return this;
    }
    
    // Validation methods
    public boolean isGoalsPageDisplayed() {
        return isElementDisplayed(goalTypeDropdown) && 
               isElementDisplayed(setGoalButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
    
    public boolean isSetGoalFormDisplayed() {
        return isElementDisplayed(goalTypeDropdown) &&
               isElementDisplayed(targetAmountInput) &&
               isElementDisplayed(deadlineInput) &&
               isElementDisplayed(priorityLevelDropdown);
    }
}
