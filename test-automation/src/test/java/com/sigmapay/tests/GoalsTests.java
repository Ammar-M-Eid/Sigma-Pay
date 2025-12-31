package com.sigmapay.tests;

import com.sigmapay.config.ConfigManager;
import com.sigmapay.pages.DashboardPage;
import com.sigmapay.pages.GoalsPage;
import com.sigmapay.pages.LoginPage;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Goals Management Test Cases
 */
public class GoalsTests extends BaseTest {
    
    private GoalsPage goalsPage;
    
    @BeforeMethod(groups = {"regression"})
    public void loginAndNavigateToGoals() {
        ConfigManager config = ConfigManager.getInstance();
        
        LoginPage loginPage = new LoginPage();
        loginPage.openLoginPage();
        
        DashboardPage dashboardPage = loginPage.login(
                config.getTestUserEmail(),
                config.getTestUserPassword()
        );
        
        goalsPage = dashboardPage.navigateToGoals();
    }
    
    @Test(priority = 1, groups = {"regression"})
    public void testGoalsPageDisplay() {
        logger.info("Test: Verify goals page is displayed");
        
        assertThat(goalsPage.isGoalsPageDisplayed())
                .as("Goals page should be displayed")
                .isTrue();
        
        assertThat(goalsPage.getPageHeading())
                .as("Page heading should contain 'Goal'")
                .containsIgnoringCase("Goal");
    }
    
    @Test(priority = 2, groups = {"regression"})
    public void testCreateGoalForm() {
        logger.info("Test: Verify goal creation form elements");
        
        assertThat(goalsPage.isSetGoalFormDisplayed())
                .as("Goal creation form should be displayed with all fields")
                .isTrue();
    }
    
    @Test(priority = 3, groups = {"regression"})
    public void testCreateGoal() {
        logger.info("Test: Create a new financial goal");
        
        LocalDate deadline = LocalDate.now().plusMonths(6);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        
        goalsPage.createGoal(
                "Savings",
                "5000",
                deadline.format(formatter),
                "Medium"
        );
        
        assertThat(goalsPage.isGoalsPageDisplayed())
                .as("Should remain on goals page after creation")
                .isTrue();
    }
}
