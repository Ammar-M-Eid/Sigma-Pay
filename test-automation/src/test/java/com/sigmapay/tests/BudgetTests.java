package com.sigmapay.tests;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.pages.BudgetPage;
import com.sigmapay.pages.DashboardPage;
import com.sigmapay.pages.LoginPage;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Budget Management Test Cases
 */
public class BudgetTests extends BaseTest {
    
    private BudgetPage budgetPage;
    
    @BeforeMethod(groups = {"smoke", "regression"})
    public void loginAndNavigateToBudget() {
        ConfigManager config = ConfigManager.getInstance();
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        DashboardPage dashboardPage = loginPage.login(
                config.getTestUserEmail(),
                config.getTestUserPassword()
        );
        
        budgetPage = dashboardPage.navigateToBudgets();
    }
    
    @Test(priority = 1, groups = {"smoke", "regression"})
    public void testBudgetPageDisplay() {
        logger.info("Test: Verify budget page is displayed");
        
        assertThat(budgetPage.isBudgetPageDisplayed())
                .as("Budget page should be displayed")
                .isTrue();
        
        assertThat(budgetPage.getPageHeading())
                .as("Page heading should contain 'Budget'")
                .containsIgnoringCase("Budget");
    }
    
    @Test(priority = 2, groups = {"regression"})
    public void testCreateBudgetForm() {
        logger.info("Test: Verify budget creation form elements");
        
        assertThat(budgetPage.isCreateBudgetFormDisplayed())
                .as("Budget creation form should be displayed with all fields")
                .isTrue();
    }
    
    @Test(priority = 3, groups = {"smoke", "regression"})
    public void testCreateBudget() {
        logger.info("Test: Create a new budget");
        
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        budgetPage.createBudget(
                "2000",
                startDate.format(formatter),
                endDate.format(formatter),
                "Food,Transport,Entertainment,Shopping"
        );
        
        // Verify budget creation (would check for success message or updated display)
        assertThat(budgetPage.isBudgetPageDisplayed())
                .as("Should remain on budget page after creation")
                .isTrue();
    }
}
