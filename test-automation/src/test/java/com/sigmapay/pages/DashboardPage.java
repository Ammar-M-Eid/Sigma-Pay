package com.sigmapay.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Dashboard Page Object Model (Main page after login)
 */
public class DashboardPage extends BasePage {
    
    @FindBy(xpath = "//button[contains(text(), 'Budgets') or contains(.,'💵')]")
    private WebElement budgetsButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Goals') or contains(.,'🎯')]")
    private WebElement goalsButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Groups') or contains(.,'👥')]")
    private WebElement groupsButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Payments') or contains(.,'💳')]")
    private WebElement paymentsButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Reports') or contains(.,'📈')]")
    private WebElement reportsButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Alerts') or contains(.,'🔔')]")
    private WebElement alertsButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Profile') or contains(.,'👤')]")
    private WebElement profileButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Logout') or contains(.,'🚪')]")
    private WebElement logoutButton;
    
    @FindBy(css = "h1, h2")
    private WebElement pageHeading;
    
    // Constructor
    public DashboardPage() {
        super();
    }
    
    // Navigation methods
    public BudgetPage navigateToBudgets() {
        click(budgetsButton);
        return new BudgetPage();
    }
    
    public GoalsPage navigateToGoals() {
        click(goalsButton);
        return new GoalsPage();
    }
    
    public GroupSavingsPage navigateToGroups() {
        click(groupsButton);
        return new GroupSavingsPage();
    }
    
    public PaymentsPage navigateToPayments() {
        click(paymentsButton);
        return new PaymentsPage();
    }
    
    public ReportsPage navigateToReports() {
        click(reportsButton);
        return new ReportsPage();
    }
    
    public NotificationsPage navigateToAlerts() {
        click(alertsButton);
        return new NotificationsPage();
    }
    
    public ProfilePage navigateToProfile() {
        click(profileButton);
        return new ProfilePage();
    }
    
    public LoginPage logout() {
        click(logoutButton);
        return new LoginPage();
    }
    
    // Validation methods
    public boolean isDashboardDisplayed() {
        return isElementDisplayed(budgetsButton) && 
               isElementDisplayed(goalsButton) && 
               isElementDisplayed(logoutButton);
    }
    
    public String getPageHeading() {
        return getText(pageHeading);
    }
    
    public boolean isNavigationMenuDisplayed() {
        return isElementDisplayed(budgetsButton) &&
               isElementDisplayed(goalsButton) &&
               isElementDisplayed(paymentsButton) &&
               isElementDisplayed(reportsButton);
    }
}
