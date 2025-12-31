package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Reports Page Object Model
 */
public class ReportsPage extends BasePage {
    
    @FindBy(xpath = "//button[contains(text(), 'Generate Monthly Summary') or contains(text(), 'Monthly')]")
    private WebElement generateMonthlySummaryButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Generate Income Statement') or contains(text(), 'Income')]")
    private WebElement generateIncomeStatementButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    @FindBy(css = "canvas, svg")
    private WebElement chart;
    
    // Constructor
    public ReportsPage() {
        super();
    }
    
    // Page Actions
    public ReportsPage clickGenerateMonthlySummary() {
        scrollToElement(generateMonthlySummaryButton);
        click(generateMonthlySummaryButton);
        return this;
    }
    
    public ReportsPage clickGenerateIncomeStatement() {
        scrollToElement(generateIncomeStatementButton);
        click(generateIncomeStatementButton);
        return this;
    }
    
    // Validation methods
    public boolean isReportsPageDisplayed() {
        return isElementDisplayed(generateMonthlySummaryButton) && 
               isElementDisplayed(generateIncomeStatementButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
    
    public boolean isChartDisplayed() {
        return isElementDisplayed(chart);
    }
}
